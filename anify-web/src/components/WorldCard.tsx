import { GlassCard, GlassBadge } from './ui/glass-card'
import { useMapStore } from '@/stores/mapStore'
import { usePanelStore } from '@/stores/panelStore'

export interface WorldCardProps {
  id: string
  name: string
  description: string
  coverImage?: string
  worldType?: string
  creator: { displayName: string }
  areaCount: number
}

const worldTypeIcons: Record<string, string> = {
  fantasy: '🏰',
  scifi: '🚀',
  modern: '🏙️',
  horror: '👻',
  historical: '📜',
  default: '🌍',
}

const worldTypeGradients: Record<string, string> = {
  fantasy: 'from-purple-600/40 to-indigo-600/40',
  scifi: 'from-cyan-600/40 to-blue-600/40',
  modern: 'from-gray-600/40 to-slate-600/40',
  horror: 'from-red-900/40 to-gray-900/40',
  historical: 'from-amber-600/40 to-orange-600/40',
  default: 'from-emerald-600/40 to-teal-600/40',
}

export function WorldCard({
  id,
  name,
  description,
  coverImage,
  worldType,
  creator,
  areaCount,
}: WorldCardProps) {
  const typeKey = worldType?.toLowerCase() || 'default'
  const icon = worldTypeIcons[typeKey] || worldTypeIcons.default
  const gradient = worldTypeGradients[typeKey] || worldTypeGradients.default
  const { selectWorld } = useMapStore()
  const { openPanel } = usePanelStore()

  const handleClick = () => {
    selectWorld(id)
    openPanel('map')
  }

  return (
    <div onClick={handleClick}>
      <GlassCard
        variant="hover"
        className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
      >
        {/* Cover Image / Placeholder */}
        <div className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              <span className="text-6xl opacity-50 group-hover:opacity-70 transition-opacity duration-300">
                {icon}
              </span>
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* World type badge */}
          {worldType && (
            <div className="absolute top-3 right-3">
              <GlassBadge variant="info">
                {icon} {worldType}
              </GlassBadge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white truncate group-hover:text-white/90">
            {name}
          </h3>

          <p className="text-sm text-white/60 line-clamp-2 min-h-[2.5rem]">
            {description || 'A mysterious world awaits exploration...'}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <span className="text-base">👤</span>
              <span className="truncate max-w-[120px]">{creator.displayName}</span>
            </div>

            <GlassBadge variant="default">
              {areaCount} {areaCount === 1 ? 'Area' : 'Areas'}
            </GlassBadge>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
