import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export interface SpeechRecognitionState {
    isListening: boolean;
    transcript: string;
    interimTranscript: string;
    isSupported: boolean;
    error: string | null;
}

export interface SpeechRecognitionHook {
    state: SpeechRecognitionState;
    start: () => void;
    stop: () => void;
    abort: () => void;
    reset: () => void;
}

export function useSpeechRecognition({
    onResult,
    onEnd,
    onError,
}: {
    onResult?: (transcript: string, isFinal: boolean) => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
} = {}): SpeechRecognitionHook {
    const [state, setState] = useState<SpeechRecognitionState>({
        isListening: false,
        transcript: '',
        interimTranscript: '',
        isSupported: typeof window !== 'undefined' &&
            !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
        error: null,
    });

    // Store handlers in a ref to avoid re-running the Effect when they change.
    // This is CRITICAL because onResult often depends on callState which changes constantly.
    const handlersRef = useRef({ onResult, onEnd, onError });
    useEffect(() => {
        handlersRef.current = { onResult, onEnd, onError };
    }, [onResult, onEnd, onError]);

    const recognitionRef = useRef<any>(null);
    const isListeningRef = useRef(false);

    useEffect(() => {
        if (!state.isSupported) return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'zh-CN'; // Default to Chinese

        recognition.onstart = () => {
            if (recognition !== recognitionRef.current) return;
            isListeningRef.current = true;
            setState(prev => ({ ...prev, isListening: true, error: null }));
        };

        recognition.onend = () => {
            if (recognition !== recognitionRef.current) return;
            isListeningRef.current = false;
            setState(prev => ({ ...prev, isListening: false }));
            handlersRef.current.onEnd?.();
        };

        recognition.onresult = (event: any) => {
            if (recognition !== recognitionRef.current) return;

            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                    handlersRef.current.onResult?.(event.results[i][0].transcript, true);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            setState(prev => ({
                ...prev,
                transcript: prev.transcript + finalTranscript,
                interimTranscript,
            }));

            if (interimTranscript) {
                handlersRef.current.onResult?.(interimTranscript, false);
            }
        };

        recognition.onerror = (event: any) => {
            // GUARD: Only handle errors for the CURRENT active instance.
            // This prevents stale handlers from previous iterations causing infinite loops.
            if (recognition !== recognitionRef.current) return;

            if (event.error === 'aborted') {
                if (!isListeningRef.current) {
                    // This was an intentional shutdown (stop/abort), silence it
                    return;
                }
            }

            if (event.error === 'aborted' || event.error === 'no-speech') {
                if (isListeningRef.current) {
                    // Try to recover only if we still intend to be listening
                    console.log(`[useSpeechRecognition] Recovering from ${event.error}...`);
                    setTimeout(() => {
                        if (isListeningRef.current && recognition === recognitionRef.current) {
                            try {
                                recognition.start();
                                setState(prev => ({ ...prev, error: null }));
                            } catch (e) {
                                console.error('Failed to restart recognition:', e);
                            }
                        }
                    }, 500);
                    return;
                }
            }

            console.warn('[useSpeechRecognition] Error:', event.error);
            setState(prev => ({ ...prev, error: event.error }));
            handlersRef.current.onError?.(event.error);
        };

        return () => {
            // Explicitly detach to prevent stale events
            isListeningRef.current = false;
            recognition.onstart = null;
            recognition.onend = null;
            recognition.onerror = null;
            recognition.onresult = null;
            try {
                recognition.stop();
            } catch (e) { }
            if (recognitionRef.current === recognition) {
                recognitionRef.current = null;
            }
        };
    }, [state.isSupported]); // Removed handlers from dependencies - only re-run on support change

    const start = useCallback(() => {
        if (!recognitionRef.current) return;
        if (isListeningRef.current) return;

        try {
            recognitionRef.current.start();
        } catch (e) {
            console.warn('[useSpeechRecognition] Start error:', e);
        }
    }, []);

    const stop = useCallback(() => {
        if (recognitionRef.current) {
            isListeningRef.current = false;
            try {
                recognitionRef.current.stop();
            } catch (e) {
                console.warn('[useSpeechRecognition] Stop error:', e);
            }
        }
    }, []);

    const abort = useCallback(() => {
        if (recognitionRef.current) {
            isListeningRef.current = false;
            try {
                recognitionRef.current.abort();
            } catch (e) {
                console.warn('[useSpeechRecognition] Abort error:', e);
            }
        }
    }, []);

    const reset = useCallback(() => {
        setState(prev => ({ ...prev, transcript: '', interimTranscript: '', error: null }));
    }, []);

    return useMemo(() => ({ state, start, stop, abort, reset }), [state, start, stop, abort, reset]);
}
