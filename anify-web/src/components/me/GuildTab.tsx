import { useState } from 'react';

import { GlassBadge, GlassButton, GlassCard, GlassProgressBar } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { useWorldGuild } from '@/contexts/WorldContext';
import type { GuildQuest } from '@/types/world-metadata';

type Quest = GuildQuest;

type QuestFilter = 'all' | 'available' | 'in_progress' | 'completed';

const FILTER_LABELS: Record<QuestFilter, string> = {
    all: '全部',
    available: '可接取',
    in_progress: '进行中',
    completed: '已完成',
};

const DIFFICULTY_COLORS: Record<Quest['difficulty'], { bg: string; text: string; border: string }> = {
    easy: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    hard: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    legendary: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
};

const DIFFICULTY_LABELS: Record<Quest['difficulty'], string> = {
    easy: '简单',
    medium: '普通',
    hard: '困难',
    legendary: '传说',
};

const TYPE_COLORS: Record<Quest['type'], string> = {
    main: 'text-amber-400',
    side: 'text-blue-400',
    daily: 'text-green-400',
    event: 'text-pink-400',
};

const TYPE_LABELS: Record<Quest['type'], string> = {
    main: '主线',
    side: '支线',
    daily: '日常',
    event: '活动',
};

export function GuildTab() {
    const quests = useWorldGuild();

    const [filter, setFilter] = useState<QuestFilter>('all');
    const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

    const filteredQuests =
        filter === 'all' ? quests : quests.filter((q) => q.status === filter);

    const handleAcceptQuest = (questId: string) => {
        console.log('Accept quest:', questId);
        setSelectedQuest(null);
    };

    const handleAbandonQuest = (questId: string) => {
        console.log('Abandon quest:', questId);
        setSelectedQuest(null);
    };

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Header Info */}
            <div className="flex items-center justify-end -mt-2">
                <GlassBadge variant="info">等级: 新手</GlassBadge>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {(Object.keys(FILTER_LABELS) as QuestFilter[]).map((f) => (
                    <button
                        key={f}
                        className={cn(
                            'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                            filter === f
                                ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                        )}
                        onClick={() => setFilter(f)}
                    >
                        {FILTER_LABELS[f]}
                    </button>
                ))}
            </div>

            {/* Quest List */}
            <div className="flex flex-col gap-2">
                {filteredQuests.map((quest) => {
                    const diffStyle = DIFFICULTY_COLORS[quest.difficulty];
                    const progress = quest.objectives
                        ? quest.objectives.filter((o) => o.completed).length / quest.objectives.length
                        : 0;

                    return (
                        <div
                            key={quest.id}
                            className={cn(
                                'p-3 rounded-xl border bg-white/5 cursor-pointer transition-all',
                                diffStyle.border,
                                selectedQuest?.id === quest.id && 'ring-1 ring-amber-400'
                            )}
                            onClick={() => setSelectedQuest(quest)}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={cn('text-[10px] font-medium', TYPE_COLORS[quest.type])}>
                                            {TYPE_LABELS[quest.type]}
                                        </span>
                                        <h4 className="text-white font-medium text-sm">{quest.title}</h4>
                                    </div>
                                    <p className="text-white/50 text-xs mt-0.5 line-clamp-1">{quest.description}</p>
                                </div>
                                <span
                                    className={cn(
                                        'px-1.5 py-0.5 rounded text-[10px] font-medium border flex-shrink-0',
                                        diffStyle.bg,
                                        diffStyle.text,
                                        diffStyle.border
                                    )}
                                >
                                    {DIFFICULTY_LABELS[quest.difficulty]}
                                </span>
                            </div>

                            {quest.status === 'in_progress' && quest.objectives && (
                                <div className="mt-2">
                                    <GlassProgressBar
                                        value={Math.round(progress * 100)}
                                        max={100}
                                        size="sm"
                                        showLabel={false}
                                    />
                                    <div className="text-[10px] text-white/40 mt-0.5">
                                        进度: {quest.objectives.filter((o) => o.completed).length}/{quest.objectives.length}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex gap-2 text-[10px]">
                                    <span className="text-yellow-400">💰{quest.reward.gold}</span>
                                    <span className="text-purple-400">✨{quest.reward.exp}</span>
                                    {quest.reward.item && <span className="text-cyan-400">📦{quest.reward.item}</span>}
                                </div>
                                {quest.status === 'completed' && (
                                    <GlassBadge variant="success" className="text-[10px] px-1.5 py-0">
                                        已完成
                                    </GlassBadge>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filteredQuests.length === 0 && (
                    <div className="text-center text-white/40 py-6 text-sm">暂无任务</div>
                )}
            </div>

            {/* Quest Detail */}
            {selectedQuest && (
                <GlassCard variant="glow" size="sm">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <span className={cn('text-xs font-medium', TYPE_COLORS[selectedQuest.type])}>
                                {TYPE_LABELS[selectedQuest.type]}任务
                            </span>
                            <h4 className="text-white font-bold">{selectedQuest.title}</h4>
                        </div>
                        <span
                            className={cn(
                                'px-2 py-0.5 rounded text-xs font-medium border',
                                DIFFICULTY_COLORS[selectedQuest.difficulty].bg,
                                DIFFICULTY_COLORS[selectedQuest.difficulty].text,
                                DIFFICULTY_COLORS[selectedQuest.difficulty].border
                            )}
                        >
                            {DIFFICULTY_LABELS[selectedQuest.difficulty]}
                        </span>
                    </div>

                    <p className="text-white/60 text-sm mb-3">{selectedQuest.description}</p>

                    {selectedQuest.location && (
                        <div className="text-xs text-white/50 mb-1">
                            📍 位置: <span className="text-white/70">{selectedQuest.location}</span>
                        </div>
                    )}
                    {selectedQuest.npc && (
                        <div className="text-xs text-white/50 mb-2">
                            👤 委托人: <span className="text-white/70">{selectedQuest.npc}</span>
                        </div>
                    )}

                    {/* Objectives */}
                    {selectedQuest.objectives && selectedQuest.status === 'in_progress' && (
                        <div className="mb-3">
                            <h5 className="text-xs font-medium text-white/50 mb-1">任务目标</h5>
                            <div className="space-y-1">
                                {selectedQuest.objectives.map((obj) => (
                                    <div
                                        key={obj.id}
                                        className={cn(
                                            'flex items-center gap-2 text-xs px-2 py-1 rounded-lg',
                                            obj.completed ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/70'
                                        )}
                                    >
                                        <span>{obj.completed ? '✓' : '○'}</span>
                                        <span className={obj.completed ? 'line-through' : ''}>{obj.description}</span>
                                        {!obj.completed && obj.target > 1 && (
                                            <span className="ml-auto text-white/40">
                                                {obj.current}/{obj.target}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rewards */}
                    <div className="flex items-center gap-2 text-sm mb-3">
                        <span className="text-white/50">奖励:</span>
                        <span className="text-yellow-400">💰{selectedQuest.reward.gold}</span>
                        <span className="text-purple-400">✨{selectedQuest.reward.exp}</span>
                        {selectedQuest.reward.item && (
                            <span className="text-cyan-400">📦{selectedQuest.reward.item}</span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        {selectedQuest.status === 'available' && (
                            <GlassButton
                                variant="primary"
                                className="flex-1 text-sm"
                                onClick={() => handleAcceptQuest(selectedQuest.id)}
                            >
                                接取任务
                            </GlassButton>
                        )}
                        {selectedQuest.status === 'in_progress' && (
                            <>
                                <GlassButton variant="primary" className="flex-1 text-sm">
                                    追踪任务
                                </GlassButton>
                                <GlassButton
                                    variant="ghost"
                                    className="text-sm text-red-400"
                                    onClick={() => handleAbandonQuest(selectedQuest.id)}
                                >
                                    放弃
                                </GlassButton>
                            </>
                        )}
                        {selectedQuest.status === 'completed' && (
                            <GlassButton variant="secondary" className="flex-1 text-sm" disabled>
                                已完成
                            </GlassButton>
                        )}
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
