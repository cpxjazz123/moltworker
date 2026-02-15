// src/hooks/useWorlds.ts

import { useMemo } from 'react';
import { useAvailableWorlds, useWorld } from '@/contexts/WorldContext';
import type { WorldSummary } from '@/types/world-metadata';

export interface WorldInfo {
  id: string;
  name: string;
  description: string;
  image?: string;
  available: boolean;
  type: 'tutorial' | 'campaign' | 'sandbox';
  requirements: {
    minLevel: number;
    completedWorlds: string[];
  };
}

/**
 * 获取可用世界列表
 * 向后兼容原有接口
 */
export function useWorlds() {
  const { worlds, loaded } = useAvailableWorlds();
  const { currentWorldId, loadWorld } = useWorld();

  const worldList: WorldInfo[] = useMemo(() => {
    return worlds.map((w: WorldSummary) => ({
      id: w.id,
      name: w.name,
      description: w.description,
      image: w.coverImage,
      available: w.available,
      type: w.type,
      requirements: w.requirements,
    }));
  }, [worlds]);

  const selectWorld = async (worldId: string) => {
    await loadWorld(worldId);
  };

  const currentWorld = useMemo(() => {
    return worldList.find(w => w.id === currentWorldId) ?? null;
  }, [worldList, currentWorldId]);

  return {
    worlds: worldList,
    loading: !loaded,
    currentWorld,
    selectWorld,
    // 兼容旧 API
    isLoading: !loaded,
  };
}

/**
 * 获取世界信息及其区域 (API兼容层)
 * @deprecated Use useWorld() from WorldContext instead
 */
export function useWorldWithAreas(_worldId?: string) {
  const { currentWorld } = useWorld();
  
  const worldData = useMemo(() => {
    if (!currentWorld) return null;
    return {
      id: currentWorld.world.id,
      name: currentWorld.world.name,
      description: currentWorld.world.description,
      areas: currentWorld.areas,
    };
  }, [currentWorld]);
  
  return {
    data: worldData,
    isLoading: !currentWorld,
    error: null as Error | null,
  };
}
