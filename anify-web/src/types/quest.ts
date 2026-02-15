export type QuestCategory = 'main' | 'side' | 'daily' | 'guild';

export type QuestStatus = 'active' | 'completed' | 'failed';

export interface QuestObjective {
  id: string;
  description: string;
  current: number;
  target: number;
  completed: boolean;
}

export interface QuestReward {
  id: string;
  type: 'gold' | 'exp' | 'item';
  name: string;
  icon: string;
  amount: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  category: QuestCategory;
  status: QuestStatus;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  level?: number;
  expiresAt?: Date;
}
