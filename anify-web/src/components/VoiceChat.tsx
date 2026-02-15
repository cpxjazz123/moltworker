import React, { useEffect, useState } from 'react';
import { X, Cloud, Activity, Phone } from 'lucide-react';
import { useCallMode } from '../hooks/useCallMode';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';

interface VoiceChatProps {
    onClose: () => void;
    characterName?: string;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ onClose, characterName = "Assistant" }) => {
    const [apiKey, setApiKey] = useState<string>('');

    // Load Murf API Key from env
    useEffect(() => {
        const envKey = import.meta.env.VITE_MURF_API_KEY;
        if (envKey) setApiKey(envKey);
    }, []);

    const { callState, transcript, startCall, endCall, ttsState, sttState, finishListening } = useCallMode({
        elevenLabsApiKey: apiKey, // Prop name is legacy, but we pass Murf Key
    });

    const { state: recorderState, startRecording, stopRecording } = useVoiceRecorder();

    // Sync recorder with listening state for visualization
    useEffect(() => {
        if (callState === 'listening' && !recorderState.isRecording) {
            startRecording().catch(console.error);
        } else if (callState !== 'listening' && recorderState.isRecording) {
            stopRecording().catch(console.error);
        }
    }, [callState, recorderState.isRecording, startRecording, stopRecording]);

    // Cleanup on unmount
    useEffect(() => {
        return () => endCall();
    }, [endCall]);

    if (!apiKey) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-gray-900 p-8 rounded-2xl max-w-md text-center border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">Configuration Required</h3>
                    <p className="text-gray-400 mb-6">Call Mode requires an API Key.</p>
                    <input
                        type="password"
                        placeholder="Enter Murf API Key"
                        className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white mb-4"
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white underline"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    const pulseScale = 1 + (recorderState.audioLevel * 0.5);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-8 right-8 p-3 rounded-full bg-gray-800/50 hover:bg-gray-700 text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Main Visual Area */}
            <div className="relative flex items-center justify-center w-64 h-64 mb-12">

                {/* Speaking State: Radiating Rings */}
                {callState === 'speaking' && (
                    <>
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" style={{ animationDuration: '2s' }}></div>
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
                        <div className="absolute inset-2 rounded-full bg-cyan-500/10 backdrop-blur-sm animate-pulse"></div>
                    </>
                )}

                {/* Listening State: Pulsing Cloud */}
                {callState === 'listening' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-emerald-500/20 rounded-full transition-transform duration-75"
                            style={{ transform: `scale(${pulseScale})` }}
                        ></div>
                        <div className="absolute inset-0 bg-emerald-500/5 rounded-full animate-pulse"></div>
                    </div>
                )}

                {/* Thinking State: Spinner */}
                {callState === 'thinking' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Center Icon */}
                <div
                    className="relative z-10 p-6 rounded-full bg-gray-800 border border-gray-700 shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 cursor-pointer"
                    onClick={() => {
                        if (callState === 'idle') {
                            startCall();
                        } else if (callState === 'listening') {
                            finishListening();
                        }
                    }}
                >
                    {callState === 'idle' ? (
                        <div className="flex flex-col items-center justify-center group">
                            <Phone className="w-12 h-12 text-emerald-400 group-hover:animate-bounce" />
                        </div>
                    ) : callState === 'listening' ? (
                        <div className="flex flex-col items-center justify-center group">
                            <Cloud className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] text-emerald-400 font-bold mt-2 uppercase tracking-tighter animate-pulse">
                                Finish
                            </span>
                        </div>
                    ) : callState === 'thinking' ? (
                        <Activity className="w-12 h-12 text-indigo-400 animate-bounce" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-cyan-400/20 flex items-center justify-center">
                            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Text & Transcript */}
            <div className="text-center max-w-xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-light text-white mb-2 tracking-wide">
                    {callState === 'idle' ? "Ready to start" :
                        callState === 'listening' ? "Listening to you..." :
                            callState === 'thinking' ? `${characterName} is thinking...` :
                                callState === 'speaking' ? `${characterName} is speaking` : 'Connected'}
                </h2>

                {(transcript || callState === 'idle') && (
                    <p className="text-xl text-gray-300 font-medium mt-4 leading-relaxed line-clamp-3 h-24">
                        {callState === 'idle' ? "Click the icon to connect" :
                            transcript ? `"${transcript}"` : "..."}
                    </p>
                )}

                {/* Error Feedback */}
                {(sttState.error || ttsState.error) && (
                    <p className="text-red-400 mt-4 text-sm bg-red-900/20 py-2 px-4 rounded-full">
                        Error: {sttState.error || ttsState.error}
                    </p>
                )}
            </div>

            {/* Footer Instructions */}
            <div className="absolute bottom-12 text-gray-500 text-sm">
                {callState === 'idle' ? 'Connect to begin voice chat' :
                    callState === 'speaking' ? 'Speak to interrupt' : 'Speak clearly into your microphone'}
            </div>
        </div>
    );
};
