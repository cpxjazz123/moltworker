import { useState, useEffect, useCallback, useRef } from 'react';

export interface TTSState {
    isSpeaking: boolean;
    isPaused: boolean;
    isSupported: boolean;
    voices: SpeechSynthesisVoice[];
    error: string | null;
}

export interface TTSControls {
    speak: (text: string, options?: TTSOptions) => void;
    pause: () => void;
    resume: () => void;
    cancel: () => void;
    setVoice: (voice: SpeechSynthesisVoice) => void;
}

export interface TTSOptions {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
}

export function useTextToSpeech() {
    const [state, setState] = useState<TTSState>({
        isSpeaking: false,
        isPaused: false,
        isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
        voices: [],
        error: null,
    });

    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Load voices
    useEffect(() => {
        if (!state.isSupported) return;

        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            setState(prev => ({ ...prev, voices }));

            // Auto-select a nice Chinese voice if available
            if (!selectedVoice) {
                const cnVoice = voices.find(v => v.lang.includes('zh-CN') && !v.name.includes('Google')); // Prefer native if possible
                if (cnVoice) setSelectedVoice(cnVoice);
            }
        };

        loadVoices();

        // Chrome requires this event to load voices
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, [state.isSupported, selectedVoice]);

    const speak = useCallback((text: string, options: TTSOptions = {}) => {
        if (!state.isSupported) {
            setState(prev => ({ ...prev, error: 'TTS not supported' }));
            return;
        }

        // Cancel current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Config
        utterance.lang = options.lang || 'zh-CN';
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        // Select voice
        const voice = options.voice || selectedVoice || state.voices.find(v => v.lang.includes(utterance.lang)) || state.voices[0];
        if (voice) {
            utterance.voice = voice;
        }

        // Events
        utterance.onstart = () => {
            setState(prev => ({ ...prev, isSpeaking: true, isPaused: false, error: null }));
        };

        utterance.onend = () => {
            setState(prev => ({ ...prev, isSpeaking: false, isPaused: false }));
        };

        utterance.onerror = (event) => {
            console.error('TTS Error:', event);
            setState(prev => ({ ...prev, isSpeaking: false, error: event.error === 'interrupted' ? null : 'TTS failed' }));
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);

        console.log(`[useTextToSpeech] Speaking: "${text.slice(0, 20)}..." (Voice: ${voice?.name})`);
    }, [state.isSupported, state.voices, selectedVoice]);

    const pause = useCallback(() => {
        if (state.isSupported && state.isSpeaking) {
            window.speechSynthesis.pause();
            setState(prev => ({ ...prev, isPaused: true }));
        }
    }, [state.isSupported, state.isSpeaking]);

    const resume = useCallback(() => {
        if (state.isSupported && state.isPaused) {
            window.speechSynthesis.resume();
            setState(prev => ({ ...prev, isPaused: false }));
        }
    }, [state.isSupported, state.isPaused]);

    const cancel = useCallback(() => {
        if (state.isSupported) {
            window.speechSynthesis.cancel();
            setState(prev => ({ ...prev, isSpeaking: false, isPaused: false }));
        }
    }, [state.isSupported]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (state.isSpeaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, [state.isSpeaking]);

    return {
        state,
        speak,
        pause,
        resume,
        cancel,
        setVoice: setSelectedVoice,
    };
}
