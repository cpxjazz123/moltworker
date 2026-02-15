import { Heart } from 'lucide-react';

import { GlassCard, GlassGrid } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import type { Memory, MemoryCategory, MemoryFilters } from '@/types';

import { MemoryCard } from './MemoryCard';
import { MemoryDetail } from './MemoryDetail';

interface MemoryGridProps {
  memories: Memory[];
  filters: MemoryFilters;
  selectedMemory: Memory | null;
  onFilterChange: (filters: Partial<MemoryFilters>) => void;
  onSelectMemory: (memory: Memory | null) => void;
  onFavorite: (memoryId: string) => void;
}

const CATEGORY_OPTIONS: { value: MemoryCategory | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'conversation', label: '对话' },
  { value: 'adventure', label: '冒险' },
  { value: 'achievement', label: '成就' },
  { value: 'special', label: '特殊' },
];

export function MemoryGrid({
  memories,
  filters,
  selectedMemory,
  onFilterChange,
  onSelectMemory,
  onFavorite,
}: MemoryGridProps) {
  const filteredMemories = memories.filter((memory) => {
    if (filters.category !== 'all' && memory.category !== filters.category) {
      return false;
    }
    if (filters.favoriteOnly && !memory.isFavorite) {
      return false;
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        memory.title.toLowerCase().includes(search) ||
        memory.description.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange({ category: option.value })}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                filters.category === option.value
                  ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => onFilterChange({ favoriteOnly: !filters.favoriteOnly })}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ml-auto flex items-center gap-2',
            filters.favoriteOnly
              ? 'bg-rose-500/30 text-rose-400 border border-rose-500/50'
              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
          )}
        >
          <Heart size={16} fill={filters.favoriteOnly ? 'currentColor' : 'none'} />
          收藏
        </button>
      </div>

      {/* Memory Grid */}
      {filteredMemories.length > 0 ? (
        <GlassGrid cols={3}>
          {filteredMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onFavorite={onFavorite}
              onClick={onSelectMemory}
            />
          ))}
        </GlassGrid>
      ) : (
        <GlassCard className="text-center py-12">
          <div className="text-4xl mb-4">📓</div>
          <p className="text-white/60">没有找到符合条件的回忆</p>
        </GlassCard>
      )}

      {/* Detail Modal */}
      {selectedMemory && (
        <MemoryDetail
          memory={selectedMemory}
          onClose={() => onSelectMemory(null)}
          onFavorite={onFavorite}
        />
      )}
    </>
  );
}
