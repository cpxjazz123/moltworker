import { create } from 'zustand';

import type { Memory, MemoryFilters } from '@/types';

interface MemoryStore {
  memories: Memory[];
  filters: MemoryFilters;
  selectedMemoryId: string | null;

  addMemory: (memory: Memory) => void;
  toggleFavorite: (memoryId: string) => void;
  markAsRead: (memoryId: string) => void;
  setFilters: (filters: Partial<MemoryFilters>) => void;
  setSelectedMemoryId: (memoryId: string | null) => void;
  setMemories: (memories: Memory[]) => void;
}

const initialFilters: MemoryFilters = {
  category: 'all',
  favoriteOnly: false,
  search: undefined,
};

const initialState = {
  memories: [] as Memory[],
  filters: initialFilters,
  selectedMemoryId: null as string | null,
};

export const useMemoryStore = create<MemoryStore>((set) => ({
  ...initialState,

  addMemory: (memory) =>
    set((state) => ({
      memories: [memory, ...state.memories],
    })),

  toggleFavorite: (memoryId) =>
    set((state) => ({
      memories: state.memories.map((m) =>
        m.id === memoryId ? { ...m, isFavorite: !m.isFavorite } : m
      ),
    })),

  markAsRead: (memoryId) =>
    set((state) => ({
      memories: state.memories.map((m) =>
        m.id === memoryId ? { ...m, isNew: false } : m
      ),
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setSelectedMemoryId: (memoryId) =>
    set({ selectedMemoryId: memoryId }),

  setMemories: (memories) =>
    set({ memories }),
}));
