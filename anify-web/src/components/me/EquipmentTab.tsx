import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { GlassCard } from '@/components/ui/glass-card';
import { useEquipment, type EquipmentInfo } from '@/hooks/useEquipment';
import { cn } from '@/lib/utils';

const SLOT_ORDER = ['weapon', 'helm', 'armor', 'gloves', 'boots', 'accessory'] as const;

const SLOT_LABELS: Record<string, string> = {
  weapon: '武器',
  armor: '护甲',
  accessory: '配件',
  helm: '头盔',
  boots: '靴子',
  gloves: '手套',
};

const RARITY_COLORS: Record<string, string> = {
  common: 'border-gray-500/50 bg-gray-500/10',
  rare: 'border-blue-500/50 bg-blue-500/10',
  epic: 'border-purple-500/50 bg-purple-500/10',
  legendary: 'border-white/50 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.15)]',
};

const RARITY_TEXT_COLORS: Record<string, string> = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-white',
};

interface EquipmentDetailModalProps {
  item: EquipmentInfo;
  onClose: () => void;
}

function EquipmentDetailModal({ item, onClose }: EquipmentDetailModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={cn(
          'w-full max-w-sm p-4 rounded-2xl border backdrop-blur-xl',
          RARITY_COLORS[item.rarity]
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-black/30 flex items-center justify-center text-3xl">
            {item.icon}
          </div>
          <div className="flex-1">
            <h3 className={cn('text-lg font-bold', RARITY_TEXT_COLORS[item.rarity])}>
              {item.name}
            </h3>
            <p className="text-white/50 text-sm">{SLOT_LABELS[item.type]} · Lv.{item.level}</p>
          </div>
        </div>

        <p className="text-white/70 text-sm mb-4">{item.description}</p>

        <div className="space-y-2 mb-4">
          <h4 className="text-xs text-white/50 uppercase">属性加成</h4>
          <div className="grid grid-cols-2 gap-2">
            {item.stats.map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-white/70 text-sm">{stat.name}</span>
                <span className="text-green-400 text-sm font-medium">+{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="w-full py-2 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
          onClick={onClose}
        >
          关闭
        </button>
      </motion.div>
    </motion.div>
  );
}

export function EquipmentTab() {
  const { equipment, starterKit, loading } = useEquipment();
  const [selectedItem, setSelectedItem] = useState<EquipmentInfo | null>(null);

  // Use starterKit (equipped items) if available, otherwise fall back to all equipment
  const equippedItems = starterKit.length > 0 ? starterKit : equipment;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-white/50">
        Loading equipment...
      </div>
    );
  }

  const totalStats = equippedItems.reduce(
    (acc, item) => {
      item.stats.forEach((stat) => {
        acc[stat.name] = (acc[stat.name] || 0) + stat.value;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-4">
      {/* Equipment Grid */}
      <div className="grid grid-cols-2 gap-3">
        {SLOT_ORDER.map((slot, index) => {
          const item = equippedItems.find((e) => e.type === slot);
          return (
            <motion.div
              key={slot}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className={cn(
                  'p-3 rounded-xl border transition-all cursor-pointer',
                  item
                    ? `${RARITY_COLORS[item.rarity]} hover:scale-[1.02]`
                    : 'border-white/10 border-dashed bg-white/5'
                )}
                style={{ backdropFilter: 'blur(10px)' }}
                onClick={() => item && setSelectedItem(item)}
              >
                <div className="text-xs text-white/50 mb-2">{SLOT_LABELS[slot]}</div>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
                      item ? 'bg-black/30' : 'bg-white/5'
                    )}
                  >
                    {item ? item.icon : '+'}
                  </div>
                  {item && (
                    <div className="flex-1 min-w-0">
                      <h3 className={cn('text-sm font-medium truncate', RARITY_TEXT_COLORS[item.rarity])}>
                        {item.name}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        {item.stats.slice(0, 2).map((stat, idx) => (
                          <span key={idx} className="text-xs text-white/50">
                            {stat.name} +{stat.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total Stats */}
      <GlassCard variant="default" size="sm">
        <h3 className="text-sm font-medium text-white/80 mb-3">装备总属性</h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(totalStats).map(([stat, value]) => (
            <div key={stat} className="text-center p-2 rounded-lg bg-white/5">
              <div className="text-lg font-bold text-green-400">+{value}</div>
              <div className="text-xs text-white/50">{stat}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Equipment Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <EquipmentDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
