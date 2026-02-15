import { useEffect, useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Heart, MapPin, User, Star } from 'lucide-react';

import { GlassCard, GlassContainer, PageHeader, GlassBadge } from '@/components/ui/glass-card';
import { useMemoryStore } from '@/stores/memoryStore';
import { MOCK_MEMORIES } from '@/data/mockMemories';
import { cn } from '@/lib/utils';
import type { Memory, MemoryCategory } from '@/types';

export const Route = createFileRoute('/_game/timeline')({
  component: TimelinePage,
});

const CATEGORY_LABELS: Record<MemoryCategory, string> = {
  conversation: '对话',
  adventure: '冒险',
  achievement: '成就',
  special: '特殊',
};

const CATEGORY_COLORS: Record<MemoryCategory, string> = {
  conversation: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  adventure: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  achievement: 'bg-green-500/20 text-green-400 border-green-500/30',
  special: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

function TimelinePage() {
  const { memories, setMemories, toggleFavorite } = useMemoryStore();
  const [filter, setFilter] = useState<MemoryCategory | 'all'>('all');
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  // Load mock data on mount
  useEffect(() => {
    if (memories.length === 0) {
      setMemories(MOCK_MEMORIES);
    }
  }, [memories.length, setMemories]);

  // Filter and sort memories
  const filteredMemories = useMemo(() => {
    return memories
      .filter((memory) => {
        if (filter !== 'all' && memory.category !== filter) return false;
        if (favoriteOnly && !memory.isFavorite) return false;
        return true;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [memories, filter, favoriteOnly]);

  // Group by date
  const groupedMemories = useMemo(() => {
    const groups: Record<string, Memory[]> = {};
    filteredMemories.forEach((memory) => {
      const dateKey = memory.timestamp.toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(memory);
    });
    return groups;
  }, [filteredMemories]);

  // Stats
  const stats = useMemo(
    () => ({
      total: memories.length,
      days: Object.keys(groupedMemories).length,
      favorites: memories.filter((m) => m.isFavorite).length,
    }),
    [memories, groupedMemories]
  );

  return (
    <GlassContainer>
      <PageHeader title="时间线" backTo="/character" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <GlassCard size="sm" className="text-center">
          <div className="text-2xl font-bold text-amber-400">{stats.total}</div>
          <div className="text-xs text-white/60">总回忆</div>
        </GlassCard>
        <GlassCard size="sm" className="text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.days}</div>
          <div className="text-xs text-white/60">冒险天数</div>
        </GlassCard>
        <GlassCard size="sm" className="text-center">
          <div className="text-2xl font-bold text-rose-400">{stats.favorites}</div>
          <div className="text-xs text-white/60">收藏</div>
        </GlassCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'conversation', 'adventure', 'achievement', 'special'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
              filter === type
                ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            )}
          >
            {type === 'all' ? '全部' : CATEGORY_LABELS[type]}
          </button>
        ))}
        <button
          onClick={() => setFavoriteOnly(!favoriteOnly)}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ml-auto flex items-center gap-2',
            favoriteOnly
              ? 'bg-rose-500/30 text-rose-400 border border-rose-500/50'
              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
          )}
        >
          <Star size={16} fill={favoriteOnly ? 'currentColor' : 'none'} />
          收藏
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-white/10" />

        {Object.entries(groupedMemories).map(([date, dayMemories]) => (
          <div key={date} className="mb-8">
            {/* Date Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center z-10">
                <span className="text-amber-400 font-bold text-sm">
                  {new Date(date).toLocaleDateString('zh-CN', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="text-white/50 text-sm">
                {new Date(date).toLocaleDateString('zh-CN', {
                  weekday: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>

            {/* Memories for this date */}
            <div className="ml-6 md:ml-8 pl-6 md:pl-8 border-l-2 border-transparent space-y-4">
              {dayMemories.map((memory) => (
                <GlassCard
                  key={memory.id}
                  variant="hover"
                  className={cn('relative', memory.isFavorite && 'border-l-4 border-l-rose-500')}
                >
                  {/* Event dot */}
                  <div className="absolute -left-[2.5rem] md:-left-[3rem] top-6 w-4 h-4 rounded-full bg-white/20 border-2 border-white/40" />

                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        CATEGORY_COLORS[memory.category]
                      )}
                    >
                      <span className="text-2xl">{memory.thumbnail || '📝'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-white">{memory.title}</h3>
                        {memory.isFavorite && <span className="text-rose-400">❤️</span>}
                        {memory.isNew && (
                          <GlassBadge variant="warning">新</GlassBadge>
                        )}
                        <GlassBadge className={CATEGORY_COLORS[memory.category]}>
                          {CATEGORY_LABELS[memory.category]}
                        </GlassBadge>
                      </div>
                      <p className="text-sm text-white/70 mb-2 line-clamp-2">
                        {memory.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                        {memory.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {memory.location}
                          </span>
                        )}
                        {memory.characterName && (
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {memory.characterName}
                          </span>
                        )}
                        <button
                          onClick={() => toggleFavorite(memory.id)}
                          className={cn(
                            'ml-auto flex items-center gap-1 transition-colors',
                            memory.isFavorite ? 'text-rose-400' : 'hover:text-rose-400'
                          )}
                        >
                          <Heart size={12} fill={memory.isFavorite ? 'currentColor' : 'none'} />
                          {memory.isFavorite ? '已收藏' : '收藏'}
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredMemories.length === 0 && (
        <GlassCard className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-white/60">没有找到符合条件的回忆</p>
        </GlassCard>
      )}
    </GlassContainer>
  );
}
