import { GlassCard } from '@/components/ui/glass-card';
import type { InventorySubTabId } from './MeTabs';

interface InventoryTabProps {
  subTab: InventorySubTabId;
}

const SUB_TAB_META: Record<InventorySubTabId, { icon: string; title: string }> = {
  equipment: { icon: '⚔️', title: '装备' },
  consumable: { icon: '🧪', title: '消耗品' },
  material: { icon: '⛏️', title: '材料' },
  other: { icon: '📦', title: '其他' },
};

export function InventoryTab({ subTab }: InventoryTabProps) {
  const meta = SUB_TAB_META[subTab];

  return (
    <div className="space-y-4">
      <GlassCard className="text-center py-8">
        <div className="text-4xl mb-3">{meta.icon}</div>
        <h3 className="text-lg font-bold text-white mb-1">{meta.title}</h3>
        <p className="text-sm text-white/50">即将推出</p>
      </GlassCard>

      {/* Empty slot grid */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-white/5 border border-white/10 border-dashed"
          />
        ))}
      </div>
    </div>
  );
}
