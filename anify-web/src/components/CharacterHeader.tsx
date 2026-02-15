import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'
import {
  type CharacterWithRelationship,
  getFavorabilityLevel,
} from '../hooks/useCharacters'

export interface CharacterHeaderProps {
  character: CharacterWithRelationship
  onBack?: () => void
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  busy: 'bg-amber-500',
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

export function CharacterHeader({ character, onBack }: CharacterHeaderProps) {
  const [displayFav, setDisplayFav] = useState(character.favorability)
  const [isAnimating, setIsAnimating] = useState(false)
  const icon = roleIcons[character.role] || roleIcons.default
  const favLevel = getFavorabilityLevel(displayFav)

  // Animate favorability changes
  useEffect(() => {
    if (displayFav !== character.favorability) {
      setIsAnimating(true)
      const diff = character.favorability - displayFav
      const step = diff > 0 ? 1 : -1
      const interval = setInterval(() => {
        setDisplayFav((prev) => {
          const next = prev + step
          if ((step > 0 && next >= character.favorability) ||
              (step < 0 && next <= character.favorability)) {
            clearInterval(interval)
            setIsAnimating(false)
            return character.favorability
          }
          return next
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [character.favorability, displayFav])

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-white/5 border-b border-white/10">
      {onBack && (
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white/70"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>
      )}

      {/* Avatar */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center overflow-hidden">
          {character.portrait ? (
            <img
              src={character.portrait}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl">{icon}</span>
          )}
        </div>
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${statusColors.online}`}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-white truncate">{character.name}</h2>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>{character.role}</span>
          <span>·</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={displayFav}
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isAnimating ? [1, 1.2, 1] : 1,
              }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-1 ${favLevel.color}`}
            >
              <span>{favLevel.icon}</span>
              <span>{displayFav}%</span>
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Call button */}
      <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
        <span className="text-xl">📞</span>
      </button>
    </div>
  )
}

// Compact version for smaller screens or minimal UI
export function CharacterHeaderCompact({ character }: { character: CharacterWithRelationship }) {
  const icon = roleIcons[character.role] || roleIcons.default
  const favLevel = getFavorabilityLevel(character.favorability)

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
      <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
        {character.portrait ? (
          <img
            src={character.portrait}
            alt={character.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-sm">{icon}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{character.name}</p>
      </div>
      <span className={`text-xs ${favLevel.color}`}>
        {favLevel.icon} {character.favorability}
      </span>
    </div>
  )
}
