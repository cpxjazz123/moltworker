// src/hooks/useWorldQuests.ts

import { useMemo, useCallback } from 'react';
import { useWorld, useCurrentWorld } from '@/contexts/WorldContext';
import type { WorldMetaQuest } from '@/types/world-metadata';

export interface QuestInfo {
  id: string;
  name: string;
  description: string;
  category: WorldMetaQuest['category'];
  level: number;
  giver?: string;
  location?: string;
  objectives: WorldMetaQuest['objectives'];
  rewards: WorldMetaQuest['rewards'];
}

/**
 * 获取当前世界的任务定义数据
 * 注意：这是静态的世界定义数据，不是用户任务状态
 * 用户任务状态请使用 useQuests (API hook)
 */
export function useWorldQuests() {
  const world = useCurrentWorld();
  const { getQuest, getCharacter, getArea } = useWorld();

  const quests: QuestInfo[] = useMemo(() => {
    return (world?.quests ?? []).map(q => ({
      id: q.id,
      name: q.name,
      description: q.description,
      category: q.category,
      level: q.level,
      giver: q.giver,
      location: q.location,
      objectives: q.objectives,
      rewards: q.rewards,
    }));
  }, [world]);

  const getQuestInfo = useCallback((questId: string): QuestInfo | undefined => {
    const q = getQuest(questId);
    if (!q) return undefined;

    return {
      id: q.id,
      name: q.name,
      description: q.description,
      category: q.category,
      level: q.level,
      giver: q.giver,
      location: q.location,
      objectives: q.objectives,
      rewards: q.rewards,
    };
  }, [getQuest]);

  // 按类别筛选
  const getQuestsByCategory = useCallback((category: WorldMetaQuest['category']) => {
    return quests.filter(q => q.category === category);
  }, [quests]);

  // 主线任务
  const mainQuests = useMemo(() => {
    return quests.filter(q => q.category === 'main');
  }, [quests]);

  // 支线任务
  const sideQuests = useMemo(() => {
    return quests.filter(q => q.category === 'side');
  }, [quests]);

  // 获取任务发布者信息
  const getQuestGiver = useCallback((questId: string) => {
    const quest = getQuest(questId);
    if (!quest?.giver) return undefined;
    return getCharacter(quest.giver);
  }, [getQuest, getCharacter]);

  // 获取任务地点信息
  const getQuestLocation = useCallback((questId: string) => {
    const quest = getQuest(questId);
    if (!quest?.location) return undefined;
    return getArea(quest.location);
  }, [getQuest, getArea]);

  return {
    quests,
    getQuest: getQuestInfo,
    getQuestsByCategory,
    mainQuests,
    sideQuests,
    getQuestGiver,
    getQuestLocation,
    loading: !world,
  };
}
