import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CharacterSubTabId } from '@/components/me/MeTabs';
import { CharacterTab } from '@/components/me/CharacterTab';
import { EquipmentTab } from '@/components/me/EquipmentTab';
import { GrimoireTab } from '@/components/me/GrimoireTab';
import { AchievementsTab } from '@/components/me/AchievementsTab';

const SUB_TABS: { id: CharacterSubTabId; label: string; icon: string }[] = [
    { id: 'stats', label: '状态数值', icon: '📊' },
    { id: 'equipment', label: '装备', icon: '⚔️' },
    { id: 'grimoire', label: '法术', icon: '📖' },
    { id: 'achievements', label: '成就', icon: '🏆' },
];

export function CharacterPanel() {
    const [activeTab, setActiveTab] = useState<CharacterSubTabId>('equipment');

    const renderContent = () => {
        switch (activeTab) {
            case 'stats':
                return <CharacterTab />;
            case 'equipment':
                return <EquipmentTab />;
            case 'grimoire':
                return <GrimoireTab />;
            case 'achievements':
                return <AchievementsTab />;
        }
    };

    return (
        <div className="flex flex-col gap-4 max-h-[80vh]">
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
                {renderContent()}
            </div>
        </div>
    );
}
