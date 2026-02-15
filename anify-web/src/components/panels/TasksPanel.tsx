import { useState } from 'react';
import { GlassButton, GlassCard, GlassProgressBar } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { useWorldTasks } from '@/contexts/WorldContext';
import type { Task } from '@/types/world-metadata';

export function TasksPanel() {
    const worldTasks = useWorldTasks();
    const [tasks, setTasks] = useState<Task[]>(worldTasks);

    const handleClaim = (taskId: string) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId ? { ...t, claimed: true } : t
            )
        );
    };

    return (
        <div className="flex flex-col gap-4 max-h-[80vh]">
            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
                    {tasks.map((task) => (
                        <GlassCard key={task.id} size="sm" variant={task.claimed ? 'dark' : 'glow'} className={cn(task.claimed && 'opacity-60')}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-white text-sm">{task.title}</h3>
                                        <span className="text-xs text-white/60">
                                            {task.progress}/{task.total}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/50 mb-2">{task.description}</p>

                                    <GlassProgressBar
                                        value={(task.progress / task.total) * 100}
                                        max={100}
                                        size="sm"
                                        showLabel={false}
                                        className="mb-2"
                                    />

                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-white/40">奖励:</span>
                                        <span className={cn(
                                            'font-medium',
                                            task.reward.type === 'gold' && 'text-yellow-400',
                                            task.reward.type === 'exp' && 'text-purple-400',
                                            task.reward.type === 'gem' && 'text-cyan-400',
                                            task.reward.type === 'item' && 'text-blue-400'
                                        )}>
                                            {task.reward.type === 'gold' && '💰'}
                                            {task.reward.type === 'exp' && '✨'}
                                            {task.reward.type === 'gem' && '💎'}
                                            {task.reward.type === 'item' && '📦'}
                                            {task.reward.amount} {task.reward.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center">
                                    <GlassButton
                                        size="sm"
                                        variant={task.completed && !task.claimed ? 'primary' : 'secondary'}
                                        disabled={!task.completed || task.claimed}
                                        onClick={() => handleClaim(task.id)}
                                        className="min-w-[70px]"
                                    >
                                        {task.claimed ? '已领取' : task.completed ? '领取' : '进行中'}
                                    </GlassButton>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

        </div>
    );
}
