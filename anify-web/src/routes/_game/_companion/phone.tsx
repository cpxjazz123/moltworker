import { useState, useRef, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { GlassContainer } from '../../../components/ui/glass-card'
import { CharacterHeader } from '../../../components/CharacterHeader'
import {
  useCharacter,
  type CharacterWithRelationship,
  getFavorabilityLevel,
} from '../../../hooks/useCharacters'

interface PhoneSearchParams {
  characterId?: string
  worldId?: string
}

export const Route = createFileRoute('/_game/_companion/phone')({
  component: PhonePage,
  validateSearch: (search: Record<string, unknown>): PhoneSearchParams => {
    return {
      characterId: typeof search.characterId === 'string' ? search.characterId : undefined,
      worldId: typeof search.worldId === 'string' ? search.worldId : undefined,
    }
  },
})

interface Message {
  id: string
  sender: 'user' | 'contact' | 'system'
  content: string
  timestamp: string
  type: 'text' | 'image' | 'system'
  favorabilityDelta?: number
}

interface Contact {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'busy'
  affinity: number
  role?: string
}

const mockContact: Contact = {
  id: '1',
  name: 'Elena',
  avatar: '⚔️',
  status: 'online',
  affinity: 85,
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'system',
    content: 'Conversation started',
    timestamp: '10:00',
    type: 'system',
  },
  {
    id: '2',
    sender: 'contact',
    content: "Good morning, adventurer! Ready for today's training?",
    timestamp: '10:01',
    type: 'text',
  },
  {
    id: '3',
    sender: 'user',
    content: "Good morning, Elena! Yes, I'm ready.",
    timestamp: '10:02',
    type: 'text',
  },
  {
    id: '4',
    sender: 'contact',
    content:
      "Great! I was thinking we could practice sword techniques today. I've learned some new moves that might be useful for our next quest.",
    timestamp: '10:03',
    type: 'text',
  },
  {
    id: '5',
    sender: 'user',
    content: 'Sounds good! What kind of moves?',
    timestamp: '10:05',
    type: 'text',
  },
  {
    id: '6',
    sender: 'contact',
    content:
      "It's a special technique passed down in my family - the Dawn Blade Strike. It channels light energy through the sword for extra damage against dark creatures.",
    timestamp: '10:06',
    type: 'text',
  },
  {
    id: '7',
    sender: 'contact',
    content: "Meet me at the training grounds when you're ready!",
    timestamp: '10:07',
    type: 'text',
  },
]

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

