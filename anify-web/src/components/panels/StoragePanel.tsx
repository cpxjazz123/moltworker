import { useState } from 'react';

import { GlassBadge, GlassButton, GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface StorageItem {
  id: string;
  name: string;
  quantity: number;
  category: 'weapon' | 'armor' | 'consumable' | 'material' | 'misc';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
}

const MOCK_STORAGE: StorageItem[] = [
  { id: '1', name: '铁矿石', quantity: 25, category: 'material', rarity: 'common' },
  { id: '2', name: '草药', quantity: 15, category: 'consumable', rarity: 'common' },
  { id: '3', name: '旧长剑', quantity: 1, category: 'weapon', rarity: 'common' },
  { id: '4', name: '魔晶石', quantity: 5, category: 'material', rarity: 'uncommon' },
  { id: '5', name: '破旧的地图', quantity: 1, category: 'misc', rarity: 'uncommon' },
  { id: '6', name: '皮革护甲', quantity: 1, category: 'armor', rarity: 'common' },
];

const CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'weapon', name: '武器' },
  { id: 'armor', name: '防具' },
  { id: 'consumable', name: '消耗品' },
  { id: 'material', name: '素材' },
  { id: 'misc', name: '杂物' },
] as const;

const RARITY_COLORS = {
  common: 'text-gray-300 border-gray-500/30',
  uncommon: 'text-green-400 border-green-500/30',
  rare: 'text-blue-400 border-blue-500/30',
  epic: 'text-purple-400 border-purple-500/30',
};

export function StoragePanel() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? MOCK_STORAGE
    : MOCK_STORAGE.filter((item) => item.category === selectedCategory);

  const totalItems = MOCK_STORAGE.reduce((sum, item) => sum + item.quantity, 0);
  const maxStorage = 100;

  const handleTakeItem = () => {
    if (!selectedItem) return;
    // TODO: Implement take item logic
    console.log('Take item:', selectedItem.id);
    setSelectedItem(null);
  };

  const handleTakeAll = () => {
    // TODO: Implement take all logic
    console.log('Take all items');
  };

  return (
    <div className="flex flex-col gap-4 max-h-[80vh]">
      {/* Storage capacity */}
      <div className="flex justify-end">
        <GlassBadge variant="default">{totalItems} / {maxStorage}</GlassBadge>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              selectedCategory === cat.id
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            )}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Storage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Item List */}
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
          {filteredItems.map((item) => (
            <GlassCard
              key={item.id}
              className={cn(
                'cursor-pointer transition-all',
                selectedItem?.id === item.id
                  ? 'border-white/40 bg-white/15'
                  : 'hover:bg-white/10'
              )}
              size="sm"
              variant="hover"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-center justify-between">
                <span className={cn('font-medium', RARITY_COLORS[item.rarity].split(' ')[0])}>
                  {item.name}
                </span>
                <span className="text-white/60 text-sm">x{item.quantity}</span>
              </div>
            </GlassCard>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center text-white/40 py-8">
              此分类暂无物品
            </div>
          )}
        </div>

        {/* Item Detail */}
        <GlassCard className="flex flex-col gap-3" size="md" variant="dark">
          {selectedItem ? (
            <>
              <div className="text-center">
                <h3 className={cn('text-lg font-bold', RARITY_COLORS[selectedItem.rarity].split(' ')[0])}>
                  {selectedItem.name}
                </h3>
                <p className="text-white/60 text-sm">
                  数量: {selectedItem.quantity}
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <GlassButton variant="primary" onClick={handleTakeItem}>
                  取出 1 个
                </GlassButton>
                {selectedItem.quantity > 1 && (
                  <GlassButton variant="secondary" onClick={handleTakeAll}>
                    全部取出
                  </GlassButton>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-white/40">
              选择物品查看详情
            </div>
          )}
        </GlassCard>
      </div>

    </div>
  );
}
