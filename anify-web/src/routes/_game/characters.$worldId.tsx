import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Search, Users } from 'lucide-react'
import {
  GlassContainer,
  GlassCard,
  GlassGrid,
  GlassInput,
} from '../../components/ui/glass-card'
import { CharacterCard } from '../../components/CharacterCard'
import { useWorldCharacters } from '../../hooks/useCharacters'
import { useWorldWithAreas } from '../../hooks/useWorlds'
import { useMapStore } from '@/stores/mapStore'
import { usePanelStore } from '@/stores/panelStore'

export const Route = createFileRoute('/_game/characters/$worldId')({
  component: CharactersPage,
})

function CharactersPage() {
  const { worldId } = Route.useParams()
  const navigate = useNavigate()
  const { data: characters, isLoading, error } = useWorldCharacters(worldId)
  const { data: world } = useWorldWithAreas(worldId)
  const [searchQuery, setSearchQuery] = useState('')
  const { selectWorld } = useMapStore()
  const { openPanel } = usePanelStore()

  const handleBackToWorldMap = () => {
    selectWorld(worldId)
    openPanel('map')
  }

  // Filter characters by search query
  const filteredCharacters = characters?.filter((char) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      char.name.toLowerCase().includes(query) ||
      char.role.toLowerCase().includes(query) ||
      char.description?.toLowerCase().includes(query)
    )
  })

  const handleChat = (characterId: string) => {
    navigate({
      to: '/phone',
      search: { characterId, worldId },
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <GlassContainer className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white/50 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading characters...</p>
        </div>
      </GlassContainer>
    )
  }

  // Error state
  if (error) {
    return (
      <GlassContainer>
        <GlassCard className="text-center py-12">
          <div className="text-4xl mb-4">X</div>
          <p className="text-red-400 mb-2">Failed to load characters</p>
          <p className="text-white/50 text-sm mb-4">{error.message}</p>
          <button
            onClick={handleBackToWorldMap}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to World Map
          </button>
        </GlassCard>
      </GlassContainer>
    )
  }

  // Empty state
  if (!characters || characters.length === 0) {
    return (
      <GlassContainer>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBackToWorldMap}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Back to World Map"
          >
            <ArrowLeft className="w-6 h-6 text-white/70" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Characters</h1>
        </div>
        <GlassCard className="text-center py-12">
          <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/60 mb-2">No characters in this world yet</p>
          <p className="text-white/40 text-sm">
            Characters will appear here once they are added to the world.
          </p>
        </GlassCard>
      </GlassContainer>
    )
  }

  return (
    <GlassContainer>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToWorldMap}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Back to World Map"
          >
            <ArrowLeft className="w-6 h-6 text-white/70" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Characters</h1>
            {world && (
              <p className="text-white/50 text-sm mt-1">
                {world.name} · {characters.length} {characters.length === 1 ? 'Character' : 'Characters'}
              </p>
            )}
          </div>
        </div>

        {/* Search */}
        <GlassInput
          icon={<Search className="w-5 h-5" />}
          placeholder="Search characters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Character Grid */}
      {filteredCharacters && filteredCharacters.length > 0 ? (
        <GlassGrid cols={3}>
          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              worldId={worldId}
              onChat={() => handleChat(character.id)}
            />
          ))}
        </GlassGrid>
      ) : (
        <GlassCard className="text-center py-12">
          <Search className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/60">No characters found matching "{searchQuery}"</p>
        </GlassCard>
      )}
    </GlassContainer>
  )
}
