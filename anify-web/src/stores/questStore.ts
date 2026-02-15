import { create } from 'zustand';

import type { Quest } from '@/types';

interface QuestStore {
  quests: Quest[];
  trackedQuestId: string | null;

  addQuest: (quest: Quest) => void;
  removeQuest: (questId: string) => void;
  updateQuest: (questId: string, updates: Partial<Quest>) => void;
  trackQuest: (questId: string) => void;
  untrackQuest: () => void;
  setQuests: (quests: Quest[]) => void;
}

const initialState = {
  quests: [] as Quest[],
  trackedQuestId: null as string | null,
};

export const useQuestStore = create<QuestStore>((set) => ({
  ...initialState,

  addQuest: (quest) =>
    set((state) => ({
      quests: [...state.quests, quest],
    })),

  removeQuest: (questId) =>
    set((state) => ({
      quests: state.quests.filter((q) => q.id !== questId),
      trackedQuestId: state.trackedQuestId === questId ? null : state.trackedQuestId,
    })),

  updateQuest: (questId, updates) =>
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === questId ? { ...q, ...updates } : q
      ),
    })),

  trackQuest: (questId) =>
    set({ trackedQuestId: questId }),

  untrackQuest: () =>
    set({ trackedQuestId: null }),

  setQuests: (quests) =>
    set({ quests }),
}));
