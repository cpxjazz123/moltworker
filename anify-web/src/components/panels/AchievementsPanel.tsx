import { GlassCard, GlassProgressBar } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { useWorldAchievements } from '@/contexts/WorldContext';

export function AchievementsPanel() {
    const achievements = useWorldAchievements();

    return (
        <div className="flex flex-col gap-4 max-h-[80vh]">
            <div className="flex justify-end">
                <div className="text-xs text-white/50">
                    已解锁: {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[400px] pr-1">
                    {achievements.map((achievement) => (
                        <GlassCard
                            key={achievement.id}
                            size="sm"
                            variant={achievement.unlocked ? 'glow' : 'dark'}
                            className={cn(
                                'transition-all',
                                !achievement.unlocked && 'opacity-70 grayscale-[0.8]'
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    'w-12 h-12 rounded-lg flex items-center justify-center text-2xl border',
                                    achievement.unlocked
                                        ? 'bg-amber-500/20 border-amber-500/50 text-shadow-glow'
                                        : 'bg-white/5 border-white/10'
                                )}>
                                    {achievement.icon}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <h4 className={cn(
                                            'font-bold text-sm',
                                            achievement.unlocked ? 'text-amber-400' : 'text-white/60'
                                        )}>
                                            {achievement.title}
                                        </h4>
                                        {achievement.unlockedAt && (
                                            <span className="text-[10px] text-white/30">{achievement.unlockedAt}</span>
                                        )}
                                    </div>

                                    <p className="text-xs text-white/50 mt-0.5">{achievement.description}</p>

                                    {achievement.progress && !achievement.unlocked && (
                                        <div className="mt-2">
                                            <GlassProgressBar
                                                value={(achievement.progress.current / achievement.progress.max) * 100}
                                                max={100}
                                                size="sm"
                                                showLabel={false}
                                            />
                                            <div className="text-[10px] text-right text-white/30 mt-0.5">
                                                {achievement.progress.current}/{achievement.progress.max}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

        </div>
    );
}
