import { useEffect, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { GlassCard, GlassContainer, PageHeader } from '@/components/ui/glass-card';
import { MemoryGrid } from '@/components/memory/MemoryGrid';
import { useMemoryStore } from '@/stores/memoryStore';
import { MOCK_MEMORIES } from '@/data/mockMemories';
import type { Memory } from '@/types';

export const Route = createFileRoute('/_game/memories')({
  component: MemoriesPage,
});

function MemoriesPage() {
  const {
    memories,
    filters,
    selectedMemoryId,
    setMemories,
    setFilters,
    setSelectedMemoryId,
    toggleFavorite,
    markAsRead,
  } = useMemoryStore();

  // Load mock data on mount
  useEffect(() => {
    if (memories.length === 0) {
      setMemories(MOCK_MEMORIES);
    }
  }, [memories.length, setMemories]);

  const selectedMemory = useMemo(
    () => memories.find((m) => m.id === selectedMemoryId) || null,
    [memories, selectedMemoryId]
  );

  const handleSelectMemory = (memory: Memory | null) => {
    setSelectedMemoryId(memory?.id || null);
    if (memory?.isNew) {
      markAsRead(memory.id);
    }
  };

  // Stats
  const stats = useMemo(
    () => ({
      total: memories.length,
      favorites: memories.filter((m) => m.isFavorite).length,
      newCount: memories.filter((m) => m.isNew).length,
      categories: {
        conversation: memories.filter((m) => m.category === 'conversation').length,
        adventure: memories.filter((m) => m.category === 'adventure').length,
        achievement: memories.filter((m) => m.category === 'achievement').length,
        special: memories.filter((m) => m.category === 'special').length,
      },
    }),
    [memories]
  );

  return (
    <GlassContainer>
      <PageHeader title="回忆录" backTo="/character" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <GlassCard size="sm" className="text-center">
          <div className="text-2xl font-bold text-amber-400">{stats.total}</div>
          <div className="text-xs text-white/60">总回忆</div>
        </GlassCard>
        <GlassCard size="sm" className="text-center">
          <div className="text-2xl font-bold text-rose-400">{stats.favorites}</div>
          <div className="text-xs text-white/60">收藏</div>
        </GlassCard>
        <GlassCard size="sm" className="text-center">
          <div className="text-2xl font-bold text-green-400">{stats.newCount}</div>
          <div className="text-xs text-white/60">新回忆</div>
        </GlassCard>
        <GlassCard size="sm" className="text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.categories.special}</div>
          <div className="text-xs text-white/60">特殊时刻</div>
        </GlassCard>
      </div>

      {/* Memory Grid */}
      <MemoryGrid
        memories={memories}
        filters={filters}
        selectedMemory={selectedMemory}
        onFilterChange={setFilters}
        onSelectMemory={handleSelectMemory}
        onFavorite={toggleFavorite}
      />
    </GlassContainer>
  );
}
