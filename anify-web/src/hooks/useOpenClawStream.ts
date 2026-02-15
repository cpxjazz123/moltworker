import { useEffect, useRef } from 'react';
import { openclawClient } from '../lib/openclaw-client';
import type { StreamEvent } from '../types/openclaw';
import type { Message } from '../contexts/GameDataContext';

export function useOpenClawStream(
    sessionKey: string | null,
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void,
    activeCharacterId?: string | null
) {
    const streamingMessageRef = useRef<{ runId: string; content: string; lastText?: string } | null>(null);

    useEffect(() => {
        if (!sessionKey) return;

        console.log('[useOpenClawStream] Initializing stream listener for session:', sessionKey);

        // Ensure connected
        openclawClient.connect();

        const handleEvent = (data: StreamEvent) => {
            // Streaming Token (agent event)
            const isStreamEvent = data.event === 'agent' && (data.payload?.stream === 'tokens' || data.payload?.stream === 'assistant');

            if (isStreamEvent && data.payload?.data) {
                const runId = data.payload.runId;
                const eventSessionKey = data.payload.sessionKey;
                const streamType = data.payload.stream;
                const { text, delta } = data.payload.data;

                // Only process events for the current session
                if (eventSessionKey !== sessionKey) return;

                // Determine content update logic
                let nextContent = '';
                if (streamType === 'assistant' && text !== undefined) {
                    // Cumulative update
                    nextContent = text;
                } else if (delta) {
                    // Delta update
                    const currentContent = streamingMessageRef.current?.runId === runId ? (streamingMessageRef.current?.content || '') : '';

                    // Simple duplicate detection
                    if (streamingMessageRef.current?.runId === runId && streamingMessageRef.current?.lastText === delta) {
                        return;
                    }

                    nextContent = currentContent + delta;
                } else if (text) {
                    // Tokens or other streams
                    const currentContent = streamingMessageRef.current?.runId === runId ? (streamingMessageRef.current?.content || '') : '';
                    nextContent = currentContent + text;
                }

                // Store state locally for duplicate detection
                streamingMessageRef.current = { runId: runId!, content: nextContent, lastText: delta || text };

                // Add or update message in GameDataContext
                // For now, we'll add a new message each time (GameDataContext will need to handle updates)
                // In a production implementation, we'd want to update existing messages
                if (nextContent) {
                    addMessage({
                        sender: activeCharacterId || 'assistant',
                        content: nextContent,
                        runId: runId,
                    });
                }
            }

            // Lifecycle Event (end of generation)
            if (data.event === 'agent' && data.payload?.data?.phase === 'end') {
                console.log(`[useOpenClawStream] Stream ended: ${data.payload.runId}`);
                if (streamingMessageRef.current && streamingMessageRef.current.runId === data.payload.runId) {
                    addMessage({
                        sender: activeCharacterId || 'assistant',
                        content: streamingMessageRef.current.content,
                        runId: data.payload.runId,
                        status: 'final',
                    });
                }
                streamingMessageRef.current = null;
            }

            // Final Message (chat event)
            if (data.event === 'chat' && data.payload?.state === 'final') {
                console.log('[useOpenClawStream] Chat final received', data);
                if (streamingMessageRef.current && streamingMessageRef.current.runId === data.payload.runId) {
                    addMessage({
                        sender: activeCharacterId || 'assistant',
                        content: streamingMessageRef.current.content,
                        runId: data.payload.runId,
                        status: 'final',
                    });
                }
                streamingMessageRef.current = null;
            }
        };

        openclawClient.on('event', handleEvent);

        return () => {
            openclawClient.off('event', handleEvent);
        };
    }, [sessionKey, addMessage]);

    return { isConnected: openclawClient.isConnected };
}
