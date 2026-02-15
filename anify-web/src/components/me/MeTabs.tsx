import { cn } from '@/lib/utils';

export type MeCategoryId = 'character' | 'inventory';
export type CharacterSubTabId = 'stats' | 'equipment' | 'grimoire' | 'achievements';
export type InventorySubTabId = 'equipment' | 'consumable' | 'material' | 'other';

interface CategoryDef {
  id: MeCategoryId;
  label: string;
  icon: string;
}

interface SubTabDef {
  id: string;
  label: string;
  icon: string;
}

const CATEGORIES: CategoryDef[] = [
  { id: 'character', label: '角色', icon: '👤' },
  { id: 'inventory', label: '背包', icon: '🎒' },
];

const CHARACTER_SUB_TABS: SubTabDef[] = [
  { id: 'stats', label: '状态数值', icon: '📊' },
  { id: 'equipment', label: '装备', icon: '⚔️' },
  { id: 'grimoire', label: '法术', icon: '📖' },
  { id: 'achievements', label: '成就', icon: '🏆' },
];

const INVENTORY_SUB_TABS: SubTabDef[] = [
  { id: 'equipment', label: '装备', icon: '⚔️' },
  { id: 'consumable', label: '消耗品', icon: '🧪' },
  { id: 'material', label: '材料', icon: '⛏️' },
  { id: 'other', label: '其他', icon: '📦' },
];

const SUB_TABS: Record<MeCategoryId, SubTabDef[]> = {
  character: CHARACTER_SUB_TABS,
  inventory: INVENTORY_SUB_TABS,
};

interface MeTabsProps {
  activeCategory: MeCategoryId;
  activeSubTab: string;
  onCategoryChange: (cat: MeCategoryId) => void;
  onSubTabChange: (tab: string) => void;
}

export function MeTabs({ activeCategory, activeSubTab, onCategoryChange, onSubTabChange }: MeTabsProps) {
  const subTabs = SUB_TABS[activeCategory];

  return (
    <div className="space-y-3">
      {/* Level 1: Segmented Control */}
      <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={cn(
              'flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all',
              activeCategory === cat.id
                ? 'bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'text-white/60 hover:text-white/80 hover:bg-white/5'
            )}
            onClick={() => onCategoryChange(cat.id)}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Level 2: Sub-tab pills */}
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              activeSubTab === tab.id
                ? 'bg-white/20 text-white border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/80'
            )}
            onClick={() => onSubTabChange(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
