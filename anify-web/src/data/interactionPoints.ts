import type { InteractionPoint } from '@/types';

/**
 * Sample interaction points for the game world
 * These would typically be loaded from a backend API
 */
export const SAMPLE_INTERACTION_POINTS: InteractionPoint[] = [
  // Shop - General Store
  {
    id: 'shop-general',
    label: '杂货店',
    description: '购买各种冒险用品',
    position: [5, 0, -3],
    interactionRadius: 2,
    icon: 'store',
    action: {
      type: 'panel',
      config: {
        panelType: 'shop',
        initialTab: 'all',
        npcId: 'merchant-01',
      },
    },
    isActive: true,
  },

  // Forge - Blacksmith
  {
    id: 'forge-blacksmith',
    label: '铁匠铺',
    description: '强化和附魔装备',
    position: [-8, 0, 2],
    interactionRadius: 2.5,
    icon: 'anvil',
    action: {
      type: 'panel',
      config: {
        panelType: 'forge',
        initialTab: 'enhance',
        npcId: 'blacksmith-01',
      },
    },
    isActive: true,
  },

  // Guild - Adventurer's Guild
  {
    id: 'guild-adventurer',
    label: '冒险者公会',
    description: '接取任务获得报酬',
    position: [0, 0, 10],
    interactionRadius: 3,
    icon: 'shield',
    action: {
      type: 'panel',
      config: {
        panelType: 'guild',
        npcId: 'guild-master-01',
      },
    },
    isActive: true,
  },

  // Residence - Player Home
  {
    id: 'residence-home',
    label: '我的住所',
    description: '休息和储物',
    position: [12, 0, 5],
    interactionRadius: 2,
    icon: 'home',
    action: {
      type: 'panel',
      config: {
        panelType: 'residence',
        initialTab: 'rest',
      },
    },
    isActive: true,
  },

  // Storage - Public Warehouse
  {
    id: 'storage-public',
    label: '公共仓库',
    description: '存放物品',
    position: [-5, 0, -8],
    interactionRadius: 2,
    icon: 'warehouse',
    action: {
      type: 'panel',
      config: {
        panelType: 'storage',
      },
    },
    isActive: true,
  },

  // Map - World Map Sign
  {
    id: 'map-sign',
    label: '世界地图',
    description: '查看世界地图',
    position: [0, 0, 0],
    interactionRadius: 1.5,
    icon: 'map',
    action: {
      type: 'open-map',
      config: {
        canTravel: true,
      },
    },
    isActive: true,
  },

  // Scene Switch - Forest Entrance
  {
    id: 'scene-forest',
    label: '森林入口',
    description: '通往神秘森林',
    position: [20, 0, 0],
    interactionRadius: 3,
    icon: 'tree',
    action: {
      type: 'scene-switch',
      config: {
        targetSceneId: 'forest-01',
        spawnPointId: 'entrance',
        transition: 'fade',
      },
    },
    isActive: true,
    requirements: {
      minLevel: 5,
    },
  },

  // Dialogue - NPC
  {
    id: 'npc-villager',
    label: '村民阿明',
    description: '和村民交谈',
    position: [3, 0, 6],
    interactionRadius: 2,
    icon: 'person',
    action: {
      type: 'dialogue',
      config: {
        npcId: 'villager-01',
        dialogueTreeId: 'greeting',
      },
    },
    isActive: true,
  },
];

/**
 * Get interaction points for a specific scene
 */
export function getInteractionPointsForScene(sceneId: string): InteractionPoint[] {
  // In a real implementation, this would filter by scene
  // For now, return all sample points
  console.log('Loading interaction points for scene:', sceneId);
  return SAMPLE_INTERACTION_POINTS;
}

/**
 * Get a specific interaction point by ID
 */
export function getInteractionPointById(id: string): InteractionPoint | undefined {
  return SAMPLE_INTERACTION_POINTS.find((point) => point.id === id);
}
