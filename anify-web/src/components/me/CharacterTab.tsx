import { GlassCard, GlassProgressBar } from '@/components/ui/glass-card';
import { useGameData } from '@/contexts/GameDataContext';
import { useCharacters } from '@/hooks/useCharacters';
import { useWorld } from '@/contexts/WorldContext';

const STAT_LABELS: Record<string, string> = {
  atk: 'ATK',
  def: 'DEF',
  mag: 'MAG',
  res: 'RES',
  spd: 'SPD',
  crit: 'CRIT',
};

const STAT_COLORS: Record<string, string> = {
  atk: 'text-red-400',
  def: 'text-blue-400',
  mag: 'text-purple-400',
  res: 'text-cyan-400',
  spd: 'text-yellow-400',
  crit: 'text-orange-400',
};

export function CharacterTab() {
  const { character } = useGameData();
  // World context for future integration with world-specific character data
  const { currentWorld: _currentWorld } = useWorld();
  const { defaultCharacter: _defaultCharacter } = useCharacters();

  if (!character) {
    return (
      <div className="flex items-center justify-center h-40 text-white/50">
        No character data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Character Header */}
      <GlassCard variant="glow" size="md">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-white/20 flex items-center justify-center text-4xl">
            👤
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{character.name}</h2>
            <p className="text-white/60 text-sm">Level {character.level}</p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                <span>EXP</span>
                <span>{character.experience} / {character.maxExperience}</span>
              </div>
              <GlassProgressBar
                value={character.experience}
                max={character.maxExperience}
                variant="exp"
                size="sm"
                showLabel={false}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* HP/MP Bars */}
      <GlassCard variant="default" size="sm">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-red-400 font-medium">HP</span>
              <span className="text-white/70">{character.hp} / {character.maxHp}</span>
            </div>
            <GlassProgressBar
              value={character.hp}
              max={character.maxHp}
              variant="hp"
              size="md"
              showLabel={false}
            />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-blue-400 font-medium">MP</span>
              <span className="text-white/70">{character.mp} / {character.maxMp}</span>
            </div>
            <GlassProgressBar
              value={character.mp}
              max={character.maxMp}
              variant="mp"
              size="md"
              showLabel={false}
            />
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <GlassCard variant="default" size="sm">
        <h3 className="text-sm font-medium text-white/80 mb-3">属性</h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(character.stats).map(([stat, value]) => (
            <div
              key={stat}
              className="text-center p-2 rounded-lg bg-white/5 border border-white/10"
            >
              <div className={`text-lg font-bold ${STAT_COLORS[stat] || 'text-white'}`}>
                {value}
              </div>
              <div className="text-xs text-white/50">{STAT_LABELS[stat] || stat.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
