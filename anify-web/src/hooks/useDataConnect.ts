/**
 * React hooks for Firebase Data Connect operations
 * Provides convenient wrappers around the generated SDK functions
 */

import { useState, useEffect, useCallback } from 'react';
import { dataConnect } from '../firebase';
import {
  // Queries
  listItems,
  getItem,
  listScenes,
  getScene,
  listResources,
  getResource,
  getUserAttributes,
  getUserInventory,
  getUserProfile,
  getTokenSummary,
  getTokenEvents,
  getPlayerProfile,
  getPlayerTutorial,
  getPlayerStateSummary,
  // Mutations
  createUser,
  createUserAttributes,
  updateUserAttributes,
  resetUserAttributes,
  addInventoryItem,
  removeInventoryItem,
  createTokenWallet,
  initializePlayer,
  updatePlayerProfile,
  startTutorial,
  advanceTutorial,
  completeTutorial,
  // Types
  type ListItemsData,
  type GetItemData,
  type ListScenesData,
  type GetSceneData,
  type ListResourcesData,
  type GetResourceData,
  type GetUserAttributesData,
  type GetUserInventoryData,
  type GetUserProfileData,
  type GetTokenSummaryData,
  type GetTokenEventsData,
  type UpdateUserAttributesVariables,
  type GetPlayerProfileData,
  type GetPlayerTutorialData,
  type GetPlayerStateSummaryData,
  type InitializePlayerVariables,
  type UpdatePlayerProfileVariables,
  type AdvanceTutorialVariables,
} from '@/lib/dataconnect';

// Generic hook for async data fetching
function useAsyncData<T>(
  fetchFn: () => Promise<{ data: T }>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// ============================================================================
// ITEMS HOOKS
// ============================================================================

export function useItems() {
  return useAsyncData<ListItemsData>(
    () => listItems(dataConnect),
    []
  );
}

export function useItem(id: string) {
  return useAsyncData<GetItemData>(
    () => getItem(dataConnect, { id }),
    [id]
  );
}

// ============================================================================
// SCENES HOOKS
// ============================================================================

export function useScenes() {
  return useAsyncData<ListScenesData>(
    () => listScenes(dataConnect),
    []
  );
}

export function useScene(id: string) {
  return useAsyncData<GetSceneData>(
    () => getScene(dataConnect, { id }),
    [id]
  );
}

// ============================================================================
// RESOURCES HOOKS
// ============================================================================

export function useResources() {
  return useAsyncData<ListResourcesData>(
    () => listResources(dataConnect),
    []
  );
}

export function useResource(id: string) {
  return useAsyncData<GetResourceData>(
    () => getResource(dataConnect, { id }),
    [id]
  );
}

// ============================================================================
// USER HOOKS
// ============================================================================

export function useUserAttributes() {
  return useAsyncData<GetUserAttributesData>(
    () => getUserAttributes(dataConnect),
    []
  );
}

export function useUserInventory() {
  return useAsyncData<GetUserInventoryData>(
    () => getUserInventory(dataConnect),
    []
  );
}

export function useUserProfile() {
  return useAsyncData<GetUserProfileData>(
    () => getUserProfile(dataConnect),
    []
  );
}

// ============================================================================
// TOKEN HOOKS
// ============================================================================

export function useTokenSummary() {
  return useAsyncData<GetTokenSummaryData>(
    () => getTokenSummary(dataConnect),
    []
  );
}

export function useTokenEvents(limit = 50, offset = 0) {
  return useAsyncData<GetTokenEventsData>(
    () => getTokenEvents(dataConnect, { limit, offset }),
    [limit, offset]
  );
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createUser(dataConnect);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

export function useCreateUserAttributes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createUserAttributes(dataConnect);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

export function useUpdateUserAttributes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (attrs: UpdateUserAttributesVariables) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateUserAttributes(dataConnect, attrs);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

export function useResetUserAttributes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await resetUserAttributes(dataConnect);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

export function useAddInventoryItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (itemId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await addInventoryItem(dataConnect, { itemId, quantity });
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

export function useRemoveInventoryItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await removeInventoryItem(dataConnect, { itemId });
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

export function useCreateTokenWallet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createTokenWallet(dataConnect);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

// ============================================================================
// PLAYER STATE HOOKS
// ============================================================================

export function usePlayerProfile() {
  return useAsyncData<GetPlayerProfileData>(
    () => getPlayerProfile(dataConnect),
    []
  );
}

export function usePlayerTutorial() {
  return useAsyncData<GetPlayerTutorialData>(
    () => getPlayerTutorial(dataConnect),
    []
  );
}

export function usePlayerStateSummary() {
  return useAsyncData<GetPlayerStateSummaryData>(
    () => getPlayerStateSummary(dataConnect),
    []
  );
}

export function useInitializePlayer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (vars: InitializePlayerVariables) => {
    setLoading(true);
    setError(null);
    try {
      const result = await initializePlayer(dataConnect, vars);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

export function useUpdatePlayerProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (vars: UpdatePlayerProfileVariables) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updatePlayerProfile(dataConnect, vars);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

export function useStartTutorial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await startTutorial(dataConnect);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

export function useAdvanceTutorial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (vars: AdvanceTutorialVariables) => {
    setLoading(true);
    setError(null);
    try {
      const result = await advanceTutorial(dataConnect, vars);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

export function useCompleteTutorial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await completeTutorial(dataConnect);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}
