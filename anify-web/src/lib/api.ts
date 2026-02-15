import { auth } from '../firebase';

const getAuthToken = async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
};

interface ApiOptions extends RequestInit {
    headers?: Record<string, string>;
}

// ============================================================================
// PLAYER STATE TYPES
// ============================================================================

export interface PlayerProfile {
    characterName: string;
    avatarId: string | null;
    isInitialized: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type TutorialStep =
    | "landing"
    | "character_create"
    | "chat_intro"
    | "chat_respond"
    | "voice_transition"
    | "voice_call"
    | "equipment_check"
    | "explore_intro"
    | "tutorial_complete";

export interface PlayerTutorial {
    isCompleted: boolean;
    currentStep: TutorialStep | null;
    completedSteps: TutorialStep[];
    startedAt: string | null;
    completedAt: string | null;
    updatedAt?: string;
}

export interface PlayerStateSummary {
    profile: {
        isInitialized: boolean;
        characterName: string;
    } | null;
    tutorial: {
        isCompleted: boolean;
        currentStep: TutorialStep | null;
    } | null;
}

export const api = {
    fetch: async (endpoint: string, options: ApiOptions = {}) => {
        const baseUrl = import.meta.env.VITE_API_URL || "https://us-central1-anify-oiy-ai.cloudfunctions.net/api";
        if (!baseUrl) {
            console.error('VITE_API_URL is not defined');
            throw new Error('API URL not configured');
        }

        const token = await getAuthToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const user = auth.currentUser;
        if (user) {
            headers['x-user-id'] = user.uid;
        }

        // Remove leading slash if present to avoid double slashes if baseUrl has trailing slash
        // But usually standard is baseUrl no trailing, endpoint has leading.
        // Let's ensure clean join.
        const cleanBase = baseUrl.replace(/\/$/, '');
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

        const response = await fetch(`${cleanBase}${cleanEndpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorBody = await response.text().catch(() => 'Unknown error');
            throw new Error(`API Error ${response.status}: ${errorBody}`);
        }

        // Try to parse JSON, fallback to text if empty or not JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }
        return response.text();
    },

    // Note: Player profile and tutorial APIs are accessed via Data Connect SDK
    // See: src/hooks/useDataConnect.ts for usePlayerProfile, usePlayerTutorial hooks
};
