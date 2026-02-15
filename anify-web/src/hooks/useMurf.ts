import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

export interface MurfState {
    isSpeaking: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface MurfConfig {
    apiKey: string;
    voiceId?: string;
    model?: string;
}

// Module-level singletons to prevent resource accumulation and re-init pops
let sharedAudioContext: AudioContext | null = null;
let sharedGainNode: GainNode | null = null;

export function useMurf(config: MurfConfig) {
    const [state, setState] = useState<MurfState>({
        isSpeaking: false,
        isLoading: false,
        error: null,
    });

    const wsRef = useRef<WebSocket | null>(null);
    const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

    const initAudioContext = useCallback(() => {
        if (!sharedAudioContext) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            sharedAudioContext = new AudioCtx();

            // Create a GainNode for smooth volume control and fading
            sharedGainNode = sharedAudioContext.createGain();
            sharedGainNode.connect(sharedAudioContext.destination);
        }
        if (sharedAudioContext.state === 'suspended') {
            sharedAudioContext.resume();
        }
    }, []);

    const playBuffer = useCallback(async (buffer: AudioBuffer) => {
        if (!sharedAudioContext || !sharedGainNode) return;

        // Stop any previous playback
        if (currentSourceRef.current) {
            try {
                currentSourceRef.current.stop();
            } catch (e) { }
        }

        const source = sharedAudioContext.createBufferSource();
        source.buffer = buffer;

        // Connect through the shared GainNode to prevent pops
        source.connect(sharedGainNode);

        // Quick fade in to prevent attack click
        sharedGainNode.gain.setValueAtTime(0, sharedAudioContext.currentTime);
        sharedGainNode.gain.linearRampToValueAtTime(1, sharedAudioContext.currentTime + 0.01);

        source.onended = () => {
            setState(prev => ({ ...prev, isSpeaking: false }));
            if (currentSourceRef.current === source) {
                currentSourceRef.current = null;
            }
            // Explicitly disconnect to help garbage collection
            try { source.disconnect(); } catch (e) { }
        };

        currentSourceRef.current = source;
        source.start();
        setState(prev => ({ ...prev, isSpeaking: true }));
    }, []);

    const stop = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        // Smoothly fade out using the shared gain node to prevent "popping" noise
        if (sharedGainNode && sharedAudioContext) {
            const now = sharedAudioContext.currentTime;
            sharedGainNode.gain.cancelScheduledValues(now);
            sharedGainNode.gain.setValueAtTime(sharedGainNode.gain.value, now);
            sharedGainNode.gain.linearRampToValueAtTime(0, now + 0.05); // 50ms fade
        }

        // Delay the actual stop slightly to let the fade finish
        setTimeout(() => {
            if (currentSourceRef.current) {
                try {
                    currentSourceRef.current.stop();
                } catch (e) { }
                currentSourceRef.current = null;
            }
            setState(prev => ({ ...prev, isSpeaking: false, isLoading: false }));
        }, 60);

    }, []);

    const initWebSocket = useCallback(async () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return wsRef.current;

        return new Promise<WebSocket>((resolve, reject) => {
            const wsUrl = `wss://global.api.murf.ai/v1/speech/stream-input?api_key=${config.apiKey}&model=${config.model || 'FALCON'}`;
            console.log('[useMurf] Connecting to WebSocket...', wsUrl.replace(config.apiKey, '***'));
            const ws = new WebSocket(wsUrl);

            // Closure-local chunks to prevent buffer contamination across connections
            const localChunks: Uint8Array[] = [];

            ws.onopen = () => {
                console.log('[useMurf] WebSocket connected');
                wsRef.current = ws;
                resolve(ws);
            };

            ws.onmessage = async (event) => {
                // Instance guard: ignore if this is an old connection
                if (ws !== wsRef.current) {
                    console.log('[useMurf] Ignoring message from stale WebSocket');
                    ws.close();
                    return;
                }

                try {
                    const data = JSON.parse(event.data);

                    if (data.audio) {
                        const binaryString = window.atob(data.audio);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        localChunks.push(bytes);
                    } else if (data.final) {
                        console.log('[useMurf] Stream finished, assembling audio...');
                        if (localChunks.length > 0 && sharedAudioContext) {
                            const totalLength = localChunks.reduce((acc, chunk) => acc + chunk.length, 0);
                            const combined = new Uint8Array(totalLength);
                            let offset = 0;
                            for (const chunk of localChunks) {
                                combined.set(chunk, offset);
                                offset += chunk.length;
                            }

                            try {
                                const audioBuffer = await sharedAudioContext.decodeAudioData(combined.buffer);
                                setState(prev => ({ ...prev, isLoading: false }));
                                playBuffer(audioBuffer);
                            } catch (decodeErr) {
                                console.error('[useMurf] Audio decode error:', decodeErr);
                                setState(prev => ({ ...prev, isLoading: false, error: 'Failed to decode audio' }));
                            }
                        } else {
                            setState(prev => ({ ...prev, isLoading: false }));
                        }
                    } else if (data.errorMessage || data.errorCode) {
                        console.error('[useMurf] API Error:', data);
                        setState(prev => ({ ...prev, isLoading: false, error: data.errorMessage || 'Unknown API Error' }));
                    }
                } catch (err) {
                    console.error('[useMurf] WS Message parsing error:', err);
                }
            };

            ws.onerror = (err) => {
                console.error('[useMurf] WebSocket error:', err);
                setState(prev => ({ ...prev, error: 'WebSocket connection failed' }));
                reject(err);
            };

            ws.onclose = (event) => {
                console.log('[useMurf] WebSocket closed:', event.code, event.reason);
                wsRef.current = null;
                // Don't reset isSpeaking here as it might be playing the final assembled buffer
            };
        });
    }, [config.apiKey, config.model, playBuffer]);

    const speak = useCallback(async (text: string, overrideVoiceId?: string) => {
        if (!text || !config.apiKey) return;

        try {
            console.log(`[useMurf] Speak request: "${text.slice(0, 30)}..."`);
            initAudioContext();

            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const ws = await initWebSocket();

            // 1. Send voice configuration
            const isChinese = /[\u4e00-\u9fa5]/.test(text);
            const defaultVoice = isChinese ? 'zh-CN-jiao' : (config.voiceId || 'en-US-marcus');

            const voiceConfig = {
                voice_config: {
                    voice_id: overrideVoiceId || defaultVoice,
                    style: 'Conversational',
                    multi_native_locale: isChinese ? 'zh-CN' : 'en-US'
                }
            };

            console.log('[useMurf] Sending config:', voiceConfig);
            ws.send(JSON.stringify(voiceConfig));

            // 2. Send text
            const textPayload = {
                text: text,
                end: true
            };
            console.log('[useMurf] Sending text:', textPayload);
            ws.send(JSON.stringify(textPayload));

            // isLoading state is now managed in onmessage (final/error)
        } catch (err) {
            console.error('[useMurf] TTS Error:', err);
            setState(prev => ({ ...prev, isLoading: false, isSpeaking: false, error: String(err) }));
        }
    }, [config.apiKey, config.voiceId, initAudioContext, initWebSocket]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, []);

    return useMemo(() => ({ state, speak, stop }), [state, speak, stop]);
}
