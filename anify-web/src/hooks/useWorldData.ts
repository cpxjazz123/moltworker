// src/hooks/useWorldData.ts

import { useMemo } from 'react';
import { useWorld, useCurrentWorld } from '@/contexts/WorldContext';
import type { Area, WorldMetaCharacter, Equipment } from '@/types/world-metadata';

/**
 * 获取当前世界的区域列表，支持筛选
 */
export function useAreas(options?: { type?: Area['type']; unlocked?: boolean }) {
  const world = useCurrentWorld();

  return useMemo(() => {
    if (!world) return [];

    let areas = world.areas;

    if (options?.type) {
      areas = areas.filter(a => a.type === options.type);
    }

    if (options?.unlocked !== undefined) {
      areas = areas.filter(a => a.unlocked === options.unlocked);
    }

    return areas;
  }, [world, options?.type, options?.unlocked]);
}

/**
 * 获取指定区域的角色列表
 */
export function useCharactersInArea(areaId: string | undefined) {
  const world = useCurrentWorld();
  const { getCharacter } = useWorld();

  return useMemo(() => {
    if (!world || !areaId) return [];

    const area = world.areas.find(a => a.id === areaId);
    if (!area) return [];

    return area.characters
      .map(charId => getCharacter(charId))
      .filter((c): c is WorldMetaCharacter => c !== undefined);
  }, [world, areaId, getCharacter]);
}

/**
 * 获取新手装备套装
 */
export function useStarterKit(): { enabled: boolean; equipment: Equipment[] } {
  const world = useCurrentWorld();

  return useMemo(() => {
    if (!world) {
      return { enabled: false, equipment: [] };
    }

    // 从 equipment.json 的 starterKit 配置获取
    // 这里需要从原始数据中获取 starterKit 配置
    // 暂时返回所有 equipped 的装备作为 starter kit
    const starterEquipment = world.equipment.filter(e => e.equipped);

    return {
      enabled: starterEquipment.length > 0,
      equipment: starterEquipment,
    };
  }, [world]);
}

/**
 * 获取当前世界的默认角色
 */
export function useDefaultCharacter() {
  const world = useCurrentWorld();
  const { getCharacter } = useWorld();

  return useMemo(() => {
    if (!world?.world.defaultCharacter) return undefined;
    return getCharacter(world.world.defaultCharacter);
  }, [world, getCharacter]);
}

/**
 * 获取当前世界的默认区域
 */
export function useDefaultArea() {
  const world = useCurrentWorld();
  const { getArea } = useWorld();

  return useMemo(() => {
    if (!world?.world.defaultArea) return undefined;
    return getArea(world.world.defaultArea);
  }, [world, getArea]);
}

/**
 * 检查世界特性
 */
export function useWorldFeatures() {
  const world = useCurrentWorld();

  return useMemo(() => {
    return world?.world.features ?? {
      combat: false,
      exploration: false,
      dialogue: false,
      tutorial: false,
      crafting: false,
      trading: false,
    };
  }, [world]);
}
