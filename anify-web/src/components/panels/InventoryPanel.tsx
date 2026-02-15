import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { InventorySubTabId } from '@/components/me/MeTabs';
import { InventoryTab } from '@/components/me/InventoryTab';

const SUB_TABS: { id: InventorySubTabId; label: string; icon: string }[] = [
    { id: 'equipment', label: '装备', icon: '⚔️' },
    { id: 'consumable', label: '消耗品', icon: '🧪' },
    { id: 'material', label: '材料', icon: '⛏️' },
    { id: 'other', label: '其他', icon: '📦' },
];

export function InventoryPanel() {
    const [activeTab, setActiveTab] = useState<InventorySubTabId>('equipment');

    return (
        <div className="flex flex-col gap-4 max-h-[65vh] h-full">
            {/* Sub-tab pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                {SUB_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                            activeTab === tab.id
                                ? 'bg-white/20 text-white border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/80'
                        )}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-[300px] pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <InventoryTab subTab={activeTab} />
            </div>
        </div>
    );
}