function PhonePage() {
  const { characterId, worldId } = Route.useSearch()
  const navigate = useNavigate()
  const { data: character, isLoading: isLoadingCharacter } = useCharacter(
    characterId || '',
    worldId || ''
  )

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [currentFavorability, setCurrentFavorability] = useState<number>(50)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Determine if we're in character chat mode
  const isCharacterMode = Boolean(characterId && worldId)

  // Get contact info based on mode
  const contact: Contact = isCharacterMode && character
    ? {
        id: character.id,
        name: character.name,
        avatar: roleIcons[character.role] || roleIcons.default,
        status: 'online',
        affinity: currentFavorability,
        role: character.role,
      }
    : mockContact

  // Initialize messages when character loads
  useEffect(() => {
    if (isCharacterMode && character) {
      // Set initial favorability
      setCurrentFavorability(character.favorability)

      // Create greeting message
      const greeting = character.greeting || `Hello, I'm ${character.name}.`
      setMessages([
        {
          id: '1',
          sender: 'system',
          content: 'Conversation started',
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          type: 'system',
        },
        {
          id: '2',
          sender: 'contact',
          content: greeting,
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          type: 'text',
        },
      ])
    } else if (!isCharacterMode) {
      // Use default mock messages
      setMessages(mockMessages)
      setCurrentFavorability(mockContact.affinity)
    }
  }, [character, isCharacterMode])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleBack = () => {
    if (isCharacterMode && worldId) {
      navigate({ to: `/characters/${worldId}` })
    } else {
      navigate({ to: '/' })
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'text',
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsSending(true)

    // In character mode, we would call the character chat API
    // For now, simulate a response
    setTimeout(() => {
      // Simulate favorability change
      const favDelta = Math.floor(Math.random() * 5) - 1 // -1 to +3
      const newFav = Math.max(0, Math.min(100, currentFavorability + favDelta))

      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'contact',
        content: isCharacterMode
          ? getCharacterResponse(character ?? null, inputValue)
          : 'I understand! Let me think about that...',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: 'text',
        favorabilityDelta: favDelta !== 0 ? favDelta : undefined,
      }

      setMessages((prev) => [...prev, response])
      if (favDelta !== 0) {
        setCurrentFavorability(newFav)
      }
      setIsSending(false)
    }, 1000 + Math.random() * 1000)
  }

  // Loading state for character mode
  if (isCharacterMode && isLoadingCharacter) {
    return (
      <GlassContainer className="max-w-2xl mx-auto flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white/50 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading character...</p>
        </div>
      </GlassContainer>
    )
  }

  // Character header data for display
  const characterForHeader: CharacterWithRelationship | null =
    isCharacterMode && character
      ? { ...character, favorability: currentFavorability }
      : null

  const favLevel = getFavorabilityLevel(currentFavorability)

  return (
    <GlassContainer className="max-w-2xl mx-auto">
      {/* Phone Frame */}
      <div className="relative bg-black/40 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Status Bar */}
        <div className="flex items-center justify-between px-6 py-2 bg-black/40 text-white/70 text-xs">
          <span>
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <div className="flex items-center gap-1">
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Header - Use CharacterHeader for character mode */}
        {characterForHeader ? (
          <CharacterHeader character={characterForHeader} onBack={handleBack} />
        ) : (
          <div className="flex items-center gap-4 px-4 py-3 bg-white/5 border-b border-white/10">
            <button
              onClick={handleBack}
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
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center">
                <span className="text-xl">{contact.avatar}</span>
              </div>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${statusColors[contact.status]}`}
              />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-white">{contact.name}</h2>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <span className="capitalize">{contact.status}</span>
                <span>·</span>
                <span className={favLevel.color}>
                  {favLevel.icon} {currentFavorability}%
                </span>
              </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <span className="text-xl">📞</span>
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="h-[60vh] overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'system' ? (
                <div className="text-center text-xs text-white/40 py-2">
                  {message.content}
                </div>
              ) : (
                <div
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.sender === 'user'
                        ? 'bg-amber-500/30 border-amber-500/50'
                        : 'bg-white/10 border-white/20'
                    } border rounded-2xl px-4 py-2 ${
                      message.sender === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                    }`}
                  >
                    <p className="text-white text-sm leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p
                        className={`text-xs ${
                          message.sender === 'user' ? 'text-amber-400/70' : 'text-white/40'
                        }`}
                      >
                        {message.timestamp}
                      </p>
                      {message.favorabilityDelta && (
                        <span
                          className={`text-xs ${
                            message.favorabilityDelta > 0 ? 'text-pink-400' : 'text-red-400'
                          }`}
                        >
                          {message.favorabilityDelta > 0 ? '+' : ''}
                          {message.favorabilityDelta} {favLevel.icon}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-white/10 border border-white/20 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <span
                    className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/40 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <span className="text-xl">➕</span>
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                disabled={isSending}
                className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-500/50 disabled:opacity-50"
              />
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <span className="text-xl">😊</span>
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="p-2 bg-amber-500/30 hover:bg-amber-500/50 rounded-full transition-colors disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-amber-400"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center py-2 bg-black/40">
          <div className="w-32 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
    </GlassContainer>
  )
}

// Helper function to generate character-appropriate responses
function getCharacterResponse(
  character: CharacterWithRelationship | null,
  _userMessage: string
): string {
  if (!character) {
    return 'I understand! Let me think about that...'
  }

  // Simple response based on character personality
  const responses: Record<string, string[]> = {
    '大法师': [
      'The arcane energies tell me much about your question...',
      'In my centuries of study, I have learned that wisdom comes slowly.',
      'Perhaps the answer lies in the ancient tomes of the library.',
    ],
    '卫队长': [
      'A soldier must always be vigilant.',
      'The safety of the city is my highest priority.',
      'I will consider your words carefully.',
    ],
    '商人': [
      'That is an interesting proposition...',
      'Business is about mutual benefit, friend.',
      'Let me think about how this could work.',
    ],
    default: [
      'That is quite interesting...',
      'I appreciate you sharing that with me.',
      'Let me think about what you said.',
    ],
  }

  const roleResponses = responses[character.role] || responses.default
  return roleResponses[Math.floor(Math.random() * roleResponses.length)]
}
