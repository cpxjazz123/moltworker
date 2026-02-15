// src/hooks/useEquipment.ts

import { useMemo, useCallback } from 'react';
import { useWorld, useWorldEquipment } from '@/contexts/WorldContext';
import type { ItemType, ItemRarity } from '@/types/world-metadata';

export interface EquipmentInfo {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string;
  level: number;
  stats: { name: string; value: number }[];
  description: string;
}

/**
 * 获取当前世界的装备数据
 */
export function useEquipment() {
  const equipment = useWorldEquipment();
  const { getEquipment, currentWorld } = useWorld();

  const equipmentList: EquipmentInfo[] = useMemo(() => {
    return equipment.map(e => ({
      id: e.id,
      name: e.name,
      type: e.type,
      rarity: e.rarity,
      icon: e.icon,
      level: e.level,
      stats: e.stats,
      description: e.description,
    }));
  }, [equipment]);

  const getEquipmentInfo = useCallback((equipmentId: string): EquipmentInfo | undefined => {
    const eq = getEquipment(equipmentId);
    if (!eq) return undefined;

    return {
      id: eq.id,
      name: eq.name,
      type: eq.type,
      rarity: eq.rarity,
      icon: eq.icon,
      level: eq.level,
      stats: eq.stats,
      description: eq.description,
    };
  }, [getEquipment]);

  // 按类型筛选
  const getEquipmentByType = useCallback((type: ItemType) => {
    return equipmentList.filter(e => e.type === type);
  }, [equipmentList]);

  // 按稀有度筛选
  const getEquipmentByRarity = useCallback((rarity: ItemRarity) => {
    return equipmentList.filter(e => e.rarity === rarity);
  }, [equipmentList]);

  // 新手套装
  const starterKit = useMemo(() => {
    // 从原始数据获取 starterKit 配置
    // 这里简单返回所有 equipped 的装备
    return equipment.filter(e => e.equipped);
  }, [equipment]);

  return {
    equipment: equipmentList,
    getEquipment: getEquipmentInfo,
    getEquipmentByType,
    getEquipmentByRarity,
    starterKit,
    loading: !currentWorld,
  };
}
