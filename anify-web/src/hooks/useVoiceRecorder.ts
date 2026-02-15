import { useState, useRef, useCallback, useEffect } from 'react';

export interface VoiceRecorderState {
    isRecording: boolean;
    isPaused: boolean;
    audioLevel: number;
    duration: number;
    error: string | null;
}

export interface VoiceRecorderControls {
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<Blob | null>;
    pauseRecording: () => void;
    resumeRecording: () => void;
    cancelRecording: () => void;
}

export function useVoiceRecorder() {
    const [state, setState] = useState<VoiceRecorderState>({
        isRecording: false,
        isPaused: false,
        audioLevel: 0,
        duration: 0,
        error: null,
    });

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const durationIntervalRef = useRef<number | null>(null);

    // Cleanup function
    const cleanup = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        analyserRef.current = null;
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
    }, []);

    // Audio level monitoring
    const monitorAudioLevel = useCallback(() => {
        if (!analyserRef.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        const updateLevel = () => {
            if (!analyserRef.current || !state.isRecording) return;

            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            const normalizedLevel = Math.min(average / 128, 1);

            setState(prev => ({ ...prev, audioLevel: normalizedLevel }));
            animationFrameRef.current = requestAnimationFrame(updateLevel);
        };

        updateLevel();
    }, [state.isRecording]);

    // Start recording
    const startRecording = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, error: null }));

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                }
            });

            streamRef.current = stream;

            // Setup audio context for level monitoring
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;
            source.connect(analyser);

            // Setup MediaRecorder
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : 'audio/webm';

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start(100); // Collect data every 100ms
            startTimeRef.current = Date.now();

            // Update duration
            durationIntervalRef.current = setInterval(() => {
                setState(prev => ({
                    ...prev,
                    duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
                }));
            }, 1000);

            setState(prev => ({
                ...prev,
                isRecording: true,
                isPaused: false,
                duration: 0,
            }));

            monitorAudioLevel();

            console.log('[useVoiceRecorder] Recording started');
        } catch (error) {
            console.error('[useVoiceRecorder] Failed to start recording:', error);
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to access microphone',
            }));
            cleanup();
        }
    }, [cleanup, monitorAudioLevel]);

    // Stop recording
    const stopRecording = useCallback(async (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current || !state.isRecording) {
                resolve(null);
                return;
            }

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: mediaRecorderRef.current?.mimeType || 'audio/webm'
                });

                console.log('[useVoiceRecorder] Recording stopped, blob size:', audioBlob.size);

                cleanup();
                setState(prev => ({
                    ...prev,
                    isRecording: false,
                    isPaused: false,
                    audioLevel: 0,
                    duration: 0,
                }));

                resolve(audioBlob);
            };

            mediaRecorderRef.current.stop();
        });
    }, [state.isRecording, cleanup]);

    // Pause recording
    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && state.isRecording && !state.isPaused) {
            mediaRecorderRef.current.pause();
            setState(prev => ({ ...prev, isPaused: true }));
            console.log('[useVoiceRecorder] Recording paused');
        }
    }, [state.isRecording, state.isPaused]);

    // Resume recording
    const resumeRecording = useCallback(() => {
        if (mediaRecorderRef.current && state.isRecording && state.isPaused) {
            mediaRecorderRef.current.resume();
            setState(prev => ({ ...prev, isPaused: false }));
            monitorAudioLevel();
            console.log('[useVoiceRecorder] Recording resumed');
        }
    }, [state.isRecording, state.isPaused, monitorAudioLevel]);

    // Cancel recording
    const cancelRecording = useCallback(() => {
        if (mediaRecorderRef.current && state.isRecording) {
            mediaRecorderRef.current.stop();
            cleanup();
            setState({
                isRecording: false,
                isPaused: false,
                audioLevel: 0,
                duration: 0,
                error: null,
            });
            console.log('[useVoiceRecorder] Recording cancelled');
        }
    }, [state.isRecording, cleanup]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    return {
        state,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        cancelRecording,
    };
}
