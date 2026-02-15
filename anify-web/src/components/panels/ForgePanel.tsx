import { useState } from 'react';

import { GlassBadge, GlassButton, GlassCard, GlassProgressBar } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { useWorldMinting } from '@/contexts/WorldContext';
import type { CraftingRecipe } from '@/types/world-metadata';

interface CraftingQueue {
  recipe: CraftingRecipe;
  progress: number;
}



type Recipe = CraftingRecipe;

type FilterType = 'all' | 'weapon' | 'armor' | 'accessory' | 'consumable';

const FILTER_LABELS: Record<FilterType, string> = {
  all: '全部',
  weapon: '武器',
  armor: '防具',
  accessory: '饰品',
  consumable: '消耗品',
};

const TYPE_ICONS: Record<string, string> = {
  weapon: '⚔️',
  armor: '🛡️',
  accessory: '💍',
  consumable: '🧪',
};

const RARITY_COLORS: Record<Recipe['rarity'], string> = {
  common: 'border-gray-500/50 bg-gray-500/10',
  rare: 'border-blue-500/50 bg-blue-500/10',
  epic: 'border-purple-500/50 bg-purple-500/10',
  legendary: 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_10px_rgba(255,215,0,0.15)]',
};

const RARITY_TEXT_COLORS: Record<Recipe['rarity'], string> = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-amber-400',
};

const RARITY_LABELS: Record<Recipe['rarity'], string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

export function ForgePanel() {
  const recipes = useWorldMinting();

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedType, setSelectedType] = useState<FilterType>('all');
  const [craftingQueue, setCraftingQueue] = useState<CraftingQueue[]>([]);
  const [isForging, setIsForging] = useState(false);

  const filteredRecipes = recipes.filter(
    (recipe) => selectedType === 'all' || recipe.type === selectedType
  );

  const canCraft = (recipe: Recipe) => {
    return recipe.materials.every((m) => m.owned >= m.required);
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
    return `${Math.floor(seconds / 3600)}时${Math.floor((seconds % 3600) / 60)}分`;
  };

  const handleCraft = () => {
    if (!selectedRecipe || !canCraft(selectedRecipe)) return;

    setIsForging(true);
    setTimeout(() => {
      setCraftingQueue([...craftingQueue, { recipe: selectedRecipe, progress: 0 }]);
      setIsForging(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-4 max-h-[80vh]">
      {/* Crafting Queue */}
      {craftingQueue.length > 0 && (
        <GlassCard variant="glow" size="sm" className="border-orange-500/30">
          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <span>🔥</span> 制作队列
          </h3>
          <div className="space-y-2">
            {craftingQueue.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-black/20 rounded-lg p-2">
                <span className="text-xl">{item.recipe.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={cn('text-sm font-medium', RARITY_TEXT_COLORS[item.recipe.rarity])}>
                      {item.recipe.name}
                    </span>
                    <span className="text-white/60 text-xs">{item.progress}%</span>
                  </div>
                  <GlassProgressBar value={item.progress} max={100} size="sm" showLabel={false} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(FILTER_LABELS) as FilterType[]).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={cn(
              'px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1',
              selectedType === type
                ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            )}
          >
            {type !== 'all' && <span>{TYPE_ICONS[type]}</span>}
            <span>{FILTER_LABELS[type]}</span>
          </button>
        ))}
      </div>

      {/* Recipe List */}
      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className={cn(
                'flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-all',
                RARITY_COLORS[recipe.rarity],
                selectedRecipe?.id === recipe.id && 'ring-1 ring-amber-400',
                !canCraft(recipe) && 'opacity-60'
              )}
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center">
                <span className="text-xl">{recipe.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn('text-sm font-semibold', RARITY_TEXT_COLORS[recipe.rarity])}>
                    {recipe.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/50">
                  <span>{TYPE_ICONS[recipe.type]}</span>
                  <span>⏱️ {formatTime(recipe.craftTime)}</span>
                </div>
              </div>
              {canCraft(recipe) ? (
                <span className="text-green-400 text-sm">✓</span>
              ) : (
                <span className="text-red-400 text-sm">✗</span>
              )}
            </div>
          ))}
        </div>

      {/* Recipe Details */}
      {selectedRecipe ? (
        <GlassCard variant="glow" size="sm" className={RARITY_COLORS[selectedRecipe.rarity]}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-black/30 flex items-center justify-center border border-white/10">
              <span className="text-2xl">{selectedRecipe.icon}</span>
            </div>
            <div className="flex-1">
              <h4 className={cn('font-bold', RARITY_TEXT_COLORS[selectedRecipe.rarity])}>
                {selectedRecipe.name}
              </h4>
              <div className="flex items-center gap-1 mt-0.5">
                <GlassBadge className={cn('text-[10px] px-1.5 py-0', RARITY_COLORS[selectedRecipe.rarity])}>
                  {RARITY_LABELS[selectedRecipe.rarity]}
                </GlassBadge>
                <GlassBadge className="text-[10px] px-1.5 py-0">
                  ⏱️ {formatTime(selectedRecipe.craftTime)}
                </GlassBadge>
              </div>
            </div>
          </div>

          <p className="text-white/60 text-xs mb-3">{selectedRecipe.description}</p>

          {/* Stats */}
          {selectedRecipe.stats && (
            <div className="mb-3">
              <h5 className="text-[10px] font-semibold text-white/50 mb-1">属性</h5>
              <div className="flex flex-wrap gap-2">
                {selectedRecipe.stats.map((stat, idx) => (
                  <div key={idx} className="bg-black/20 rounded-lg px-2 py-1 text-xs">
                    <span className="text-white/50">{stat.name}</span>{' '}
                    <span className="text-green-400 font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Materials */}
          <div className="mb-3">
            <h5 className="text-[10px] font-semibold text-white/50 mb-1">所需材料</h5>
            <div className="flex flex-wrap gap-2">
              {selectedRecipe.materials.map((material) => (
                <div
                  key={material.id}
                  className={cn(
                    'bg-black/20 rounded-lg px-2 py-1 text-xs border',
                    material.owned >= material.required
                      ? 'border-green-500/30'
                      : 'border-red-500/30'
                  )}
                >
                  <span>{material.icon}</span>{' '}
                  <span className="text-white/70">{material.name}</span>{' '}
                  <span
                    className={cn(
                      'font-medium',
                      material.owned >= material.required ? 'text-green-400' : 'text-red-400'
                    )}
                  >
                    {material.owned}/{material.required}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Forge Button */}
          <GlassButton
            variant="primary"
            className="w-full text-sm"
            onClick={handleCraft}
            disabled={!canCraft(selectedRecipe) || isForging}
          >
            {isForging ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">🔥</span>
                制作中...
              </span>
            ) : canCraft(selectedRecipe) ? (
              '🔨 开始制作'
            ) : (
              '材料不足'
            )}
          </GlassButton>
        </GlassCard>
      ) : (
        <GlassCard className="text-center py-6">
          <span className="text-3xl mb-2 block">🔨</span>
          <p className="text-white/60 text-sm">选择一个配方查看详情</p>
        </GlassCard>
      )}

    </div>
  );
}
