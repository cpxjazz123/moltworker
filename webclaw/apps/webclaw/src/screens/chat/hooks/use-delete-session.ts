import { useCallback, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  chatQueryKeys,
  clearHistoryMessages,
  removeSessionFromCache,
} from '../chat-queries'
import { clearPendingSendForSession, resetPendingSend } from '../pending-send'
import { clearSessionDeleted, markSessionDeleted } from '../session-tombstones'
import { moltbotClient } from '@/lib/moltbot-client'

export type DeleteSessionResult = {
  deleteSession: (
    sessionKey: string,
    friendlyId: string,
    isActive: boolean,
  ) => Promise<void>
  deleting: boolean
  error: string | null
}

export function useDeleteSession(): DeleteSessionResult {
  const queryClient = useQueryClient()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async function deleteSessionRequest(payload: {
      sessionKey: string
      friendlyId: string
      isActive: boolean
    }) {
      // Ensure connected
      if (!moltbotClient.isConnected) await moltbotClient.connect();

      // Delete main session
      await moltbotClient.request('sessions.delete', { key: payload.sessionKey })

      // Delete friendlyId alias if different
      if (payload.friendlyId && payload.friendlyId !== payload.sessionKey) {
        await moltbotClient.request('sessions.delete', { key: payload.friendlyId }).catch(() => ({}))
      }

      return payload
    },
    onMutate: async function onMutate(payload) {
      setError(null)
      markSessionDeleted(payload.sessionKey || payload.friendlyId)
      clearPendingSendForSession(payload.sessionKey, payload.friendlyId)
      await queryClient.cancelQueries({ queryKey: chatQueryKeys.sessions })
      const previousSessions = queryClient.getQueryData(chatQueryKeys.sessions)
      removeSessionFromCache(
        queryClient,
        payload.sessionKey,
        payload.friendlyId,
      )
      if (payload.isActive && (payload.sessionKey || payload.friendlyId)) {
        clearHistoryMessages(
          queryClient,
          payload.friendlyId || payload.sessionKey,
          payload.sessionKey || payload.friendlyId,
        )
      }
      return { previousSessions, isActive: payload.isActive }
    },
    onError: function onError(err, _payload, context) {
      if (context?.previousSessions) {
        queryClient.setQueryData(
          chatQueryKeys.sessions,
          context.previousSessions,
        )
      }
      clearSessionDeleted(_payload.sessionKey || _payload.friendlyId)
      setError(err instanceof Error ? err.message : String(err))
    },
    onSuccess: function onSuccess(payload) {
      if (payload.isActive) {
        resetPendingSend()
      }
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.sessions })
    },
    onSettled: function onSettled() {
      setDeleting(false)
    },
  })

  const deleteSession = useCallback(
    async (sessionKey: string, friendlyId: string, isActive: boolean) => {
      if (!sessionKey && !friendlyId) return
      setDeleting(true)
      await mutation.mutateAsync({ sessionKey, friendlyId, isActive })
    },
    [mutation],
  )

  return { deleteSession, deleting, error }
}
