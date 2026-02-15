import { useState } from 'react';

import {
  GlassCard,
  GlassBadge,
  GlassButton,
  GlassProgressBar,
} from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'active' | 'passive' | 'ultimate';
  element: 'fire' | 'water' | 'wind' | 'earth' | 'light' | 'dark' | 'neutral';
  level: number;
  maxLevel: number;
  mpCost?: number;
  cooldown?: number;
  unlocked: boolean;
  equipped?: boolean;
}

const MOCK_SKILLS: Skill[] = [
  {
    id: '1',
    name: '火球术',
    description: '发射一个灼热的火球，对单个敌人造成火属性伤害',
    icon: '🔥',
    type: 'active',
    element: 'fire',
    level: 5,
    maxLevel: 10,
    mpCost: 20,
    cooldown: 3,
    unlocked: true,
    equipped: true,
  },
  {
    id: '2',
    name: '冰霜护盾',
    description: '创建一个冰霜屏障，减少受到的伤害',
    icon: '🧊',
    type: 'active',
    element: 'water',
    level: 3,
    maxLevel: 10,
    mpCost: 30,
    cooldown: 8,
    unlocked: true,
    equipped: true,
  },
  {
    id: '3',
    name: '风刃斩',
    description: '释放一道风刃，可以同时攻击多个敌人',
    icon: '🌀',
    type: 'active',
    element: 'wind',
    level: 4,
    maxLevel: 10,
    mpCost: 25,
    cooldown: 5,
    unlocked: true,
    equipped: true,
  },
  {
    id: '4',
    name: '岩肤术',
    description: '被动提升防御力，使皮肤如岩石般坚硬',
    icon: '🪨',
    type: 'passive',
    element: 'earth',
    level: 2,
    maxLevel: 5,
    unlocked: true,
  },
  {
    id: '5',
    name: '圣光术',
    description: '用神圣之光治愈自己或队友',
    icon: '✨',
    type: 'active',
    element: 'light',
    level: 4,
    maxLevel: 10,
    mpCost: 35,
    cooldown: 6,
    unlocked: true,
    equipped: true,
  },
  {
    id: '6',
    name: '暗影步',
    description: '瞬间移动到敌人身后，提高暴击率',
    icon: '🌑',
    type: 'active',
    element: 'dark',
    level: 3,
    maxLevel: 10,
    mpCost: 40,
    cooldown: 10,
    unlocked: true,
  },
  {
    id: '7',
    name: '龙炎天降',
    description: '召唤远古龙族之怒，对所有敌人造成毁灭性伤害',
    icon: '🐉',
    type: 'ultimate',
    element: 'fire',
    level: 1,
    maxLevel: 5,
    mpCost: 100,
    cooldown: 30,
    unlocked: true,
    equipped: true,
  },
  {
    id: '8',
    name: '魔力涌流',
    description: '被动回复 MP',
    icon: '💧',
    type: 'passive',
    element: 'neutral',
    level: 3,
    maxLevel: 5,
    unlocked: true,
  },
  {
    id: '9',
    name: '雷霆一击',
    description: '召唤雷电打击所有敌人',
    icon: '⚡',
    type: 'active',
    element: 'wind',
    level: 0,
    maxLevel: 10,
    mpCost: 45,
    cooldown: 8,
    unlocked: false,
  },
  {
    id: '10',
    name: '虚空坍缩',
    description: '创造一个虚空，吸引并伤害附近所有敌人',
    icon: '🕳️',
    type: 'ultimate',
    element: 'dark',
    level: 0,
    maxLevel: 5,
    mpCost: 120,
    cooldown: 45,
    unlocked: false,
  },
];

