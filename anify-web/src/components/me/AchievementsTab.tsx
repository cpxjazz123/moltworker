import { useState } from 'react';

import { GlassCard, GlassBadge, GlassProgressBar } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { useWorldAchievements } from '@/contexts/WorldContext';
import type { Achievement } from '@/types/world-metadata';

type CategoryType = 'all' | 'combat' | 'exploration' | 'social' | 'collection' | 'story';

const CATEGORIES: { id: CategoryType; label: string; icon: string }[] = [
  { id: 'all', label: '全部', icon: '🏆' },
  { id: 'combat', label: '战斗', icon: '⚔️' },
  { id: 'exploration', label: '探索', icon: '🗺️' },
  { id: 'social', label: '社交', icon: '👥' },
  { id: 'collection', label: '收藏', icon: '💎' },
  { id: 'story', label: '剧情', icon: '📖' },
];

type Rarity = NonNullable<Achievement['rarity']>;

const RARITY_COLORS: Record<Rarity, string> = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-amber-400',
};

const RARITY_BG: Record<Rarity, string> = {
  common: 'border-gray-500/30',
  rare: 'border-blue-500/30',
  epic: 'border-purple-500/30',
  legendary: 'border-amber-500/30 shadow-[0_0_10px_rgba(255,215,0,0.15)]',
};

const RARITY_LABELS: Record<Rarity, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

export function AchievementsTab() {
  const achievements = useWorldAchievements();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const filteredAchievements = achievements.filter((achievement) => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
      return false;
    }
    if (showUnlockedOnly && !achievement.unlocked) {
      return false;
    }
    return true;
  });

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter((a) => a.unlocked).length,
    points: achievements.filter((a) => a.unlocked).length * 10,
  };

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-2">
        <GlassCard variant="glow" size="sm" className="text-center py-2">
          <div className="text-lg font-bold text-amber-400">{stats.unlocked}</div>
          <div className="text-xs text-white/60">已解锁</div>
        </GlassCard>
        <GlassCard variant="glow" size="sm" className="text-center py-2">
          <div className="text-lg font-bold text-white">
            {stats.unlocked}/{stats.total}
          </div>
          <div className="text-xs text-white/60">总进度</div>
        </GlassCard>
        <GlassCard variant="glow" size="sm" className="text-center py-2">
          <div className="text-lg font-bold text-purple-400">{stats.points}</div>
          <div className="text-xs text-white/60">成就点</div>
        </GlassCard>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              'px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1',
              selectedCategory === category.id
                ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            )}
          >
            <span>{category.icon}</span>
            <span className="hidden sm:inline">{category.label}</span>
          </button>
        ))}
        <button
          onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
          className={cn(
            'px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 ml-auto',
            showUnlockedOnly
              ? 'bg-green-500/30 text-green-400 border border-green-500/50'
              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
          )}
        >
          {showUnlockedOnly ? '已解锁' : '全部'}
        </button>
      </div>

      {/* Achievements List */}
      <div className="space-y-2">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={cn(
              'p-3 rounded-xl border bg-white/5 transition-all',
              achievement.rarity && RARITY_BG[achievement.rarity],
              !achievement.unlocked && 'opacity-70'
            )}
          >
            <div className="flex gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center text-xl flex-shrink-0',
                  !achievement.unlocked && 'grayscale opacity-50'
                )}
              >
                {achievement.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <h4 className="font-medium text-white text-sm truncate">
                    {achievement.title}
                  </h4>
                  <GlassBadge
                    variant={achievement.unlocked ? 'success' : 'default'}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {achievement.unlocked ? '已解锁' : '未解锁'}
                  </GlassBadge>
                </div>
                <p className="text-xs text-white/60 mb-1">{achievement.description}</p>
                <div className="flex items-center gap-2 text-[10px] flex-wrap">
                  <span className={achievement.rarity ? RARITY_COLORS[achievement.rarity] : ''}>
                    {achievement.rarity ? RARITY_LABELS[achievement.rarity] : ''}
                  </span>
                  {achievement.reward && (
                    <span className="text-white/50">
                      奖励: {achievement.reward.amount} {achievement.reward.type}
                    </span>
                  )}
                </div>
                {achievement.progress && !achievement.unlocked && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                      <span>进度</span>
                      <span>
                        {achievement.progress.current}/{achievement.progress.max}
                      </span>
                    </div>
                    <GlassProgressBar
                      value={achievement.progress.current}
                      max={achievement.progress.max}
                      size="sm"
                      showLabel={false}
                    />
                  </div>
                )}
                {achievement.unlockedAt && (
                  <div className="text-[10px] text-white/40 mt-1">
                    解锁于 {new Date(achievement.unlockedAt).toLocaleDateString('zh-CN')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <GlassCard className="text-center py-6">
          <div className="text-3xl mb-2">🏆</div>
          <p className="text-white/60 text-sm">该分类暂无成就</p>
        </GlassCard>
      )}
    </div>
  );
}
