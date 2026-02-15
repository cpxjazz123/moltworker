import { useState } from 'react';

import { GlassButton, GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { useWorldShop } from '@/contexts/WorldContext';
import type { ShopItem } from '@/types/world-metadata';

interface CartItem {
  item: ShopItem;
  quantity: number;
}



type CategoryType = 'all' | 'consumable' | 'equipment' | 'material' | 'special';

const CATEGORIES: { id: CategoryType; name: string }[] = [
  { id: 'all', name: '全部' },
  { id: 'consumable', name: '消耗品' },
  { id: 'equipment', name: '装备' },
  { id: 'material', name: '材料' },
  { id: 'special', name: '特殊' },
];

const RARITY_COLORS: Record<ShopItem['rarity'], string> = {
  common: 'border-gray-500/50 bg-gray-500/10',
  rare: 'border-blue-500/50 bg-blue-500/10',
  epic: 'border-purple-500/50 bg-purple-500/10',
  legendary: 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_8px_rgba(255,215,0,0.15)]',
};

const RARITY_TEXT_COLORS: Record<ShopItem['rarity'], string> = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-amber-400',
};

const CURRENCY_ICONS: Record<ShopItem['currency'], string> = {
  gold: '🪙',
  gem: '💎',
  token: '🎟️',
};

export function ShopPanel() {
  const items = useWorldShop();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currencies] = useState({ gold: 15000, gem: 120, token: 50 });

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const calculatePrice = (item: ShopItem) => {
    if (item.discount) {
      return Math.floor(item.price * (1 - item.discount / 100));
    }
    return item.price;
  };

  const addToCart = (item: ShopItem) => {
    if (item.stock !== undefined && item.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      const maxQty = item.stock ?? 99;
      if (existing) {
        if (existing.quantity >= maxQty) return prev;
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((c) =>
          c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prev.filter((c) => c.item.id !== itemId);
    });
  };

  const cartTotals = cart.reduce(
    (acc, c) => {
      const price = calculatePrice(c.item) * c.quantity;
      acc[c.item.currency] = (acc[c.item.currency] || 0) + price;
      return acc;
    },
    {} as Record<string, number>
  );

  const canAfford = Object.entries(cartTotals).every(
    ([currency, amount]) => currencies[currency as keyof typeof currencies] >= amount
  );

  const handlePurchase = () => {
    if (!canAfford || cart.length === 0) return;
    setCart([]);
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col gap-4 max-h-[80vh]">
      {/* Currencies */}
      <div className="flex items-center gap-3 text-sm justify-end">
        <span className="flex items-center gap-1">
          <span>🪙</span>
          <span className="text-amber-400 font-medium">{currencies.gold.toLocaleString()}</span>
        </span>
        <span className="flex items-center gap-1">
          <span>💎</span>
          <span className="text-cyan-400 font-medium">{currencies.gem}</span>
        </span>
        <span className="flex items-center gap-1">
          <span>🎟️</span>
          <span className="text-pink-400 font-medium">{currencies.token}</span>
        </span>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              selectedCategory === cat.id
                ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            )}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[200px] pr-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                'p-2 rounded-xl border cursor-pointer transition-all relative',
                RARITY_COLORS[item.rarity],
                selectedItem?.id === item.id && 'ring-2 ring-amber-400'
              )}
              onClick={() => setSelectedItem(item)}
            >
              {/* Badges */}
              <div className="absolute top-1 right-1 flex flex-col gap-0.5">
                {item.new && (
                  <span className="px-1 py-0 bg-green-500 text-white text-[8px] rounded">
                    NEW
                  </span>
                )}
                {item.hot && (
                  <span className="px-1 py-0 bg-red-500 text-white text-[8px] rounded">
                    HOT
                  </span>
                )}
                {item.discount && (
                  <span className="px-1 py-0 bg-amber-500 text-black text-[8px] rounded">
                    -{item.discount}%
                  </span>
                )}
              </div>

              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-1 rounded-lg bg-black/30 flex items-center justify-center">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <p className={cn('text-xs font-medium truncate', RARITY_TEXT_COLORS[item.rarity])}>
                  {item.name}
                </p>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <span className="text-sm">{CURRENCY_ICONS[item.currency]}</span>
                  {item.discount ? (
                    <>
                      <span className="text-white/40 line-through text-[10px]">{item.price}</span>
                      <span className="text-amber-400 font-bold text-xs">{calculatePrice(item)}</span>
                    </>
                  ) : (
                    <span className="text-amber-400 font-bold text-xs">{item.price}</span>
                  )}
                </div>
                {item.stock !== undefined && (
                  <p className="text-[10px] text-white/40">库存: {item.stock}</p>
                )}
              </div>
            </div>
          ))}
        </div>

      {/* Selected Item Detail */}
      {selectedItem && (
        <GlassCard size="sm" variant="glow" className={RARITY_COLORS[selectedItem.rarity]}>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-black/30 flex items-center justify-center border border-white/10">
              <span className="text-2xl">{selectedItem.icon}</span>
            </div>
            <div className="flex-1">
              <h4 className={cn('font-bold', RARITY_TEXT_COLORS[selectedItem.rarity])}>
                {selectedItem.name}
              </h4>
              <p className="text-white/60 text-xs mt-0.5">{selectedItem.description}</p>
            </div>
            <GlassButton size="sm" variant="primary" onClick={() => addToCart(selectedItem)}>
              加入购物车
            </GlassButton>
          </div>
        </GlassCard>
      )}

      {/* Cart */}
      {cart.length > 0 && (
        <GlassCard className="border-white/20" size="sm" variant="dark">
          <div className="flex flex-col gap-2">
            <h3 className="text-white font-medium text-sm">购物车</h3>
            <div className="flex flex-col gap-1 max-h-[80px] overflow-y-auto">
              {cart.map((cartItem) => (
                <div key={cartItem.item.id} className="flex items-center justify-between text-xs">
                  <span className="text-white/80">
                    {cartItem.item.icon} {cartItem.item.name} x{cartItem.quantity}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">
                      {CURRENCY_ICONS[cartItem.item.currency]}{' '}
                      {calculatePrice(cartItem.item) * cartItem.quantity}
                    </span>
                    <button
                      className="text-red-400 hover:text-red-300 text-xs"
                      onClick={() => removeFromCart(cartItem.item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex flex-col gap-0.5">
                {Object.entries(cartTotals).map(([currency, amount]) => (
                  <span
                    key={currency}
                    className={cn('text-xs', canAfford ? 'text-white/80' : 'text-red-400')}
                  >
                    {CURRENCY_ICONS[currency as keyof typeof CURRENCY_ICONS]} {amount}
                  </span>
                ))}
              </div>
              <GlassButton
                disabled={!canAfford}
                size="sm"
                variant={canAfford ? 'primary' : 'secondary'}
                onClick={handlePurchase}
              >
                购买
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      )}

    </div>
  );
}
