import { MessageCircle } from 'lucide-react'
import { GlassCard, GlassBadge, GlassButton } from './ui/glass-card'
import {
  type CharacterWithRelationship,
  getFavorabilityLevel,
  getFavorabilityColor,
} from '../hooks/useCharacters'

export interface CharacterCardProps {
  character: CharacterWithRelationship
  worldId: string
  onChat: () => void
}

const roleIcons: Record<string, string> = {
  '大法师': '🧙',
  '卫队长': '🛡️',
  '沼泽女巫': '🧹',
  '船长': '⚓',
  '商人': '💰',
  '守护灵': '👻',
  '掮客': '🤝',
  '情报贩子': '🕵️',
  '码头老板': '📦',
  '管家': '🎩',
  '看守者': '🗝️',
  '图书管理员': '📚',
  '女主人': '👗',
  '丝绸商人': '🧵',
  '学者': '📖',
  '商队首领': '🐪',
  '山匪首领': '⚔️',
  '神谕者': '🔮',
  '罗马船长': '⛵',
  '僧侣': '🙏',
  default: '👤',
}

const roleGradients: Record<string, string> = {
  '大法师': 'from-purple-600/40 to-indigo-600/40',
  '卫队长': 'from-gray-600/40 to-slate-600/40',
  '沼泽女巫': 'from-green-900/40 to-emerald-900/40',
  '船长': 'from-blue-600/40 to-cyan-600/40',
  '商人': 'from-amber-600/40 to-yellow-600/40',
  '守护灵': 'from-cyan-600/40 to-white/20',
  '掮客': 'from-zinc-600/40 to-gray-600/40',
  '情报贩子': 'from-slate-700/40 to-gray-800/40',
  '码头老板': 'from-stone-600/40 to-zinc-600/40',
  '管家': 'from-neutral-600/40 to-slate-600/40',
  '看守者': 'from-gray-800/40 to-black/40',
  '图书管理员': 'from-amber-800/40 to-orange-900/40',
  '女主人': 'from-rose-600/40 to-pink-600/40',
  '丝绸商人': 'from-red-600/40 to-rose-600/40',
  '学者': 'from-emerald-600/40 to-teal-600/40',
  '商队首领': 'from-orange-700/40 to-amber-700/40',
  '山匪首领': 'from-red-800/40 to-stone-700/40',
  '神谕者': 'from-violet-600/40 to-purple-600/40',
  '罗马船长': 'from-red-700/40 to-amber-700/40',
  '僧侣': 'from-orange-500/40 to-yellow-500/40',
  default: 'from-gray-600/40 to-slate-600/40',
}

export function CharacterCard({ character, onChat }: CharacterCardProps) {
  const icon = roleIcons[character.role] || roleIcons.default
  const gradient = roleGradients[character.role] || roleGradients.default
  const favLevel = getFavorabilityLevel(character.favorability)
  const favColor = getFavorabilityColor(character.favorability)

  return (
    <GlassCard
      variant="hover"
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
    >
      {/* Portrait / Placeholder */}
      <div className="relative h-32 -mx-6 -mt-6 mb-4 overflow-hidden">
        {character.portrait ? (
          <img
            src={character.portrait}
            alt={character.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <span className="text-5xl opacity-70 group-hover:opacity-90 transition-opacity duration-300">
              {icon}
            </span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Role badge */}
        <div className="absolute top-3 right-3">
          <GlassBadge variant="info">
            {icon} {character.role}
          </GlassBadge>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white truncate group-hover:text-white/90">
          {character.name}
        </h3>

        {character.description && (
          <p className="text-sm text-white/60 line-clamp-2 min-h-[2.5rem]">
            {character.description}
          </p>
        )}

        {/* Favorability bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className={`flex items-center gap-1 ${favLevel.color}`}>
              <span>{favLevel.icon}</span>
              <span>{favLevel.level}</span>
            </span>
            <span className="text-white/50">{character.favorability}/100</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${favColor} transition-all duration-500`}
              style={{ width: `${character.favorability}%` }}
            />
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2 border-t border-white/10">
          <GlassButton
            variant="secondary"
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            onClick={onChat}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat</span>
          </GlassButton>
        </div>
      </div>
    </GlassCard>
  )
}
