/**
 * Quest API hooks for fetching and managing user quests.
 */

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useCallback } from 'react';

import { api } from '@/lib/api';
import type { Quest, QuestStatus } from '@/types';

// ============================================================================
// Types
// ============================================================================

interface QuestsResponse {
    quests: Quest[];
}

interface TrackedQuestResponse {
    questId: string | null;
}

interface UpdateProgressPayload {
    objectives: Array<{
        id: string;
        current?: number;
        completed?: boolean;
    }>;
}

// ============================================================================
// Fetchers
// ============================================================================

async function questsFetcher(url: string): Promise<QuestsResponse> {
    return api.fetch(url);
}

async function acceptQuestFetcher(
    url: string,
    { arg }: { arg: { questId: string } }
): Promise<Quest> {
    return api.fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
}

async function abandonQuestFetcher(
    _url: string,
    { arg }: { arg: { questId: string } }
): Promise<{ success: boolean; questId: string }> {
    return api.fetch(`/user/quests/${arg.questId}/abandon`, {
        method: 'POST',
    });
}

async function updateProgressFetcher(
    _url: string,
    { arg }: { arg: { questId: string; payload: UpdateProgressPayload } }
): Promise<Quest> {
    return api.fetch(`/user/quests/${arg.questId}/progress`, {
        method: 'PATCH',
        body: JSON.stringify(arg.payload),
    });
}

async function completeQuestFetcher(
    _url: string,
    { arg }: { arg: { questId: string } }
): Promise<Quest> {
    return api.fetch(`/user/quests/${arg.questId}/complete`, {
        method: 'POST',
    });
}

async function trackedQuestFetcher(url: string): Promise<TrackedQuestResponse> {
    return api.fetch(url);
}

async function setTrackedQuestFetcher(
    url: string,
    { arg }: { arg: { questId: string | null } }
): Promise<TrackedQuestResponse> {
    return api.fetch(url, {
        method: 'PUT',
        body: JSON.stringify(arg),
    });
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Fetch all quests for the current user.
 */
export function useQuests() {
    const { data, error, isLoading, mutate } = useSWR<QuestsResponse>(
        '/user/quests',
        questsFetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
        }
    );

    return {
        quests: data?.quests ?? [],
        isLoading,
        error,
        refresh: mutate,
    };
}

/**
 * Fetch quests filtered by status.
 */
export function useQuestsByStatus(status: QuestStatus) {
    const { quests, isLoading, error, refresh } = useQuests();

    const filteredQuests = quests.filter((q: Quest) => q.status === status);

    return {
        quests: filteredQuests,
        isLoading,
        error,
        refresh,
    };
}

/**
 * Accept a new quest.
 */
export function useAcceptQuest() {
    const { trigger, isMutating, error } = useSWRMutation(
        '/user/quests/accept',
        acceptQuestFetcher
    );

    return {
        acceptQuest: trigger,
        isLoading: isMutating,
        error,
    };
}

/**
 * Abandon a quest.
 */
export function useAbandonQuest() {
    const { trigger, isMutating, error } = useSWRMutation(
        '/user/quests/abandon',
        abandonQuestFetcher
    );

    return {
        abandonQuest: trigger,
        isLoading: isMutating,
        error,
    };
}

/**
 * Update quest progress.
 */
export function useUpdateQuestProgress() {
    const { trigger, isMutating, error } = useSWRMutation(
        '/user/quests/progress',
        updateProgressFetcher
    );

    return {
        updateProgress: trigger,
        isLoading: isMutating,
        error,
    };
}

/**
 * Complete a quest.
 */
export function useCompleteQuest() {
    const { trigger, isMutating, error } = useSWRMutation(
        '/user/quests/complete',
        completeQuestFetcher
    );

    return {
        completeQuest: trigger,
        isLoading: isMutating,
        error,
    };
}

/**
 * Get and set tracked quest.
 */
export function useTrackedQuest() {
    const { data, error, isLoading, mutate } = useSWR<TrackedQuestResponse>(
        '/user/quests/tracked',
        trackedQuestFetcher
    );

    const { trigger } = useSWRMutation(
        '/user/quests/tracked',
        setTrackedQuestFetcher
    );

    const setTrackedQuest = useCallback(
        async (questId: string | null) => {
            await trigger({ questId });
            mutate({ questId });
        },
        [trigger, mutate]
    );

    return {
        trackedQuestId: data?.questId ?? null,
        isLoading,
        error,
        setTrackedQuest,
    };
}
