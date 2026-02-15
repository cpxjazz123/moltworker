import { useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { GlassButton, GlassBadge } from './ui/glass-card'
import { cn } from '@/lib/utils'

export interface Character {
  id: string
  name: string
  portraitImage?: string
}

export interface Scene {
  id: string
  name: string
}

export interface Area {
  id: string
  name: string
  description?: string
  icon: string
  areaType: string
  dangerLevel?: number
  recommendedLevel?: string
  mapX: number
  mapY: number
}

export interface AreaDetailPanelProps {
  area: Area & { characters: Character[]; scene?: Scene }
  worldId: string
  onClose: () => void
}

const areaTypeLabels: Record<string, string> = {
  city: 'City',
  dungeon: 'Dungeon',
  wilderness: 'Wilderness',
  port: 'Port',
  ruins: 'Ruins',
  cave: 'Cave',
  tower: 'Tower',
  village: 'Village',
  temple: 'Temple',
}

const dangerLevelLabels: Record<number, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  1: { label: 'Safe', variant: 'success' },
  2: { label: 'Low Risk', variant: 'success' },
  3: { label: 'Moderate', variant: 'warning' },
  4: { label: 'Dangerous', variant: 'danger' },
  5: { label: 'Extreme', variant: 'danger' },
}

export function AreaDetailPanel({ area, worldId, onClose }: AreaDetailPanelProps) {
  const navigate = useNavigate()
  const dangerInfo = area.dangerLevel
    ? dangerLevelLabels[area.dangerLevel] || dangerLevelLabels[3]
    : null

  const handleEnterScene = () => {
    if (area.scene) {
      navigate({ to: '/explore' })
    }
  }

  const handleStartAdventure = () => {
    navigate({ to: '/adventure' })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={cn(
          'absolute bottom-0 left-0 right-0 z-30',
          'bg-black/80 backdrop-blur-xl border-t border-white/20',
          'rounded-t-3xl p-6 max-h-[60%] overflow-y-auto'
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close panel"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">{area.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-2 truncate">{area.name}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <GlassBadge variant="info">
                {areaTypeLabels[area.areaType.toLowerCase()] || area.areaType}
              </GlassBadge>
              {dangerInfo && (
                <GlassBadge variant={dangerInfo.variant}>
                  {'⚠'.repeat(area.dangerLevel || 0)} {dangerInfo.label}
                </GlassBadge>
              )}
              {area.recommendedLevel && (
                <GlassBadge variant="default">{area.recommendedLevel}</GlassBadge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {area.description && (
          <p className="text-white/70 mb-4 leading-relaxed">{area.description}</p>
        )}

        {/* Characters */}
        {area.characters && area.characters.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">
              Characters
            </h4>
            <div className="flex flex-wrap gap-3">
              {area.characters.map((character) => (
                <div
                  key={character.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
                >
                  {character.portraitImage ? (
                    <img
                      src={character.portraitImage}
                      alt={character.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                  )}
                  <span className="text-sm text-white/80">{character.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden data for future use */}
        <input type="hidden" value={worldId} />

        {/* Action Buttons */}
        <div className="flex gap-3">
          {area.scene && (
            <GlassButton variant="secondary" className="flex-1" onClick={handleEnterScene}>
              🎮 Enter Scene
            </GlassButton>
          )}
          <GlassButton variant="primary" className="flex-1" onClick={handleStartAdventure}>
            ⚔️ Start Adventure
          </GlassButton>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
