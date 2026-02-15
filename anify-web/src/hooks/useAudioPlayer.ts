import { useState, useRef, useCallback, useEffect } from 'react';

export interface AudioPlayerState {
    isPlaying: boolean;
    isPaused: boolean;
    duration: number;
    currentTime: number;
    error: string | null;
}

export interface AudioPlayerControls {
    play: (audioSource: Blob | string) => Promise<void>;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    seek: (time: number) => void;
}

export function useAudioPlayer() {
    const [state, setState] = useState<AudioPlayerState>({
        isPlaying: false,
        isPaused: false,
        duration: 0,
        currentTime: 0,
        error: null,
    });

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const currentUrlRef = useRef<string | null>(null);

    // Cleanup function
    const cleanup = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current = null;
        }
        if (currentUrlRef.current && currentUrlRef.current.startsWith('blob:')) {
            URL.revokeObjectURL(currentUrlRef.current);
            currentUrlRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        sourceNodeRef.current = null;
    }, []);

    // Play audio
    const play = useCallback(async (audioSource: Blob | string) => {
        try {
            cleanup();

            const audio = new Audio();
            audioRef.current = audio;

            // Set audio source
            if (audioSource instanceof Blob) {
                const url = URL.createObjectURL(audioSource);
                currentUrlRef.current = url;
                audio.src = url;
            } else {
                audio.src = audioSource;
                currentUrlRef.current = audioSource;
            }

            // Setup audio context for potential processing
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            const source = audioContext.createMediaElementSource(audio);
            sourceNodeRef.current = source;
            source.connect(audioContext.destination);

            // Event listeners
            audio.onloadedmetadata = () => {
                setState(prev => ({
                    ...prev,
                    duration: audio.duration,
                }));
            };

            audio.ontimeupdate = () => {
                setState(prev => ({
                    ...prev,
                    currentTime: audio.currentTime,
                }));
            };

            audio.onended = () => {
                setState(prev => ({
                    ...prev,
                    isPlaying: false,
                    isPaused: false,
                    currentTime: 0,
                }));
                cleanup();
            };

            audio.onerror = (e) => {
                console.error('[useAudioPlayer] Playback error:', e);
                setState(prev => ({
                    ...prev,
                    error: 'Failed to play audio',
                    isPlaying: false,
                }));
                cleanup();
            };

            await audio.play();

            setState(prev => ({
                ...prev,
                isPlaying: true,
                isPaused: false,
                error: null,
            }));

            console.log('[useAudioPlayer] Playback started');
        } catch (error) {
            console.error('[useAudioPlayer] Failed to play audio:', error);
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to play audio',
                isPlaying: false,
            }));
            cleanup();
        }
    }, [cleanup]);

    // Pause playback
    const pause = useCallback(() => {
        if (audioRef.current && state.isPlaying && !state.isPaused) {
            audioRef.current.pause();
            setState(prev => ({ ...prev, isPaused: true }));
            console.log('[useAudioPlayer] Playback paused');
        }
    }, [state.isPlaying, state.isPaused]);

    // Resume playback
    const resume = useCallback(() => {
        if (audioRef.current && state.isPlaying && state.isPaused) {
            audioRef.current.play();
            setState(prev => ({ ...prev, isPaused: false }));
            console.log('[useAudioPlayer] Playback resumed');
        }
    }, [state.isPlaying, state.isPaused]);

    // Stop playback
    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setState({
                isPlaying: false,
                isPaused: false,
                duration: 0,
                currentTime: 0,
                error: null,
            });
            cleanup();
            console.log('[useAudioPlayer] Playback stopped');
        }
    }, [cleanup]);

    // Seek to time
    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, Math.min(time, audioRef.current.duration));
            setState(prev => ({ ...prev, currentTime: audioRef.current!.currentTime }));
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    return {
        state,
        play,
        pause,
        resume,
        stop,
        seek,
    };
}
