import { useState } from 'react';

import { GlassCard, GlassBadge, GlassButton } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'consumable' | 'material' | 'quest' | 'treasure' | 'currency';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  quantity: number;
  stackable: boolean;
  usable: boolean;
  sellPrice?: number;
}

const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    name: '生命药水',
    description: '立即恢复500点HP',
    icon: '🧪',
    type: 'consumable',
    rarity: 'common',
    quantity: 25,
    stackable: true,
    usable: true,
    sellPrice: 50,
  },
  {
    id: '2',
    name: '魔力药水',
    description: '立即恢复300点MP',
    icon: '💧',
    type: 'consumable',
    rarity: 'common',
    quantity: 18,
    stackable: true,
    usable: true,
    sellPrice: 75,
  },
  {
    id: '3',
    name: '龙鳞',
    description: '来自远古巨龙的稀有鳞片，可用于制作传说级装备',
    icon: '🐉',
    type: 'material',
    rarity: 'legendary',
    quantity: 3,
    stackable: true,
    usable: false,
    sellPrice: 5000,
  },
  {
    id: '4',
    name: '铁矿石',
    description: '常见的矿石，用于制作基础装备',
    icon: '⛏️',
    type: 'material',
    rarity: 'common',
    quantity: 47,
    stackable: true,
    usable: false,
    sellPrice: 10,
  },
  {
    id: '5',
    name: '远古神器碎片',
    description: '传说神器的碎片，任务道具',
    icon: '🔮',
    type: 'quest',
    rarity: 'epic',
    quantity: 1,
    stackable: false,
    usable: false,
  },
  {
    id: '6',
    name: '凤凰羽毛',
    description: '可以复活倒下队友的神奇羽毛',
    icon: '🪶',
    type: 'consumable',
    rarity: 'epic',
    quantity: 2,
    stackable: true,
    usable: true,
    sellPrice: 1000,
  },
  {
    id: '7',
    name: '金币',
    description: '王国通用货币',
    icon: '🪙',
    type: 'currency',
    rarity: 'common',
    quantity: 12500,
    stackable: true,
    usable: false,
  },
  {
    id: '8',
    name: '魔力水晶',
    description: '蕴含魔法能量的稀有水晶，用于强化装备',
    icon: '💎',
    type: 'material',
    rarity: 'rare',
    quantity: 15,
    stackable: true,
    usable: false,
    sellPrice: 200,
  },
  {
    id: '9',
    name: '藏宝图',
    description: '标记了黑暗森林中宝藏位置的地图',
    icon: '🗺️',
    type: 'treasure',
    rarity: 'rare',
    quantity: 1,
    stackable: false,
    usable: true,
  },
  {
    id: '10',
    name: '力量圣水',
    description: '使用后永久提升5点攻击力',
    icon: '💪',
    type: 'consumable',
    rarity: 'legendary',
    quantity: 1,
    stackable: false,
    usable: true,
    sellPrice: 10000,
  },
];

type FilterType = 'all' | 'consumable' | 'material' | 'quest' | 'treasure' | 'currency';
type SortType = 'type' | 'rarity' | 'quantity' | 'name';

const FILTER_LABELS: Record<FilterType, string> = {
  all: '全部',
  consumable: '消耗品',
  material: '材料',
  quest: '任务',
  treasure: '宝物',
  currency: '货币',
};

const SORT_LABELS: Record<SortType, string> = {
  type: '按类型',
  rarity: '按稀有度',
  quantity: '按数量',
  name: '按名称',
};

const TYPE_COLORS: Record<Item['type'], string> = {
  consumable: 'bg-green-500/20 text-green-400 border-green-500/30',
  material: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  quest: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  treasure: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  currency: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const TYPE_LABELS: Record<Item['type'], string> = {
  consumable: '消耗品',
  material: '材料',
  quest: '任务',
  treasure: '宝物',
  currency: '货币',
};

const RARITY_COLORS: Record<Item['rarity'], string> = {
  common: 'border-gray-500/30',
  rare: 'border-blue-500/50',
  epic: 'border-purple-500/50',
  legendary: 'border-amber-500/50 shadow-[0_0_8px_rgba(255,215,0,0.15)]',
};

const RARITY_TEXT_COLORS: Record<Item['rarity'], string> = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-amber-400',
};

