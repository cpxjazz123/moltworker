
import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { chatQueryKeys, appendHistoryMessage, updateHistoryMessageByClientId } from '../chat-queries'
import { moltbotClient } from '@/lib/moltbot-client'

export function useMoltbotSocket(activeFriendlyId?: string, sessionKey?: string) {
    const [isConnected, setIsConnected] = useState(moltbotClient.isConnected)
    const [lastEvent, setLastEvent] = useState<any>(null)
    const queryClient = useQueryClient()

    // Keep track of streaming message content to detect duplicates and end-of-stream
    const streamingMessageRef = useRef<{ runId: string, content: string, lastText?: string } | null>(null)

    // vFIX-STUTTER-IDEMPOTENT-2
    useEffect(() => {
        console.log('[useMoltbotSocket] Hook mounted (vFIX-STUTTER)')
        // Ensure connected
        moltbotClient.connect()

        const handleConnected = () => {
            console.log('[useMoltbotSocket] Connected')
            setIsConnected(true)
        }

        const handleDisconnected = () => {
            console.log('[useMoltbotSocket] Disconnected')
            setIsConnected(false)
        }

        const handleEvent = (data: any) => {
            setLastEvent(data)

            // Streaming Token (agent event)
            const isStreamEvent = data.event === 'agent' && (data.payload?.stream === 'tokens' || data.payload?.stream === 'assistant')
            if (isStreamEvent && data.payload?.data) {
                const runId = data.payload.runId
                const eventSessionKey = data.payload.sessionKey || sessionKey
                const streamType = data.payload.stream
                const { text, delta } = data.payload.data

                if (activeFriendlyId && eventSessionKey) {
                    // Check cache to survive remounts
                    const historyKey = chatQueryKeys.history(activeFriendlyId, eventSessionKey)
                    const cached = queryClient.getQueryData(historyKey) as any
                    const messages = Array.isArray(cached?.messages) ? cached.messages : []
                    const existingMessage = messages.find((m: any) => m.clientId === runId || m.__optimisticId === runId)

                    // Decide content update logic
                    let nextContent = ''
                    if (streamType === 'assistant' && text !== undefined) {
                        // Cumulative update
                        nextContent = text
                    } else if (delta) {
                        // Delta update
                        const currentText = existingMessage ? (existingMessage.content[0]?.text || '') : ''
                        // Simple duplicate detection for deltas within the same mount session
                        if (streamingMessageRef.current?.runId === runId && streamingMessageRef.current?.lastText === delta) {
                            return
                        }
                        nextContent = currentText + delta
                    } else {
                        // Tokens or other streams
                        const currentText = existingMessage ? (existingMessage.content[0]?.text || '') : ''
                        nextContent = currentText + (text || '')
                    }

                    // Store state locally to help with duplicate detection
                    streamingMessageRef.current = { runId, content: nextContent, lastText: delta || text }

                    if (!existingMessage) {
                        console.log(`[useMoltbotSocket] New stream detected (runId: ${runId}, stream: ${streamType})`)
                        appendHistoryMessage(
                            queryClient,
                            activeFriendlyId,
                            eventSessionKey,
                            {
                                role: 'assistant',
                                content: [{ type: 'text', text: nextContent }],
                                __optimisticId: runId,
                                timestamp: Date.now()
                            }
                        )
                    } else {
                        // Only update if content actually changed
                        const currentUIContent = existingMessage.content[0]?.text || ''
                        if (currentUIContent !== nextContent) {
                            updateHistoryMessageByClientId(
                                queryClient,
                                activeFriendlyId,
                                eventSessionKey,
                                runId,
                                (msg) => ({
                                    ...msg,
                                    content: [{ type: 'text', text: nextContent }]
                                })
                            )
                        }
                    }
                }
            }

            // Lifecycle Event (end of generation)
            if (data.event === 'agent' && data.payload?.data?.phase === 'end') {
                console.log(`[useMoltbotSocket] Stream ended: ${data.payload.runId}`)
                streamingMessageRef.current = null
            }

            // Final Message (chat event)
            if (data.event === 'chat' && data.payload?.state === 'final') {
                console.log('[WS] Chat final received', data)
                streamingMessageRef.current = null
                const eventSessionKey = data.payload.sessionKey

                if (activeFriendlyId) {
                    queryClient.invalidateQueries({ queryKey: chatQueryKeys.history(activeFriendlyId, eventSessionKey) })
                }
                queryClient.invalidateQueries({ queryKey: chatQueryKeys.sessions })
            }
        }

        moltbotClient.on('connected', handleConnected)
        moltbotClient.on('disconnected', handleDisconnected)
        moltbotClient.on('event', handleEvent)

        // Initial state
        setIsConnected(moltbotClient.isConnected)

        return () => {
            moltbotClient.off('connected', handleConnected)
            moltbotClient.off('disconnected', handleDisconnected)
            moltbotClient.off('event', handleEvent)
        }
    }, [queryClient, activeFriendlyId, sessionKey])

    return { isConnected, lastEvent }
}
