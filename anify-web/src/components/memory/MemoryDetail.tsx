import { X, Heart, Share2, MapPin, User, Calendar } from 'lucide-react';

import { GlassCard, GlassBadge } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import type { Memory, MemoryCategory } from '@/types';

interface MemoryDetailProps {
  memory: Memory;
  onClose: () => void;
  onFavorite: (memoryId: string) => void;
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

export function MemoryDetail({ memory, onClose, onFavorite }: MemoryDetailProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: memory.title,
        text: memory.description,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <GlassCard
        variant="glow"
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thumbnail */}
        <div className="aspect-video bg-black/30 rounded-xl mb-6 flex items-center justify-center">
          {memory.thumbnail ? (
            <span className="text-8xl">{memory.thumbnail}</span>
          ) : (
            <span className="text-6xl text-white/20">📷</span>
          )}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{memory.title}</h2>
            <div className="flex items-center gap-2">
              <GlassBadge variant={CATEGORY_COLORS[memory.category]}>
                {CATEGORY_LABELS[memory.category]}
              </GlassBadge>
              {memory.isNew && <GlassBadge variant="warning">新</GlassBadge>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onFavorite(memory.id)}
              className={cn(
                'p-2 rounded-lg transition-all',
                memory.isFavorite
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
              )}
            >
              <Heart size={20} fill={memory.isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 rounded-lg transition-all"
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} className="text-white/70" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/80 mb-6 leading-relaxed">{memory.description}</p>

        {/* Content */}
        {memory.content && (
          <div className="bg-black/20 rounded-xl p-4 mb-6">
            <p className="text-white/70 whitespace-pre-wrap">{memory.content}</p>
          </div>
        )}

        {/* Meta info */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="flex flex-wrap gap-4 text-sm text-white/60">
            {memory.characterName && (
              <span className="flex items-center gap-2">
                <User size={16} />
                {memory.characterName}
              </span>
            )}
            {memory.location && (
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                {memory.location}
              </span>
            )}
            <span className="flex items-center gap-2 ml-auto">
              <Calendar size={16} />
              {memory.timestamp.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
