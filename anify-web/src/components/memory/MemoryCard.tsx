import { Heart, MapPin, User } from 'lucide-react';

import { GlassCard, GlassBadge } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import type { Memory, MemoryCategory } from '@/types';

interface MemoryCardProps {
  memory: Memory;
  onFavorite: (memoryId: string) => void;
  onClick: (memory: Memory) => void;
}

const CATEGORY_LABELS: Record<MemoryCategory, string> = {
  conversation: '对话',
  adventure: '冒险',
  achievement: '成就',
  special: '特殊',
};

const CATEGORY_COLORS: Record<MemoryCategory, 'warning' | 'info' | 'success' | 'default'> = {
  conversation: 'info',
  adventure: 'warning',
  achievement: 'success',
  special: 'default',
};

export function MemoryCard({ memory, onFavorite, onClick }: MemoryCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite(memory.id);
  };

  return (
    <GlassCard
      variant="hover"
      className={cn('cursor-pointer relative', memory.isNew && 'ring-2 ring-amber-500/50')}
      onClick={() => onClick(memory)}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-black/30 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
        {memory.thumbnail ? (
          <span className="text-5xl">{memory.thumbnail}</span>
        ) : (
          <span className="text-4xl text-white/20">📷</span>
        )}

        {/* New badge */}
        {memory.isNew && (
          <div className="absolute top-2 left-2">
            <GlassBadge variant="warning">新</GlassBadge>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2 right-2">
          <GlassBadge variant={CATEGORY_COLORS[memory.category]}>
            {CATEGORY_LABELS[memory.category]}
          </GlassBadge>
        </div>
      </div>

      {/* Title */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-white truncate flex-1">{memory.title}</h3>
        <button
          onClick={handleFavoriteClick}
          className={cn(
            'p-1.5 rounded-lg transition-all flex-shrink-0',
            memory.isFavorite
              ? 'bg-rose-500/20 text-rose-400'
              : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
          )}
        >
          <Heart size={16} fill={memory.isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-white/60 line-clamp-2 mb-3">{memory.description}</p>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
        {memory.characterName && (
          <span className="flex items-center gap-1">
            <User size={12} />
            {memory.characterName}
          </span>
        )}
        {memory.location && (
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {memory.location}
          </span>
        )}
        <span className="ml-auto">
          {memory.timestamp.toLocaleDateString('zh-CN')}
        </span>
      </div>
    </GlassCard>
  );
}
