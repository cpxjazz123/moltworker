import { X, CheckCircle, Circle, Gift, Coins, Sparkles, Package } from 'lucide-react';

import { GlassCard, GlassBadge, GlassButton, GlassProgressBar } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import type { Quest, QuestCategory, QuestReward } from '@/types';

interface QuestDetailProps {
  quest: Quest;
  isOpen: boolean;
  onClose: () => void;
  onAbandon: (questId: string) => void;
  onComplete: (questId: string) => void;
}

const CATEGORY_LABELS: Record<QuestCategory, string> = {
  main: '主线任务',
  side: '支线任务',
  daily: '日常任务',
  guild: '工会任务',
};

const CATEGORY_COLORS: Record<QuestCategory, 'warning' | 'info' | 'success' | 'default'> = {
  main: 'warning',
  side: 'info',
  daily: 'success',
  guild: 'default',
};

const REWARD_ICONS: Record<QuestReward['type'], React.ReactNode> = {
  gold: <Coins size={16} className="text-amber-400" />,
  exp: <Sparkles size={16} className="text-purple-400" />,
  item: <Package size={16} className="text-blue-400" />,
};

export function QuestDetail({ quest, isOpen, onClose, onAbandon, onComplete }: QuestDetailProps) {
  if (!isOpen) return null;

  const completedObjectives = quest.objectives.filter((o) => o.completed).length;
  const totalObjectives = quest.objectives.length;
  const allCompleted = completedObjectives === totalObjectives;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <GlassCard variant="glow" size="lg" className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GlassBadge variant={CATEGORY_COLORS[quest.category]}>
                {CATEGORY_LABELS[quest.category]}
              </GlassBadge>
              {quest.level && (
                <span className="text-xs text-white/40">Lv.{quest.level}</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{quest.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-white/70 text-sm mb-6">{quest.description}</p>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">任务进度</span>
            <span className="text-sm text-white/80">
              {completedObjectives} / {totalObjectives}
            </span>
          </div>
          <GlassProgressBar
            value={completedObjectives}
            max={totalObjectives}
            size="md"
            showLabel={false}
          />
        </div>

        {/* Objectives */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-white/80 mb-3">任务目标</h3>
          <div className="space-y-2">
            {quest.objectives.map((objective) => (
              <div
                key={objective.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg',
                  objective.completed ? 'bg-green-500/10' : 'bg-white/5'
                )}
              >
                {objective.completed ? (
                  <CheckCircle size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle size={18} className="text-white/30 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={cn(
                      'text-sm',
                      objective.completed ? 'text-white/40 line-through' : 'text-white/80'
                    )}
                  >
                    {objective.description}
                  </p>
                  {!objective.completed && objective.target > 1 && (
                    <div className="mt-1">
                      <GlassProgressBar
                        value={objective.current}
                        max={objective.target}
                        size="sm"
                        showLabel={false}
                      />
                      <p className="text-xs text-white/40 mt-1">
                        {objective.current} / {objective.target}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
            <Gift size={16} />
            任务奖励
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quest.rewards.map((reward) => (
              <div
                key={reward.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/5"
              >
                <div className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center text-lg">
                  {reward.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">{reward.name}</p>
                  <p className="text-xs text-white/40 flex items-center gap-1">
                    {REWARD_ICONS[reward.type]}
                    x{reward.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {quest.category !== 'main' && (
            <GlassButton
              variant="danger"
              size="md"
              className="flex-1"
              onClick={() => onAbandon(quest.id)}
            >
              放弃任务
            </GlassButton>
          )}
          <GlassButton
            variant="primary"
            size="md"
            className="flex-1"
            disabled={!allCompleted}
            onClick={() => onComplete(quest.id)}
          >
            {allCompleted ? '完成任务' : '进行中...'}
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
}
