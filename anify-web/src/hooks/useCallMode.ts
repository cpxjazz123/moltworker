import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useMurf } from './useMurf';
import { useGameData } from '../contexts/GameDataContext';

export type CallState = 'listening' | 'thinking' | 'speaking' | 'idle';

export interface CallModeConfig {
    elevenLabsApiKey: string; // Keeping prop name for now to minimize refactor, but it will be Murf Key
    voiceId?: string;
    silenceTimeout?: number;
}

export function useCallMode(config: CallModeConfig) {
    const [callState, setCallState] = useState<CallState>('idle');
    const [transcript, setTranscript] = useState('');

    const { currentCharacterMessages, sendVoiceMessage } = useGameData();

    // Switch to Murf
    const {
        state: ttsState,
        speak: ttsSpeak,
        stop: ttsStop
    } = useMurf({
        apiKey: import.meta.env.VITE_MURF_API_KEY || config.elevenLabsApiKey,
        voiceId: config.voiceId
    });

    // Use a ref to track the last processed message ID to avoid re-speaking
    const lastProcessedMessageIdRef = useRef<string | null>(null);
    const isHandlingResponseRef = useRef(false);

    const onSpeechEnd = useCallback(() => {
        // Recognition ended
    }, []);

    // HOOKS MUST BE DEFINED BEFORE CALLBACKS THAT USE THEM (if they are passed as dependencies)
    const {
        state: sttState,
        start: sttStart,
        stop: sttStop,
        abort: sttAbort,
        reset: sttReset
    } = useSpeechRecognition({
        onResult: (text: string, isFinal: boolean) => onSpeechResult(text, isFinal),
        onEnd: onSpeechEnd,
    });

    const onSpeechResult = useCallback((text: string, isFinal: boolean) => {
        if (isFinal) {
            setTranscript(prev => {
                const updated = (prev + ' ' + text).trim();
                return updated;
            });
        }

        // Interruption logic: If speaking, stop TTS and go to IDLE
        if (callState === 'speaking') {
            console.log('[useCallMode] Speech interrupted, reverting to IDLE');
            ttsStop();
            sttAbort();
            setCallState('idle');
        }
    }, [callState, ttsStop, sttAbort]);

    const handleSend = useCallback(async () => {
        const combined = (sttState.transcript + ' ' + sttState.interimTranscript).trim();
        const finalText = combined || transcript.trim();

        if (!finalText) {
            console.log('[useCallMode] Empty transcript, reverting to IDLE');
            setCallState('idle');
            sttAbort();
            return;
        }

        console.log('[useCallMode] Manually sending transcript:', finalText);
        setCallState('thinking');
        isHandlingResponseRef.current = true;
        sttAbort();

        try {
            await sendVoiceMessage(finalText);
            setTranscript('');
            sttReset();
        } catch (e) {
            console.error('Failed to send', e);
            setCallState('idle');
            isHandlingResponseRef.current = false;
        }
    }, [transcript, sttState.transcript, sttState.interimTranscript, sendVoiceMessage, sttReset, sttAbort]);

    const handleAIResponse = useCallback(async (text: string) => {
        setCallState('speaking');
        isHandlingResponseRef.current = true;

        let textToSpeak = text;
        let voiceId = config.voiceId;

        try {
            const lines = text.split('\n');
            const firstLine = lines[0].trim();
            if (firstLine.startsWith('{') && firstLine.endsWith('}')) {
                const json = JSON.parse(firstLine);
                if (json.voice) voiceId = json.voice;
                textToSpeak = lines.slice(1).join('\n').trim();
            }
        } catch (e) { }

        await ttsSpeak(textToSpeak, voiceId);
    }, [config.voiceId, ttsSpeak]);

    useEffect(() => {
        if (callState === 'thinking') {
            const lastMsg = currentCharacterMessages[currentCharacterMessages.length - 1];
            if (lastMsg &&
                lastMsg.sender !== 'player' &&
                lastMsg.id !== lastProcessedMessageIdRef.current &&
                lastMsg.status === 'final'
            ) {
                lastProcessedMessageIdRef.current = lastMsg.id;
                handleAIResponse(lastMsg.content);
            }
        }
    }, [currentCharacterMessages, callState, handleAIResponse]);

    // Watch TTS state to transition back to IDLE
    useEffect(() => {
        const isActuallySpeaking = ttsState.isSpeaking || ttsState.isLoading;

        if (callState === 'speaking' && !isActuallySpeaking) {
            console.log('[useCallMode] TTS finished, reverting to IDLE');
            setCallState('idle');
            isHandlingResponseRef.current = false;
            sttReset();
            sttAbort();
            ttsStop();
        }
    }, [ttsState.isSpeaking, ttsState.isLoading, callState, sttReset, sttAbort, ttsStop]);

    const startCall = useCallback(() => {
        setCallState('listening');
        setTranscript('');
        sttReset();
        sttStart();
    }, [sttStart, sttReset]);

    const endCall = useCallback(() => {
        setCallState('idle');
        sttAbort();
        ttsStop();
        isHandlingResponseRef.current = false;
    }, [sttAbort, ttsStop]);

    return {
        callState,
        transcript: transcript || sttState.transcript || sttState.interimTranscript,
        startCall,
        endCall,
        finishListening: handleSend,
        sttState,
        ttsState,
    };
}
