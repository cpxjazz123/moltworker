import { cn } from '@/lib/utils'

export interface AreaMarkerProps {
  area: {
    id: string
    name: string
    icon: string
    areaType: string
    dangerLevel?: number
    mapX: number
    mapY: number
  }
  isSelected: boolean
  onClick: () => void
}

const areaTypeIcons: Record<string, string> = {
  city: '🏰',
  dungeon: '⚔️',
  wilderness: '🌲',
  port: '⛵',
  ruins: '🏚️',
  cave: '🕳️',
  tower: '🗼',
  village: '🏘️',
  temple: '⛩️',
  default: '📍',
}

const dangerLevelColors: Record<number, string> = {
  1: 'ring-green-500/60 shadow-green-500/20',
  2: 'ring-yellow-500/60 shadow-yellow-500/20',
  3: 'ring-orange-500/60 shadow-orange-500/20',
  4: 'ring-red-500/60 shadow-red-500/20',
  5: 'ring-purple-500/60 shadow-purple-500/20',
}

const dangerLevelBg: Record<number, string> = {
  1: 'bg-green-500/20 border-green-500/40',
  2: 'bg-yellow-500/20 border-yellow-500/40',
  3: 'bg-orange-500/20 border-orange-500/40',
  4: 'bg-red-500/20 border-red-500/40',
  5: 'bg-purple-500/20 border-purple-500/40',
}

export function AreaMarker({ area, isSelected, onClick }: AreaMarkerProps) {
  const icon = area.icon || areaTypeIcons[area.areaType.toLowerCase()] || areaTypeIcons.default
  const dangerLevel = area.dangerLevel || 1
  const colorClass = dangerLevelColors[dangerLevel] || dangerLevelColors[1]
  const bgClass = dangerLevelBg[dangerLevel] || dangerLevelBg[1]

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10',
        'group focus:outline-none',
        isSelected && 'z-20 scale-125'
      )}
      style={{ left: `${area.mapX}%`, top: `${area.mapY}%` }}
      title={area.name}
    >
      {/* Marker Container */}
      <div
        className={cn(
          'relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center',
          'border-2 backdrop-blur-sm transition-all duration-300',
          bgClass,
          isSelected && `ring-4 ${colorClass} shadow-[0_0_20px] ${colorClass}`,
          !isSelected && 'hover:scale-110'
        )}
      >
        <span className="text-2xl">{icon}</span>

        {/* Pulse animation when selected */}
        {isSelected && (
          <>
            <span
              className={cn(
                'absolute inset-0 rounded-full animate-ping opacity-30',
                bgClass
              )}
            />
            <span
              className={cn(
                'absolute inset-0 rounded-full animate-pulse opacity-20',
                bgClass
              )}
            />
          </>
        )}
      </div>

      {/* Danger level indicator dots */}
      {dangerLevel > 0 && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
          {Array.from({ length: Math.min(dangerLevel, 5) }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                dangerLevel <= 2
                  ? 'bg-green-400'
                  : dangerLevel <= 3
                    ? 'bg-yellow-400'
                    : dangerLevel <= 4
                      ? 'bg-orange-400'
                      : 'bg-red-400'
              )}
            />
          ))}
        </div>
      )}

      {/* Tooltip */}
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 -top-10 px-3 py-1.5 rounded-lg',
          'bg-black/80 backdrop-blur-sm border border-white/20',
          'text-white text-xs font-medium whitespace-nowrap',
          'opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200',
          isSelected && 'opacity-100'
        )}
      >
        {area.name}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-black/80 border-r border-b border-white/20 rotate-45" />
      </div>
    </button>
  )
}