const RARITY_LABELS: Record<Item['rarity'], string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

export function ItemsTab() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('type');

  const filteredItems = MOCK_ITEMS.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  }).sort((a, b) => {
    if (sortBy === 'type') return a.type.localeCompare(b.type);
    if (sortBy === 'rarity') {
      const order = ['legendary', 'epic', 'rare', 'common'];
      return order.indexOf(a.rarity) - order.indexOf(b.rarity);
    }
    if (sortBy === 'quantity') return b.quantity - a.quantity;
    return a.name.localeCompare(b.name);
  });

  const gold = MOCK_ITEMS.find((i) => i.type === 'currency')?.quantity || 0;

  return (
    <div className="space-y-4">
      {/* Gold Display */}
      <GlassCard size="sm" variant="glow" className="flex items-center gap-3 py-2">
        <span className="text-2xl">🪙</span>
        <div>
          <div className="text-lg font-bold text-amber-400">{gold.toLocaleString()}</div>
          <div className="text-xs text-white/60">金币</div>
        </div>
      </GlassCard>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(FILTER_LABELS) as FilterType[]).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
              filter === type
                ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            )}
          >
            {FILTER_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortType)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm"
      >
        {(Object.keys(SORT_LABELS) as SortType[]).map((sort) => (
          <option key={sort} value={sort}>
            {SORT_LABELS[sort]}
          </option>
        ))}
      </select>

      {/* Items Grid */}
      <div className="grid grid-cols-5 gap-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              'relative aspect-square rounded-xl bg-white/5 border flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all p-1',
              RARITY_COLORS[item.rarity],
              selectedItem?.id === item.id && 'ring-2 ring-amber-400'
            )}
            onClick={() => setSelectedItem(item)}
          >
            <span className="text-xl">{item.icon}</span>
            {item.stackable && item.quantity > 1 && (
              <span className="absolute bottom-0.5 right-0.5 text-[10px] text-white/70 bg-black/40 px-1 rounded">
                x{item.quantity > 999 ? '999+' : item.quantity}
              </span>
            )}
          </div>
        ))}
        {/* Empty slots */}
        {Array.from({ length: Math.max(0, 10 - filteredItems.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square rounded-xl bg-white/5 border border-white/10 border-dashed"
          />
        ))}
      </div>

      {/* Item Details */}
      {selectedItem ? (
        <GlassCard variant="glow" size="sm" className={RARITY_COLORS[selectedItem.rarity]}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-14 h-14 rounded-xl bg-black/30 flex items-center justify-center border border-white/10">
              <span className="text-3xl">{selectedItem.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className={cn('text-lg font-bold', RARITY_TEXT_COLORS[selectedItem.rarity])}>
                {selectedItem.name}
              </h3>
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                <GlassBadge className={cn('text-xs', TYPE_COLORS[selectedItem.type])}>
                  {TYPE_LABELS[selectedItem.type]}
                </GlassBadge>
                <GlassBadge
                  className={cn('text-xs', RARITY_TEXT_COLORS[selectedItem.rarity])}
                >
                  {RARITY_LABELS[selectedItem.rarity]}
                </GlassBadge>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/70 mb-3">{selectedItem.description}</p>

          <div className="space-y-2 mb-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-white/60">数量</span>
              <span className="text-white">{selectedItem.quantity}</span>
            </div>
            {selectedItem.sellPrice && (
              <div className="flex justify-between items-center">
                <span className="text-white/60">售价</span>
                <span className="text-amber-400">{selectedItem.sellPrice} 🪙</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {selectedItem.usable && (
              <GlassButton variant="primary" className="flex-1 text-sm">
                使用
              </GlassButton>
            )}
            {selectedItem.sellPrice && selectedItem.type !== 'quest' && (
              <GlassButton variant="secondary" className="flex-1 text-sm">
                出售
              </GlassButton>
            )}
            {selectedItem.type !== 'quest' && selectedItem.type !== 'currency' && (
              <GlassButton variant="ghost" className="text-sm">
                丢弃
              </GlassButton>
            )}
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="text-center py-6">
          <div className="text-3xl mb-2">📦</div>
          <p className="text-white/60 text-sm">选择一个物品查看详情</p>
        </GlassCard>
      )}
    </div>
  );
}