const ELEMENT_COLORS: Record<Skill['element'], string> = {
  fire: 'bg-red-500/20 text-red-400 border-red-500/30',
  water: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  wind: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  earth: 'bg-amber-700/20 text-amber-600 border-amber-700/30',
  light: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  dark: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  neutral: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const TYPE_COLORS: Record<Skill['type'], string> = {
  active: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  passive: 'bg-green-500/20 text-green-400 border-green-500/30',
  ultimate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const TYPE_LABELS: Record<Skill['type'], string> = {
  active: '主动',
  passive: '被动',
  ultimate: '终极',
};

const ELEMENT_LABELS: Record<Skill['element'], string> = {
  fire: '火',
  water: '水',
  wind: '风',
  earth: '地',
  light: '光',
  dark: '暗',
  neutral: '无',
};

type FilterType = 'all' | 'unlocked' | 'equipped' | 'active' | 'passive' | 'ultimate';

const FILTER_LABELS: Record<FilterType, string> = {
  all: '全部',
  unlocked: '已解锁',
  equipped: '已装备',
  active: '主动',
  passive: '被动',
  ultimate: '终极',
};

export function GrimoireTab() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredSkills = MOCK_SKILLS.filter((skill) => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return skill.unlocked;
    if (filter === 'equipped') return skill.equipped;
    return skill.type === filter;
  });

  const stats = {
    unlocked: MOCK_SKILLS.filter((s) => s.unlocked).length,
    total: MOCK_SKILLS.length,
    equipped: MOCK_SKILLS.filter((s) => s.equipped).length,
    maxEquipped: 5,
    active: MOCK_SKILLS.filter((s) => s.type === 'active').length,
    passive: MOCK_SKILLS.filter((s) => s.type === 'passive').length,
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <GlassCard size="sm" className="text-center py-2">
          <div className="text-lg font-bold text-amber-400">
            {stats.unlocked}/{stats.total}
          </div>
          <div className="text-xs text-white/60">技能解锁</div>
        </GlassCard>
        <GlassCard size="sm" className="text-center py-2">
          <div className="text-lg font-bold text-white">
            {stats.equipped}/{stats.maxEquipped}
          </div>
          <div className="text-xs text-white/60">技能槽</div>
        </GlassCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(FILTER_LABELS) as FilterType[]).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
              filter === type
                ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            )}
          >
            {FILTER_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-3 gap-2">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className={cn(
              'p-2 rounded-xl border cursor-pointer transition-all relative',
              ELEMENT_COLORS[skill.element],
              !skill.unlocked && 'opacity-50 grayscale',
              selectedSkill?.id === skill.id && 'ring-2 ring-white/30'
            )}
            onClick={() => skill.unlocked && setSelectedSkill(skill)}
          >
            {skill.equipped && (
              <div className="absolute top-1 right-1">
                <span className="text-amber-400 text-xs">★</span>
              </div>
            )}
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-black/30 flex items-center justify-center border border-white/10">
                {skill.unlocked ? (
                  <span className="text-xl">{skill.icon}</span>
                ) : (
                  <span className="text-lg">🔒</span>
                )}
              </div>
              <h4 className="font-medium text-white text-xs mb-0.5 truncate">
                {skill.unlocked ? skill.name : '???'}
              </h4>
              <GlassBadge className={cn('text-[10px] px-1.5 py-0', TYPE_COLORS[skill.type])}>
                {TYPE_LABELS[skill.type]}
              </GlassBadge>
              {skill.unlocked && (
                <div className="mt-1">
                  <div className="text-[10px] text-white/50">
                    Lv.{skill.level}/{skill.maxLevel}
                  </div>
                  <div className="w-full h-0.5 bg-black/30 rounded-full mt-0.5 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Skill Details */}
      {selectedSkill ? (
        <GlassCard variant="glow" size="sm" className={ELEMENT_COLORS[selectedSkill.element]}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-14 h-14 rounded-xl bg-black/30 flex items-center justify-center border border-white/20">
              <span className="text-3xl">{selectedSkill.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{selectedSkill.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <GlassBadge className={cn('text-xs', TYPE_COLORS[selectedSkill.type])}>
                  {TYPE_LABELS[selectedSkill.type]}
                </GlassBadge>
                <GlassBadge className={cn('text-xs', ELEMENT_COLORS[selectedSkill.element])}>
                  {ELEMENT_LABELS[selectedSkill.element]}属性
                </GlassBadge>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/70 mb-3">{selectedSkill.description}</p>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">等级</span>
              <span className="text-white">
                {selectedSkill.level}/{selectedSkill.maxLevel}
              </span>
            </div>
            <GlassProgressBar
              value={selectedSkill.level}
              max={selectedSkill.maxLevel}
              size="sm"
              showLabel={false}
            />
            {selectedSkill.mpCost && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">MP 消耗</span>
                <span className="text-blue-400">{selectedSkill.mpCost}</span>
              </div>
            )}
            {selectedSkill.cooldown && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">冷却时间</span>
                <span className="text-white">{selectedSkill.cooldown}秒</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {selectedSkill.type !== 'passive' && (
              <GlassButton
                variant={selectedSkill.equipped ? 'secondary' : 'primary'}
                className="flex-1 text-sm"
              >
                {selectedSkill.equipped ? '卸下' : '装备'}
              </GlassButton>
            )}
            <GlassButton
              variant="ghost"
              disabled={selectedSkill.level >= selectedSkill.maxLevel}
              className="text-sm"
            >
              升级
            </GlassButton>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="text-center py-6">
          <div className="text-3xl mb-2">📖</div>
          <p className="text-white/60 text-sm">选择一个技能查看详情</p>
        </GlassCard>
      )}
    </div>
  );
}
