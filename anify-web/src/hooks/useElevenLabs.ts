import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

export interface ElevenLabsState {
    isSpeaking: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface ElevenLabsConfig {
    apiKey: string;
    voiceId?: string; // Default voice ID
    modelId?: string; // e.g. eleven_monolingual_v1
}

export function useElevenLabs(config: ElevenLabsConfig) {
    const [state, setState] = useState<ElevenLabsState>({
        isSpeaking: false,
        isLoading: false,
        error: null,
    });

    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    const initAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    }, []);

    const stop = useCallback(() => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current.disconnect();
            sourceNodeRef.current = null;
        }
        setState(prev => ({ ...prev, isSpeaking: false, isLoading: false }));
    }, []);

    const speak = useCallback(async (text: string, overrideVoiceId?: string) => {
        if (!text || !config.apiKey) return;

        try {
            initAudioContext();
            stop(); // Stop any current speech

            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const voiceId = overrideVoiceId || config.voiceId || '21m00Tcm4TlvDq8ikWAM'; // Default to Rachel
            const modelId = config.modelId || 'eleven_monolingual_v1';

            console.log(`[useElevenLabs] Fetching TTS for: "${text.slice(0, 20)}..." (Voice: ${voiceId})`);

            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': config.apiKey,
                },
                body: JSON.stringify({
                    text,
                    model_id: modelId,
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const audioContext = audioContextRef.current!;
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;

            const gainNode = audioContext.createGain();
            gainNode.gain.value = 1.0;
            gainNodeRef.current = gainNode;

            source.connect(gainNode);
            gainNode.connect(audioContext.destination);

            source.onended = () => {
                setState(prev => ({ ...prev, isSpeaking: false }));
            };

            source.start();
            sourceNodeRef.current = source;
            setState(prev => ({ ...prev, isSpeaking: true, isLoading: false }));

        } catch (err) {
            console.error('[useElevenLabs] TTS Error:', err);
            setState(prev => ({ ...prev, isLoading: false, isSpeaking: false, error: String(err) }));
        }
    }, [config.apiKey, config.voiceId, config.modelId, initAudioContext, stop]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    return useMemo(() => ({ state, speak, stop }), [state, speak, stop]);
}
