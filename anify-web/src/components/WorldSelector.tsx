// src/components/WorldSelector.tsx

import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Lock, Check } from 'lucide-react';

import { useWorlds } from '@/hooks/useWorlds';
import { useWorld } from '@/contexts/WorldContext';
import { cn } from '@/lib/utils';

interface WorldSelectorProps {
  onSelect?: (worldId: string) => void;
  className?: string;
}

const TYPE_LABELS: Record<string, string> = {
  tutorial: '教程',
  campaign: '战役',
  sandbox: '沙盒',
};

const TYPE_COLORS: Record<string, string> = {
  tutorial: 'bg-green-500/20 text-green-400 border-green-500/30',
  campaign: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  sandbox: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export function WorldSelector({ onSelect, className }: WorldSelectorProps) {
  const { worlds, loading, currentWorld } = useWorlds();
  const { loadWorld, isLoading: worldLoading } = useWorld();

  const handleSelect = async (worldId: string) => {
    await loadWorld(worldId);
    onSelect?.(worldId);
  };

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <Loader2 className="w-6 h-6 animate-spin text-white/60" />
        <span className="ml-2 text-white/60">Loading worlds...</span>
      </div>
    );
  }

  if (worlds.length === 0) {
    return (
      <div className={cn('text-center py-8 text-white/50', className)}>
        No worlds available
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-lg font-bold text-white">Select World</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {worlds.map((world, index) => (
            <motion.button
              key={world.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'relative p-4 rounded-2xl border text-left transition-all duration-300',
                'backdrop-blur-xl',
                currentWorld?.id === world.id
                  ? 'border-white/30 bg-white/10 ring-2 ring-white/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10',
                !world.available && 'opacity-60 cursor-not-allowed',
                world.available && 'cursor-pointer hover:scale-[1.02]'
              )}
              onClick={() => world.available && handleSelect(world.id)}
              disabled={!world.available || worldLoading}
            >
              {/* Type badge */}
              <div
                className={cn(
                  'absolute top-3 right-3 px-2 py-0.5 text-xs rounded-full border',
                  TYPE_COLORS[world.type] || 'bg-gray-500/20 text-gray-400'
                )}
              >
                {TYPE_LABELS[world.type] || world.type}
              </div>

              {/* Active indicator */}
              {currentWorld?.id === world.id && (
                <div className="absolute top-3 left-3">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
              )}

              {/* Image or placeholder */}
              <div className="w-full h-24 rounded-xl mb-3 overflow-hidden bg-gradient-to-br from-purple-900/30 to-blue-900/30">
                {world.image ? (
                  <img
                    src={world.image}
                    alt={world.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl opacity-50">
                    🌍
                  </div>
                )}
              </div>

              {/* Content */}
              <h3 className="text-base font-bold text-white mb-1 truncate pr-16">
                {world.name}
              </h3>

              <p className="text-sm text-white/60 line-clamp-2 min-h-[2.5rem]">
                {world.description}
              </p>

              {/* Locked state */}
              {!world.available && (
                <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
                  <Lock className="w-3 h-3" />
                  <span>
                    {world.requirements.completedWorlds.length > 0
                      ? `Complete: ${world.requirements.completedWorlds.join(', ')}`
                      : `Requires level ${world.requirements.minLevel}`}
                  </span>
                </div>
              )}

              {/* Loading overlay */}
              {worldLoading && currentWorld?.id !== world.id && (
                <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-white/60" />
                </div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default WorldSelector;
