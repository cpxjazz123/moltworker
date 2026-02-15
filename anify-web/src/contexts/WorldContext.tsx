// src/contexts/WorldContext.tsx

import * as React from 'react';
import type {
  WorldMetadata,
  WorldSummary,
  Area,
  WorldMetaCharacter,
  Equipment,
  Item,
  WorldMetaQuest,
  DialogueTree,
  SceneConfig,
  TutorialConfig,
  ShopItem,
  Achievement,
  Task,
  GuildQuest,
  CraftingRecipe,
  Town,
  TownInteractionPoint,
} from '@/types/world-metadata';
import { useWorldLoader } from '@/hooks/useWorldLoader';

// ============================================================================
// Types
// ============================================================================

interface WorldContextState {
  // 当前加载的世界
  currentWorld: WorldMetadata | null;
  currentWorldId: string | null;

  // 加载状态
  isLoading: boolean;
  loadingProgress: number;
  error: Error | null;

  // 世界列表
  availableWorlds: WorldSummary[];
  worldsLoaded: boolean;
}

interface WorldContextActions {
  // 世界管理
  loadWorld: (worldId: string) => Promise<void>;
  unloadWorld: () => void;
  refreshWorldList: () => Promise<void>;

  // 便捷访问器
  getArea: (areaId: string) => Area | undefined;
  getCharacter: (characterId: string) => WorldMetaCharacter | undefined;
  getEquipment: (equipmentId: string) => Equipment | undefined;
  getItem: (itemId: string) => Item | undefined;
  getQuest: (questId: string) => WorldMetaQuest | undefined;
  getDialogue: (dialogueId: string) => DialogueTree | undefined;
  getScene: (sceneId: string) => SceneConfig | undefined;

  // 教程相关
  getTutorialConfig: () => TutorialConfig | undefined;
  isTutorialWorld: () => boolean;
}

type WorldContextType = WorldContextState & WorldContextActions;

// ============================================================================
// Context
// ============================================================================

const WorldContext = React.createContext<WorldContextType | null>(null);

// ============================================================================
// Provider
// ============================================================================

const LAST_WORLD_KEY = 'anify_last_world';

