import { normalizeSessions } from './utils'
import type { QueryClient } from '@tanstack/react-query'
import type {
  GatewayMessage,
  HistoryResponse,
  SessionListResponse,
  SessionMeta,
} from './types'
import { moltbotClient } from '@/lib/moltbot-client'

type GatewayStatusResponse = {
  ok: boolean
  error?: string
}

export const chatQueryKeys = {
  sessions: ['chat', 'sessions'] as const,
  history: function history(friendlyId: string, sessionKey: string) {
    return ['chat', 'history', friendlyId, sessionKey] as const
  },
} as const

export async function fetchSessions(): Promise<Array<SessionMeta>> {
  // Ensure connected
  if (!moltbotClient.isConnected) await moltbotClient.connect();

  // Use WS request
  const data = await moltbotClient.request('sessions.list', { limit: 100 }) as SessionListResponse
  return normalizeSessions(data.sessions)
}

export async function fetchHistory(payload: {
  sessionKey: string
  friendlyId: string
}): Promise<HistoryResponse> {
  // Ensure connected
  if (!moltbotClient.isConnected) await moltbotClient.connect();

  const data = await moltbotClient.request('chat.history', {
    sessionKey: payload.sessionKey,
    limit: 200
  }) as HistoryResponse
  return data
}

export async function createSession(): Promise<{ sessionKey: string, friendlyId: string }> {
  // Ensure connected
  if (!moltbotClient.isConnected) await moltbotClient.connect();

  const friendlyId = crypto.randomUUID()
  const params = { key: friendlyId }

  // 1) Patch to create
  const payload = await moltbotClient.request('sessions.patch', params) as { key?: string }
  const sessionKey = payload?.key || ''

  if (!sessionKey) {
    throw new Error('Gateway returned invalid session key')
  }

  // 2) Resolve (best effort)
  await moltbotClient.request('sessions.resolve', {
    key: friendlyId,
    includeUnknown: true,
    includeGlobal: true,
  }).catch(() => ({ ok: false }))

  return { sessionKey, friendlyId }
}

export async function fetchGatewayStatus(): Promise<GatewayStatusResponse> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15000)

  try {
    // If not connected, this will start connection
    moltbotClient.connect()

    // Wait for connection? Or just try request? 
    // If we just request, the client should handle queuing or fail. 
    // But since we want to "test" the connection, let's try a health check.
    // NOTE: 'health' or 'status' might return different structures.
    // Native UI uses 'status'.
    // Check health
    console.log('[fetchGatewayStatus] Sending health check...')
    const result = await moltbotClient.request('health', {})
    console.log('[fetchGatewayStatus] Health check success:', result)
    return { ok: true }
  } catch (err) {
    console.error('[fetchGatewayStatus] Health check failed:', err)
    if (err instanceof Error && err.message === 'Request health timed out') {
      throw new Error('Gateway check timed out')
    }
    throw err
  } finally {
    window.clearTimeout(timeout)
  }
}

export function updateHistoryMessages(
  queryClient: QueryClient,
  friendlyId: string,
  sessionKey: string,
  updater: (messages: Array<GatewayMessage>) => Array<GatewayMessage>,
) {
  const queryKey = chatQueryKeys.history(friendlyId, sessionKey)
  queryClient.setQueryData(queryKey, function update(data: unknown) {
    const current = data as HistoryResponse | undefined
    const messages = Array.isArray(current?.messages) ? current.messages : []
    const nextMessages = updater(messages)
    return {
      sessionKey: current?.sessionKey ?? sessionKey,
      sessionId: current?.sessionId,
      messages: nextMessages,
    }
  })
}

export function appendHistoryMessage(
  queryClient: QueryClient,
  friendlyId: string,
  sessionKey: string,
  message: GatewayMessage,
) {
  updateHistoryMessages(
    queryClient,
    friendlyId,
    sessionKey,
    function append(messages) {
      return [...messages, message]
    },
  )
}

export function updateHistoryMessageByClientId(
  queryClient: QueryClient,
  friendlyId: string,
  sessionKey: string,
  clientId: string,
  updater: (message: GatewayMessage) => GatewayMessage,
) {
  const optimisticId = `opt-${clientId}`
  updateHistoryMessages(
    queryClient,
    friendlyId,
    sessionKey,
    function update(messages) {
      return messages.map((message) => {
        if (
          message.clientId === clientId ||
          message.__optimisticId === clientId ||
          message.__optimisticId === optimisticId
        ) {
          return updater(message)
        }
        return message
      })
    },
  )
}

export function removeHistoryMessageByClientId(
  queryClient: QueryClient,
  friendlyId: string,
  sessionKey: string,
  clientId: string,
  optimisticId?: string,
) {
  updateHistoryMessages(
    queryClient,
    friendlyId,
    sessionKey,
    function remove(messages) {
      return messages.filter((message) => {
        if (message.clientId === clientId) return false
        if (message.__optimisticId === clientId) return false
        if (optimisticId && message.__optimisticId === optimisticId)
          return false
        return true
      })
    },
  )
}

export function clearHistoryMessages(
  queryClient: QueryClient,
  friendlyId: string,
  sessionKey: string,
) {
  const queryKey = chatQueryKeys.history(friendlyId, sessionKey)
  queryClient.setQueryData(queryKey, {
    sessionKey,
    messages: [],
  })
}

export function moveHistoryMessages(
  queryClient: QueryClient,
  fromFriendlyId: string,
  fromSessionKey: string,
  toFriendlyId: string,
  toSessionKey: string,
) {
  const fromKey = chatQueryKeys.history(fromFriendlyId, fromSessionKey)
  const toKey = chatQueryKeys.history(toFriendlyId, toSessionKey)
  const fromData = queryClient.getQueryData(fromKey) as
    | HistoryResponse
    | undefined
  if (!fromData) return
  const messages = Array.isArray(fromData.messages) ? fromData.messages : []
  queryClient.setQueryData(toKey, {
    sessionKey: toSessionKey,
    sessionId: fromData.sessionId,
    messages,
  })
  queryClient.removeQueries({ queryKey: fromKey, exact: true })
}

export function updateSessionLastMessage(
  queryClient: QueryClient,
  sessionKey: string,
  friendlyId: string,
  message: GatewayMessage,
) {
  queryClient.setQueryData(
    chatQueryKeys.sessions,
    function update(messages: unknown) {
      if (!Array.isArray(messages)) return messages
      return (messages as Array<SessionMeta>).map((session) => {
        if (session.key !== sessionKey && session.friendlyId !== friendlyId) {
          return session
        }
        return {
          ...session,
          lastMessage: message,
        }
      })
    },
  )
}

export function removeSessionFromCache(
  queryClient: QueryClient,
  sessionKey: string,
  friendlyId: string,
) {
  queryClient.setQueryData(
    chatQueryKeys.sessions,
    function update(messages: unknown) {
      if (!Array.isArray(messages)) return messages
      return (messages as Array<SessionMeta>).filter((session) => {
        return session.key !== sessionKey && session.friendlyId !== friendlyId
      })
    },
  )

  queryClient.removeQueries({
    queryKey: ['chat', 'history', friendlyId],
    exact: false,
  })
  if (sessionKey && sessionKey !== friendlyId) {
    queryClient.removeQueries({
      queryKey: ['chat', 'history', sessionKey],
      exact: false,
    })
  }
}
