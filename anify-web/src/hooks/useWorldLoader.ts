// src/hooks/useWorldLoader.ts

import { useState, useCallback } from 'react';
import type {
  WorldMeta,
  WorldMetadata,
  WorldSummary,
  AreasFile,
  CharactersFile,
  EquipmentFile,
  ItemsFile,
  QuestsFile,
  DialoguesFile,
  TutorialConfig,
  FactionsFile,
  EnemiesFile,
  SceneConfig,
  ShopItem,
  Achievement,
  Task,
  GuildQuest,
  CraftingRecipe,
  Town,
  TownInteractionPoint,
} from '@/types/world-metadata';

const WORLDS_BASE_PATH = '/worlds';

interface LoaderState {
  isLoading: boolean;
  error: Error | null;
  progress: number;
}

// 已知的世界 ID 列表（静态服务器无法列目录，需要显式列出）
const WORLD_IDS = ['official-intro', 'anthromyth'];

interface UseWorldLoaderReturn extends LoaderState {
  loadWorld: (worldId: string) => Promise<WorldMetadata>;
  loadWorldIndex: () => Promise<WorldSummary[]>;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }
  return response.json();
}

/**
 * 加载世界的所有 JSON 文件
 */
export function useWorldLoader(): UseWorldLoaderReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const loadWorldIndex = useCallback(async (): Promise<WorldSummary[]> => {
    const results = await Promise.all(
      WORLD_IDS.map(async (worldId): Promise<WorldSummary | null> => {
        try {
          const meta = await fetchJson<WorldMeta>(`${WORLDS_BASE_PATH}/${worldId}/world.json`);
          return {
            id: meta.id,
            name: meta.name,
            description: meta.description,
            type: meta.type,
            coverImage: meta.coverImage,
            available: meta.available,
            requirements: meta.requirements,
          };
        } catch {
          console.warn(`[WorldLoader] Failed to load world.json for ${worldId}, skipping`);
          return null;
        }
      })
    );
    return results.filter((w): w is WorldSummary => w !== null);
  }, []);

  const loadWorld = useCallback(async (worldId: string): Promise<WorldMetadata> => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    const basePath = `${WORLDS_BASE_PATH}/${worldId}`;

    try {
      // 定义所有需要加载的文件
      const files = [
        { key: 'world', path: `${basePath}/world.json`, required: true },
        { key: 'areas', path: `${basePath}/areas.json`, required: true },
        { key: 'characters', path: `${basePath}/characters.json`, required: true },
        { key: 'equipment', path: `${basePath}/equipment.json`, required: true },
        { key: 'items', path: `${basePath}/items.json`, required: false },
        { key: 'quests', path: `${basePath}/quests.json`, required: false },
        { key: 'dialogues', path: `${basePath}/dialogues.json`, required: true },
        { key: 'tutorial', path: `${basePath}/tutorial/steps.json`, required: false },
        { key: 'factions', path: `${basePath}/factions.json`, required: false },
        { key: 'enemies', path: `${basePath}/enemies.json`, required: false },
        { key: 'shop', path: `${basePath}/shop.json`, required: false },
        { key: 'achievements', path: `${basePath}/achievements.json`, required: false },
        { key: 'tasks', path: `${basePath}/tasks.json`, required: false },
        { key: 'guild', path: `${basePath}/guild.json`, required: false },
        { key: 'minting', path: `${basePath}/minting.json`, required: false },
        { key: 'towns', path: `${basePath}/towns.json`, required: false },
        { key: 'interactions', path: `${basePath}/interactions.json`, required: false },
      ];

      const totalFiles = files.length;
      let loadedCount = 0;

      // 并行加载所有文件
      const loadFile = async (file: typeof files[0]) => {
        try {
          const data = await fetchJson(file.path);
          loadedCount++;
          setProgress((loadedCount / totalFiles) * 100);
          return { key: file.key, data, success: true };
        } catch (err) {
          loadedCount++;
          setProgress((loadedCount / totalFiles) * 100);
          if (file.required) {
            throw new Error(`Required file ${file.path} failed to load`);
          }
          return { key: file.key, data: null, success: false };
        }
      };

      const results = await Promise.all(files.map(loadFile));

      // 组装结果
      const dataMap: Record<string, unknown> = {};
      for (const result of results) {
        if (result.success) {
          dataMap[result.key] = result.data;
        }
      }

      // 加载场景文件 (根据 areas 中引用的 scene)
      const areasData = dataMap.areas as AreasFile;
      const sceneIds = areasData.areas
        .filter(a => a.scene)
        .map(a => a.scene!);

      const scenes: Record<string, SceneConfig> = {};
      await Promise.all(
        sceneIds.map(async (sceneId) => {
          try {
            const sceneData = await fetchJson<SceneConfig>(`${basePath}/scenes/${sceneId}.json`);
            scenes[sceneId] = sceneData;
          } catch {
            console.warn(`Scene ${sceneId} not found, skipping`);
          }
        })
      );

      // 构建 WorldMetadata
      const worldData = dataMap.world as WorldMeta;
      const charactersData = dataMap.characters as CharactersFile;
      const equipmentData = dataMap.equipment as EquipmentFile;
      const itemsData = dataMap.items as ItemsFile | null;
      const questsData = dataMap.quests as QuestsFile | null;
      const dialoguesData = dataMap.dialogues as DialoguesFile;
      const tutorialData = dataMap.tutorial as TutorialConfig | null;
      const factionsData = dataMap.factions as FactionsFile | null;
      const enemiesData = dataMap.enemies as EnemiesFile | null;
      const shopData = dataMap.shop as ShopItem[] | null;
      const achievementsData = dataMap.achievements as Achievement[] | null;
      const tasksData = dataMap.tasks as Task[] | null;
      const guildData = dataMap.guild as GuildQuest[] | null;
      const mintingData = dataMap.minting as CraftingRecipe[] | null;
      const townsData = dataMap.towns as Town[] | null;
      const interactionsData = dataMap.interactions as Record<string, TownInteractionPoint[]> | null;

      const metadata: WorldMetadata = {
        world: worldData,
        areas: areasData.areas,
        characters: charactersData.characters,
        equipment: equipmentData.equipment,
        items: itemsData?.items ?? [],
        quests: questsData?.quests ?? [],
        dialogues: dialoguesData.dialogues,
        scenes,
        tutorial: tutorialData ?? undefined,
        factions: factionsData?.factions,
        enemies: enemiesData?.enemies,
        shop: shopData ?? undefined,
        achievements: achievementsData ?? undefined,
        tasks: tasksData ?? undefined,
        guild: guildData ?? undefined,
        minting: mintingData ?? undefined,
        towns: townsData ?? undefined,
        interactions: interactionsData ?? undefined,
      };

      setProgress(100);
      return metadata;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    progress,
    loadWorld,
    loadWorldIndex,
  };
}
