import { useMemo } from 'react';

import { useWorld } from '@/contexts/WorldContext';
import type { SceneConfig } from '@/types/world-metadata';

export interface SceneLoadResult {
  scene: SceneConfig | null;
  areaId: string | null;
  areaName: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 获取当前区域的场景配置
 * 优先使用指定的 areaId，否则使用 world.defaultArea
 */
export function useSceneLoader(areaId?: string): SceneLoadResult {
  const { currentWorld, isLoading, getArea, getScene } = useWorld();

  return useMemo(() => {
    if (isLoading) {
      return {
        scene: null,
        areaId: null,
        areaName: null,
        isLoading: true,
        error: null,
      };
    }

    if (!currentWorld) {
      return {
        scene: null,
        areaId: null,
        areaName: null,
        isLoading: false,
        error: 'No world loaded',
      };
    }

    const targetAreaId = areaId || currentWorld.world.defaultArea;
    if (!targetAreaId) {
      return {
        scene: null,
        areaId: null,
        areaName: null,
        isLoading: false,
        error: 'No default area configured',
      };
    }

    const area = getArea(targetAreaId);
    if (!area) {
      return {
        scene: null,
        areaId: targetAreaId,
        areaName: null,
        isLoading: false,
        error: `Area "${targetAreaId}" not found`,
      };
    }

    if (!area.scene) {
      return {
        scene: null,
        areaId: targetAreaId,
        areaName: area.name,
        isLoading: false,
        error: `Area "${area.name}" has no scene configured`,
      };
    }

    const scene = getScene(area.scene);
    if (!scene) {
      return {
        scene: null,
        areaId: targetAreaId,
        areaName: area.name,
        isLoading: false,
        error: `Scene "${area.scene}" not found`,
      };
    }

    return {
      scene,
      areaId: targetAreaId,
      areaName: area.name,
      isLoading: false,
      error: null,
    };
  }, [currentWorld, isLoading, areaId, getArea, getScene]);
}
