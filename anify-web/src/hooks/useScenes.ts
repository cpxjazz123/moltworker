// src/hooks/useScenes.ts

import { useMemo, useCallback } from 'react';
import { useWorld, useCurrentWorld } from '@/contexts/WorldContext';
import type { SceneConfig, SceneInteractionPoint, Area } from '@/types/world-metadata';

/**
 * 获取当前世界的 3D 场景配置
 */
export function useWorldScenes() {
  const world = useCurrentWorld();
  const { getScene, getArea } = useWorld();

  const scenes = useMemo(() => {
    return world?.scenes ?? {};
  }, [world]);

  const getSceneConfig = useCallback((sceneId: string): SceneConfig | undefined => {
    return getScene(sceneId);
  }, [getScene]);

  // 获取区域的场景配置
  const getSceneForArea = useCallback((areaId: string): SceneConfig | undefined => {
    const area = getArea(areaId);
    if (!area?.scene) return undefined;
    return getScene(area.scene);
  }, [getArea, getScene]);

  // 获取场景的交互点
  const getInteractionPoints = useCallback((sceneId: string): SceneInteractionPoint[] => {
    const scene = getScene(sceneId);
    return scene?.interactionPoints ?? [];
  }, [getScene]);

  // 获取场景的碰撞墙
  const getWalls = useCallback((sceneId: string) => {
    const scene = getScene(sceneId);
    return scene?.walls ?? [];
  }, [getScene]);

  // 获取所有有场景的区域
  const areasWithScenes = useMemo((): Area[] => {
    return (world?.areas ?? []).filter(a => a.scene && scenes[a.scene]);
  }, [world, scenes]);

  return {
    scenes,
    getScene: getSceneConfig,
    getSceneForArea,
    getInteractionPoints,
    getWalls,
    areasWithScenes,
    loading: !world,
  };
}