export function WorldProvider({ children }: { children: React.ReactNode }) {
  const { loadWorld: loaderLoadWorld, loadWorldIndex, isLoading, error, progress } = useWorldLoader();

  const [currentWorld, setCurrentWorld] = React.useState<WorldMetadata | null>(null);
  const [currentWorldId, setCurrentWorldId] = React.useState<string | null>(null);
  const [availableWorlds, setAvailableWorlds] = React.useState<WorldSummary[]>([]);
  const [worldsLoaded, setWorldsLoaded] = React.useState(false);

  const refreshWorldList = React.useCallback(async () => {
    try {
      const worlds = await loadWorldIndex();
      setAvailableWorlds(worlds);
      setWorldsLoaded(true);
    } catch (err) {
      console.error('Failed to load world index:', err);
    }
  }, [loadWorldIndex]);

  // 初始化时加载世界列表
  React.useEffect(() => {
    refreshWorldList();
  }, [refreshWorldList]);

  const loadWorld = React.useCallback(async (worldId: string) => {
    if (currentWorldId === worldId && currentWorld) {
      return; // 已加载
    }

    try {
      const metadata = await loaderLoadWorld(worldId);
      setCurrentWorld(metadata);
      setCurrentWorldId(worldId);

      // 保存最后加载的世界
      try {
        localStorage.setItem(LAST_WORLD_KEY, worldId);
      } catch {
        // Ignore storage errors
      }

      console.log(`[World] Loaded world: ${worldId}`);
    } catch (err) {
      console.error(`[World] Failed to load world ${worldId}:`, err);
      throw err;
    }
  }, [currentWorldId, currentWorld, loaderLoadWorld]);

  const unloadWorld = React.useCallback(() => {
    setCurrentWorld(null);
    setCurrentWorldId(null);
    console.log('[World] Unloaded current world');
  }, []);

  // 便捷访问器
  const getArea = React.useCallback(
    (areaId: string) => currentWorld?.areas.find(a => a.id === areaId),
    [currentWorld]
  );

  const getCharacter = React.useCallback(
    (characterId: string) => currentWorld?.characters.find(c => c.id === characterId),
    [currentWorld]
  );

  const getEquipment = React.useCallback(
    (equipmentId: string) => currentWorld?.equipment.find(e => e.id === equipmentId),
    [currentWorld]
  );

  const getItem = React.useCallback(
    (itemId: string) => currentWorld?.items.find(i => i.id === itemId),
    [currentWorld]
  );

  const getQuest = React.useCallback(
    (questId: string) => currentWorld?.quests.find(q => q.id === questId),
    [currentWorld]
  );

  const getDialogue = React.useCallback(
    (dialogueId: string) => currentWorld?.dialogues[dialogueId],
    [currentWorld]
  );

  const getScene = React.useCallback(
    (sceneId: string) => currentWorld?.scenes[sceneId],
    [currentWorld]
  );

  const getTutorialConfig = React.useCallback(
    () => currentWorld?.tutorial,
    [currentWorld]
  );

  const isTutorialWorld = React.useCallback(
    () => currentWorld?.world.type === 'tutorial',
    [currentWorld]
  );

  const value = React.useMemo<WorldContextType>(
    () => ({
      // State
      currentWorld,
      currentWorldId,
      isLoading,
      loadingProgress: progress,
      error,
      availableWorlds,
      worldsLoaded,

      // Actions
      loadWorld,
      unloadWorld,
      refreshWorldList,
      getArea,
      getCharacter,
      getEquipment,
      getItem,
      getQuest,
      getDialogue,
      getScene,
      getTutorialConfig,
      isTutorialWorld,
    }),
    [
      currentWorld,
      currentWorldId,
      isLoading,
      progress,
      error,
      availableWorlds,
      worldsLoaded,
      loadWorld,
      unloadWorld,
      refreshWorldList,
      getArea,
      getCharacter,
      getEquipment,
      getItem,
      getQuest,
      getDialogue,
      getScene,
      getTutorialConfig,
      isTutorialWorld,
    ]
  );

  return (
    <WorldContext.Provider value={value}>
      {children}
    </WorldContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useWorld() {
  const context = React.useContext(WorldContext);
  if (!context) {
    throw new Error('useWorld must be used within a WorldProvider');
  }
  return context;
}

// ============================================================================
// Selector Hooks (Performance Optimization)
// ============================================================================

export function useCurrentWorld() {
  const { currentWorld } = useWorld();
  return currentWorld;
}

export function useWorldAreas() {
  const { currentWorld } = useWorld();
  return currentWorld?.areas ?? [];
}

export function useWorldCharacters() {
  const { currentWorld } = useWorld();
  return currentWorld?.characters ?? [];
}

export function useWorldEquipment() {
  const { currentWorld } = useWorld();
  return currentWorld?.equipment ?? [];
}

export function useAvailableWorlds() {
  const { availableWorlds, worldsLoaded } = useWorld();
  return { worlds: availableWorlds, loaded: worldsLoaded };
}

export function useWorldShop(): ShopItem[] {
  const { currentWorld } = useWorld();
  return currentWorld?.shop ?? [];
}

export function useWorldAchievements(): Achievement[] {
  const { currentWorld } = useWorld();
  return currentWorld?.achievements ?? [];
}

export function useWorldTasks(): Task[] {
  const { currentWorld } = useWorld();
  return currentWorld?.tasks ?? [];
}

export function useWorldGuild(): GuildQuest[] {
  const { currentWorld } = useWorld();
  return currentWorld?.guild ?? [];
}

export function useWorldMinting(): CraftingRecipe[] {
  const { currentWorld } = useWorld();
  return currentWorld?.minting ?? [];
}

export function useWorldTowns(): Town[] {
  const { currentWorld } = useWorld();
  return currentWorld?.towns ?? [];
}

export function useWorldTownInteractions(townId: string): TownInteractionPoint[] {
  const { currentWorld } = useWorld();
  return currentWorld?.interactions?.[townId] ?? [];
}
