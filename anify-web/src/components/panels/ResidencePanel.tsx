import { useState } from 'react';

import { GlassBadge, GlassButton, GlassCard, GlassProgressBar } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

type ResidenceTab = 'rest' | 'storage' | 'journal';

interface JournalEntry {
  id: string;
  title: string;
  date: string;
  content: string;
}

const MOCK_JOURNAL: JournalEntry[] = [
  {
    id: '1',
    title: '抵达新手村',
    date: '第1天',
    content: '今天终于到达了这个陌生的世界，一切都是那么新奇...',
  },
  {
    id: '2',
    title: '第一次战斗',
    date: '第2天',
    content: '在森林里遇到了史莱姆，虽然很弱但还是有些紧张...',
  },
  {
    id: '3',
    title: '结识新伙伴',
    date: '第5天',
    content: '在酒馆认识了一位魔法师，她答应教我一些基础魔法...',
  },
];

export function ResidencePanel() {
  const [activeTab, setActiveTab] = useState<ResidenceTab>('rest');
  const [currentHP] = useState(65);
  const [maxHP] = useState(100);
  const [currentMP] = useState(30);
  const [maxMP] = useState(50);
  const [isResting, setIsResting] = useState(false);

  const handleRest = () => {
    setIsResting(true);
    // Mock resting delay
    setTimeout(() => {
      setIsResting(false);
      // TODO: Implement actual rest logic
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4 max-h-[80vh]">
      {/* Residence type */}
      <div className="flex justify-end">
        <GlassBadge variant="default">温馨小屋</GlassBadge>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'rest', name: '休息', icon: '🛏️' },
          { id: 'storage', name: '储物', icon: '📦' },
          { id: 'journal', name: '日志', icon: '📖' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
              activeTab === tab.id
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            )}
            onClick={() => setActiveTab(tab.id as ResidenceTab)}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'rest' && (
          <GlassCard size="md" variant="dark">
            <div className="flex flex-col gap-4">
              <h3 className="text-white font-medium">当前状态</h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-400">生命值</span>
                    <span className="text-white/60">{currentHP}/{maxHP}</span>
                  </div>
                  <GlassProgressBar max={maxHP} value={currentHP} variant="hp" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-400">魔力值</span>
                    <span className="text-white/60">{currentMP}/{maxMP}</span>
                  </div>
                  <GlassProgressBar max={maxMP} value={currentMP} variant="mp" />
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-white/60 text-sm mb-3">
                  在住所休息可以完全恢复生命值和魔力值
                </p>
                <GlassButton
                  className="w-full"
                  disabled={isResting || (currentHP === maxHP && currentMP === maxMP)}
                  variant="primary"
                  onClick={handleRest}
                >
                  {isResting ? '休息中...' : '开始休息'}
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        )}

        {activeTab === 'storage' && (
          <GlassCard size="md" variant="dark">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">储物箱</h3>
                <span className="text-white/40 text-sm">3 / 20 格</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {/* Mock stored items */}
                {['铁矿石 x5', '草药 x10', '旧地图'].map((item, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-white/5 border border-white/10 rounded-lg flex items-center justify-center p-2 text-xs text-white/70 text-center hover:bg-white/10 cursor-pointer transition-all"
                  >
                    {item}
                  </div>
                ))}
                {/* Empty slots */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="aspect-square bg-white/5 border border-white/10 border-dashed rounded-lg"
                  />
                ))}
              </div>

              <p className="text-white/40 text-sm text-center">
                点击物品可取出或存入
              </p>
            </div>
          </GlassCard>
        )}

        {activeTab === 'journal' && (
          <div className="flex flex-col gap-3">
            {MOCK_JOURNAL.map((entry) => (
              <GlassCard key={entry.id} size="sm" variant="hover">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">{entry.title}</h4>
                    <span className="text-white/40 text-xs">{entry.date}</span>
                  </div>
                  <p className="text-white/60 text-sm line-clamp-2">{entry.content}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
