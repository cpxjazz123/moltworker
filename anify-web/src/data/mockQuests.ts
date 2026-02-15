import type { Quest } from '@/types';

export const MOCK_QUESTS: Quest[] = [
  {
    id: 'quest-001',
    name: '初出茅庐',
    description: '作为新晋冒险者，你需要完成一系列基础任务来证明自己的实力。前往冒险者公会接受你的第一个任务吧。',
    category: 'main',
    status: 'active',
    level: 1,
    objectives: [
      { id: 'obj-001-1', description: '与公会接待员对话', current: 1, target: 1, completed: true },
      { id: 'obj-001-2', description: '完成新手训练', current: 2, target: 3, completed: false },
      { id: 'obj-001-3', description: '获得冒险者徽章', current: 0, target: 1, completed: false },
    ],
    rewards: [
      { id: 'rwd-001-1', type: 'exp', name: '经验值', icon: '✨', amount: 100 },
      { id: 'rwd-001-2', type: 'gold', name: '金币', icon: '🪙', amount: 50 },
      { id: 'rwd-001-3', type: 'item', name: '新手剑', icon: '⚔️', amount: 1 },
    ],
  },
  {
    id: 'quest-002',
    name: '森林里的骚动',
    description: '最近森林里出现了一些不寻常的动静，村民们都很担心。请前往调查并解决问题。',
    category: 'side',
    status: 'active',
    level: 3,
    objectives: [
      { id: 'obj-002-1', description: '前往迷雾森林', current: 0, target: 1, completed: false },
      { id: 'obj-002-2', description: '调查异常区域', current: 0, target: 3, completed: false },
      { id: 'obj-002-3', description: '击败野兽首领', current: 0, target: 1, completed: false },
    ],
    rewards: [
      { id: 'rwd-002-1', type: 'exp', name: '经验值', icon: '✨', amount: 200 },
      { id: 'rwd-002-2', type: 'gold', name: '金币', icon: '🪙', amount: 120 },
      { id: 'rwd-002-3', type: 'item', name: '森林护符', icon: '🍀', amount: 1 },
    ],
  },
  {
    id: 'quest-003',
    name: '每日巡逻',
    description: '协助城镇卫兵进行日常巡逻，维护城镇的安全与秩序。',
    category: 'daily',
    status: 'active',
    objectives: [
      { id: 'obj-003-1', description: '巡逻东区', current: 1, target: 1, completed: true },
      { id: 'obj-003-2', description: '巡逻西区', current: 1, target: 1, completed: true },
      { id: 'obj-003-3', description: '向卫兵队长报告', current: 0, target: 1, completed: false },
    ],
    rewards: [
      { id: 'rwd-003-1', type: 'exp', name: '经验值', icon: '✨', amount: 50 },
      { id: 'rwd-003-2', type: 'gold', name: '金币', icon: '🪙', amount: 30 },
    ],
  },
  {
    id: 'quest-004',
    name: '工会委托：采集药草',
    description: '工会需要一批药草来制作治疗药剂，请前往草原采集所需的材料。',
    category: 'guild',
    status: 'active',
    objectives: [
      { id: 'obj-004-1', description: '采集治愈草', current: 5, target: 10, completed: false },
      { id: 'obj-004-2', description: '采集月光花', current: 2, target: 5, completed: false },
    ],
    rewards: [
      { id: 'rwd-004-1', type: 'exp', name: '经验值', icon: '✨', amount: 80 },
      { id: 'rwd-004-2', type: 'gold', name: '金币', icon: '🪙', amount: 100 },
      { id: 'rwd-004-3', type: 'item', name: '工会贡献点', icon: '⭐', amount: 10 },
    ],
  },
  {
    id: 'quest-005',
    name: '失落的宝藏',
    description: '你在旧书店发现了一张古老的藏宝图，传说那里埋藏着前代冒险者留下的宝藏。',
    category: 'side',
    status: 'completed',
    level: 5,
    objectives: [
      { id: 'obj-005-1', description: '解读藏宝图', current: 1, target: 1, completed: true },
      { id: 'obj-005-2', description: '找到隐藏洞穴', current: 1, target: 1, completed: true },
      { id: 'obj-005-3', description: '获取宝藏', current: 1, target: 1, completed: true },
    ],
    rewards: [
      { id: 'rwd-005-1', type: 'exp', name: '经验值', icon: '✨', amount: 300 },
      { id: 'rwd-005-2', type: 'gold', name: '金币', icon: '🪙', amount: 500 },
      { id: 'rwd-005-3', type: 'item', name: '传奇戒指', icon: '💍', amount: 1 },
    ],
  },
];
