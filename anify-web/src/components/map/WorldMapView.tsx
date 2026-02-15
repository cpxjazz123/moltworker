import { Globe, Loader2 } from 'lucide-react';

import { GlassCard } from '@/components/ui/glass-card';
import type { World } from '@/types';

interface WorldMapViewProps {
  worlds: World[];
  onSelectWorld: (worldId: string) => void;
  loadingWorldId?: string | null;
}

export function WorldMapView({ worlds, onSelectWorld, loadingWorldId }: WorldMapViewProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">选择世界</h2>
      <div className="grid grid-cols-2 gap-4">
        {worlds.map((world) => {
          const isLoading = loadingWorldId === world.id;
          const isDisabled = !world.unlocked || !!loadingWorldId;

          return (
            <GlassCard
              key={world.id}
              variant={world.unlocked ? 'hover' : 'dark'}
              size="md"
              className={`cursor-pointer ${isDisabled ? 'opacity-50' : ''}`}
              onClick={() => !isDisabled && onSelectWorld(world.id)}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 text-white/70 animate-spin" />
                  ) : (
                    <Globe className="w-8 h-8 text-white/70" />
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">{world.name}</h3>
                  <p className="text-sm text-white/60 mt-1 line-clamp-2">
                    {world.description}
                  </p>
                </div>
                {!world.unlocked && (
                  <span className="text-xs text-white/40">未解锁</span>
                )}
                {isLoading && (
                  <span className="text-xs text-amber-400">加载中...</span>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
