import { Pin, PinOff, CheckCircle, Circle } from 'lucide-react';

import { GlassCard, GlassBadge, GlassProgressBar } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import type { Quest, QuestCategory } from '@/types';

interface QuestCardProps {
  quest: Quest;
  isTracked: boolean;
  onTrack: (questId: string) => void;
  onUntrack: () => void;
  onClick: (quest: Quest) => void;
}

const CATEGORY_LABELS: Record<QuestCategory, string> = {
  main: '主线',
  side: '支线',
  daily: '日常',
  guild: '工会',
};

const CATEGORY_COLORS: Record<QuestCategory, 'warning' | 'info' | 'success' | 'default'> = {
  main: 'warning',
  side: 'info',
  daily: 'success',
  guild: 'default',
};

export function QuestCard({ quest, isTracked, onTrack, onUntrack, onClick }: QuestCardProps) {
  const completedObjectives = quest.objectives.filter((o) => o.completed).length;
  const totalObjectives = quest.objectives.length;

  const handleTrackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTracked) {
      onUntrack();
    } else {
      onTrack(quest.id);
    }
  };

  return (
    <GlassCard
      variant="hover"
      size="sm"
      className={cn('cursor-pointer', isTracked && 'ring-2 ring-amber-500/50')}
      onClick={() => onClick(quest)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <GlassBadge variant={CATEGORY_COLORS[quest.category]}>
              {CATEGORY_LABELS[quest.category]}
            </GlassBadge>
            {quest.level && (
              <span className="text-xs text-white/40">Lv.{quest.level}</span>
            )}
          </div>
          <h3 className="font-medium text-white truncate">{quest.name}</h3>
        </div>
        <button
          onClick={handleTrackClick}
          className={cn(
            'p-2 rounded-lg transition-all',
            isTracked
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
          )}
        >
          {isTracked ? <Pin size={16} /> : <PinOff size={16} />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <GlassProgressBar
          value={completedObjectives}
          max={totalObjectives}
          size="sm"
          showLabel={false}
        />
        <p className="text-xs text-white/40 mt-1">
          {completedObjectives} / {totalObjectives} 目标
        </p>
      </div>

      {/* Objectives preview */}
      <div className="mt-3 space-y-1">
        {quest.objectives.slice(0, 2).map((objective) => (
          <div
            key={objective.id}
            className="flex items-center gap-2 text-sm"
          >
            {objective.completed ? (
              <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
            ) : (
              <Circle size={14} className="text-white/30 flex-shrink-0" />
            )}
            <span
              className={cn(
                'truncate',
                objective.completed ? 'text-white/40 line-through' : 'text-white/70'
              )}
            >
              {objective.description}
            </span>
            {!objective.completed && objective.target > 1 && (
              <span className="text-white/40 text-xs flex-shrink-0">
                ({objective.current}/{objective.target})
              </span>
            )}
          </div>
        ))}
        {quest.objectives.length > 2 && (
          <p className="text-xs text-white/30 pl-6">
            +{quest.objectives.length - 2} 更多目标...
          </p>
        )}
      </div>
    </GlassCard>
  );
}
