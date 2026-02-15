import { useState } from 'react';

import { QuestCard } from './QuestCard';
import { QuestDetail } from './QuestDetail';
import { cn } from '@/lib/utils';
import { useTrackedQuest, useAbandonQuest, useCompleteQuest } from '@/hooks/useQuests';
import type { Quest, QuestCategory, QuestStatus } from '@/types';

const CATEGORY_FILTERS = [
  { id: 'all', name: '全部' },
  { id: 'main', name: '主线' },
  { id: 'side', name: '支线' },
  { id: 'daily', name: '日常' },
  { id: 'guild', name: '工会' },
] as const;

const STATUS_FILTERS = [
  { id: 'active', name: '进行中' },
  { id: 'completed', name: '已完成' },
] as const;

interface QuestListProps {
  quests: Quest[];
}

export function QuestList({ quests }: QuestListProps) {
  const { trackedQuestId, setTrackedQuest } = useTrackedQuest();
  const { abandonQuest } = useAbandonQuest();
  const { completeQuest } = useCompleteQuest();

  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<QuestStatus>('active');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const filteredQuests = quests.filter((quest) => {
    const matchesCategory = selectedCategory === 'all' || quest.category === selectedCategory;
    const matchesStatus = quest.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  const handleAbandon = async (questId: string) => {
    await abandonQuest({ questId });
    setSelectedQuest(null);
  };

  const handleComplete = async (questId: string) => {
    await completeQuest({ questId });
    setSelectedQuest(null);
  };

  const handleTrack = (questId: string) => {
    setTrackedQuest(questId);
  };

  const handleUntrack = () => {
    setTrackedQuest(null);
  };

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat.id}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
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

      {/* Status Filter */}
      <div className="flex gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status.id}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              selectedStatus === status.id
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            )}
            onClick={() => setSelectedStatus(status.id)}
          >
            {status.name}
          </button>
        ))}
      </div>

      {/* Quest List */}
      {filteredQuests.length > 0 ? (
        <div className="space-y-3">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              isTracked={trackedQuestId === quest.id}
              onTrack={handleTrack}
              onUntrack={handleUntrack}
              onClick={setSelectedQuest}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-white/40 text-center">
            {selectedStatus === 'active' ? '暂无进行中的任务' : '暂无已完成的任务'}
          </p>
        </div>
      )}

      {/* Quest Detail Modal */}
      {selectedQuest && (
        <QuestDetail
          quest={selectedQuest}
          isOpen={!!selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onAbandon={handleAbandon}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
