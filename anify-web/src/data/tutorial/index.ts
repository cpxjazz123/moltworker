export * from "./character";

// Legacy types and data - kept for backward compatibility
// TODO: Remove once migrated to WorldContext data

export interface TutorialContact {
  id: string;
  name: string;
  title: string;
  avatar: string;
  status: "online" | "offline" | "busy";
  affinity: number;
  maxAffinity: number;
  unread?: number;
  type: "companion" | "friend" | "npc";
}

export const tutorialContacts: TutorialContact[] = [
  {
    id: "iris",
    name: "Iris",
    title: "虹彩守护者",
    avatar: "/Character_sample.png",
    status: "online",
    affinity: 10,
    maxAffinity: 100,
    unread: 1,
    type: "npc",
  },
];

export interface EquipmentStat {
  name: string;
  value: number;
}

export interface TutorialEquipment {
  id: string;
  name: string;
  type: "weapon" | "armor" | "accessory" | "helm" | "boots" | "gloves";
  rarity: "common" | "rare" | "epic" | "legendary";
  icon: string;
  level: number;
  stats: EquipmentStat[];
  description: string;
  equipped: boolean;
}

export const tutorialEquipment: TutorialEquipment[] = [
  {
    id: "wooden-sword",
    name: "初心者之剑",
    type: "weapon",
    rarity: "common",
    icon: "⚔️",
    level: 1,
    stats: [
      { name: "攻击", value: 10 },
      { name: "暴击", value: 2 },
    ],
    description: "每个冒险者的起点。虽然简陋，但承载着无限可能。",
    equipped: true,
  },
  {
    id: "leather-armor",
    name: "皮革护甲",
    type: "armor",
    rarity: "common",
    icon: "🛡️",
    level: 1,
    stats: [
      { name: "防御", value: 8 },
      { name: "生命", value: 20 },
    ],
    description: "柔软的皮革制成，提供基本的保护。",
    equipped: true,
  },
  {
    id: "iron-helm",
    name: "铁制头盔",
    type: "helm",
    rarity: "common",
    icon: "🪖",
    level: 1,
    stats: [
      { name: "防御", value: 5 },
      { name: "魔抗", value: 3 },
    ],
    description: "坚固的铁制头盔，保护头部免受伤害。",
    equipped: true,
  },
  {
    id: "leather-gloves",
    name: "皮革手套",
    type: "gloves",
    rarity: "common",
    icon: "🧤",
    level: 1,
    stats: [
      { name: "攻击", value: 3 },
      { name: "暴击", value: 1 },
    ],
    description: "灵活的皮革手套，便于握持武器。",
    equipped: true,
  },
  {
    id: "travel-boots",
    name: "旅行靴",
    type: "boots",
    rarity: "common",
    icon: "👢",
    level: 1,
    stats: [
      { name: "速度", value: 5 },
      { name: "防御", value: 2 },
    ],
    description: "耐用的旅行靴，适合长途跋涉。",
    equipped: true,
  },
  {
    id: "lucky-charm",
    name: "幸运吊坠",
    type: "accessory",
    rarity: "rare",
    icon: "🔮",
    level: 1,
    stats: [
      { name: "暴击", value: 5 },
      { name: "魔力", value: 10 },
    ],
    description: "据说能带来好运的神秘吊坠，散发着淡淡的蓝光。",
    equipped: true,
  },
];
