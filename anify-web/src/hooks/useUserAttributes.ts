/**
 * User attributes API hooks for fetching and managing user stats.
 */

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { api } from '@/lib/api';

// ============================================================================
// Types
// ============================================================================

export interface UserAttributes {
    hp: number;
    maxHp: number;
    atk: number;
    def: number;
    level: number;
    exp: number;
    gold: number;
}

export type UpdateUserAttributes = Partial<UserAttributes>;

// ============================================================================
// Fetchers
// ============================================================================

async function attributesFetcher(url: string): Promise<UserAttributes> {
    return api.fetch(url);
}

async function updateAttributesFetcher(
    url: string,
    { arg }: { arg: UpdateUserAttributes }
): Promise<UserAttributes> {
    return api.fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(arg),
    });
}

async function resetAttributesFetcher(url: string): Promise<UserAttributes> {
    return api.fetch(url, {
        method: 'POST',
    });
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Fetch user attributes (HP, ATK, DEF, level, exp, gold).
 */
export function useUserAttributes() {
    const { data, error, isLoading, mutate } = useSWR<UserAttributes>(
        '/user/attributes',
        attributesFetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
        }
    );

    return {
        attributes: data,
        isLoading,
        error,
        refresh: mutate,
    };
}

/**
 * Update user attributes.
 */
export function useUpdateUserAttributes() {
    const { mutate } = useSWR<UserAttributes>('/user/attributes');

    const { trigger, isMutating, error } = useSWRMutation(
        '/user/attributes',
        updateAttributesFetcher,
        {
            onSuccess: (data: UserAttributes) => {
                mutate(data, false);
            },
        }
    );

    return {
        updateAttributes: trigger,
        isLoading: isMutating,
        error,
    };
}

/**
 * Reset user attributes to defaults.
 */
export function useResetUserAttributes() {
    const { mutate } = useSWR<UserAttributes>('/user/attributes');

    const { trigger, isMutating, error } = useSWRMutation(
        '/user/attributes/reset',
        resetAttributesFetcher,
        {
            onSuccess: (data: UserAttributes) => {
                mutate(data, false);
            },
        }
    );

    return {
        resetAttributes: trigger,
        isLoading: isMutating,
        error,
    };
}
