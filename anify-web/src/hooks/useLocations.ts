// src/hooks/useLocations.ts

import { useMemo, useCallback } from 'react';
import { useWorld, useWorldAreas, useAvailableWorlds } from '@/contexts/WorldContext';
import type { Area } from '@/types/world-metadata';

export interface LocationInfo {
  id: string;
  name: string;
  description: string;
  type: Area['type'];
  x: number;
  y: number;
  icon: string;
  dangerLevel: number;
  levelRange?: string;
  unlocked: boolean;
  connectedAreas: string[];
  worldId?: string;
  mapX: number;
  mapY: number;
}

export interface Location extends LocationInfo { }

export interface WorldMapInfo {
  id: string;
  name: string;
  description: string;
  image?: string;
  unlocked: boolean;
  backgroundUrl?: string;
}

/**
 * 获取当前世界的区域/地点列表
 */
export function useLocations() {
  const areas = useWorldAreas();
  const { getArea, currentWorld, currentWorldId } = useWorld();
  const { worlds } = useAvailableWorlds();

  const worldMapList: WorldMapInfo[] = useMemo(() => {
    return worlds.map(w => ({
      id: w.id,
      name: w.name,
      description: w.description,
      image: w.coverImage,
      unlocked: w.available,
      backgroundUrl: w.coverImage, // Use coverImage as map background
    }));
  }, [worlds]);

  const locations: Location[] = useMemo(() => {
    return areas.map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
      type: a.type,
      x: a.mapX,
      y: a.mapY,
      mapX: a.mapX,
      mapY: a.mapY,
      icon: a.icon,
      dangerLevel: a.dangerLevel,
      levelRange: a.levelRange,
      unlocked: a.unlocked,
      connectedAreas: a.connectedAreas,
      worldId: currentWorldId ?? '',
    }));
  }, [areas, currentWorldId]);

  const getLocation = useCallback((locationId: string): LocationInfo | undefined => {
    const area = getArea(locationId);
    if (!area) return undefined;

    return {
      id: area.id,
      name: area.name,
      description: area.description,
      type: area.type,
      x: area.mapX,
      y: area.mapY,
      mapX: area.mapX,
      mapY: area.mapY,
      icon: area.icon,
      dangerLevel: area.dangerLevel,
      levelRange: area.levelRange,
      unlocked: area.unlocked,
      connectedAreas: area.connectedAreas,
      worldId: currentWorldId ?? '',
    };
  }, [getArea, currentWorldId]);

  const defaultLocation = useMemo(() => {
    if (!currentWorld?.world.defaultArea) return null;
    return getLocation(currentWorld.world.defaultArea) ?? null;
  }, [currentWorld, getLocation]);

  // 按类型筛选
  const getLocationsByType = useCallback((type: Area['type']) => {
    return locations.filter(l => l.type === type);
  }, [locations]);

  // 获取已解锁的地点
  const unlockedLocations = useMemo(() => {
    return locations.filter(l => l.unlocked);
  }, [locations]);

  return {
    locations,
    unlockedLocations,
    getLocation,
    getLocationsByType,
    defaultLocation,
    loading: !currentWorld,
    // 向后兼容
    worlds: worldMapList,
  };
}
