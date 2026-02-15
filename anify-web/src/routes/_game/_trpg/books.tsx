import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
    GlassCard,
    GlassContainer,
    PageHeader,
    GlassBadge,
    GlassButton,
} from '../../../components/ui/glass-card'

export const Route = createFileRoute('/_game/_trpg/books')({
    component: BooksPage,
})

interface Book {
    id: string
    title: string
    author: string
    cover: string
    category: 'lore' | 'bestiary' | 'guide' | 'story' | 'journal'
    pages: number
    readPages: number
    description: string
    content?: string[]
    unlocked: boolean
    new?: boolean
}

const mockBooks: Book[] = [
    {
        id: '1',
        title: 'The Dawn Chronicles',
        author: 'Elder Sage Merlin',
        cover: '📕',
        category: 'lore',
        pages: 50,
        readPages: 50,
        description: 'The complete history of the Dawn Kingdom from its founding to the present day.',
        content: [
            'Chapter 1: The Founding\n\nLong ago, when the world was young and magic flowed freely through the land, a great hero named Aldric united the scattered tribes of humanity...',
            'Chapter 2: The Golden Age\n\nUnder the reign of the Dawn Dynasty, the kingdom flourished. Magic academies were established, trade routes opened, and peace reigned for a thousand years...',
        ],
        unlocked: true,
    },
    {
        id: '2',
        title: 'Bestiary Vol. I',
        author: 'Hunter\'s Guild',
        cover: '📗',
        category: 'bestiary',
        pages: 100,
        readPages: 67,
        description: 'A comprehensive guide to the creatures found in the realm.',
        content: [
            'Slime\n\nCommon monsters found in caves and dungeons. Weak individually but can be dangerous in large numbers. Weakness: Fire',
            'Goblin\n\nSmall humanoid creatures that live in tribes. Known for their cunning and love of shiny objects. Weakness: Light magic',
        ],
        unlocked: true,
    },
    {
        id: '3',
        title: 'Beginner\'s Guide to Magic',
        author: 'Archmage Theron',
        cover: '📘',
        category: 'guide',
        pages: 30,
        readPages: 30,
        description: 'Essential knowledge for aspiring mages.',
        unlocked: true,
    },
    {
        id: '4',
        title: 'The Lost Princess',
        author: 'Anonymous',
        cover: '📙',
        category: 'story',
        pages: 80,
        readPages: 0,
        description: 'A romantic tale of a princess who fled her kingdom to find true love.',
        unlocked: true,
        new: true,
    },
    {
        id: '5',
        title: 'Elena\'s Journal',
        author: 'Elena',
        cover: '📓',
        category: 'journal',
        pages: 20,
        readPages: 15,
        description: 'The personal journal of your companion Elena.',
        content: [
            'Day 1\n\nI met a strange adventurer today at the training grounds. They seem different from the others - there\'s a determination in their eyes that reminds me of myself...',
            'Day 7\n\nWe completed our first quest together. I must admit, they handle a sword better than I expected. Perhaps this partnership will work out after all...',
        ],
        unlocked: true,
    },
    {
        id: '6',
        title: 'Advanced Combat Techniques',
        author: 'General Marcus',
        cover: '📕',
        category: 'guide',
        pages: 45,
        readPages: 0,
        description: 'Master-level combat strategies and techniques.',
        unlocked: false,
    },
    {
        id: '7',
        title: 'Secrets of the Abyss',
        author: '???',
        cover: '📖',
        category: 'lore',
        pages: 66,
        readPages: 0,
        description: 'A forbidden tome containing knowledge of the Abyss.',
        unlocked: false,
    },
    {
        id: '8',
        title: 'Dragon Encyclopedia',
        author: 'Dragon Research Society',
        cover: '📗',
        category: 'bestiary',
        pages: 150,
        readPages: 23,
        description: 'Everything known about the ancient dragons.',
        unlocked: true,
    },
]

const categoryIcons = {
    lore: '📜',
    bestiary: '🐲',
    guide: '📚',
    story: '💫',
    journal: '📓',
}

const categoryLabels = {
    lore: 'Lore',
    bestiary: 'Bestiary',
    guide: 'Guide',
    story: 'Story',
    journal: 'Journal',
}

function BooksPage() {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(0)
    const [isReading, setIsReading] = useState(false)

    const filteredBooks = mockBooks.filter(
        (book) => selectedCategory === 'all' || book.category === selectedCategory
    )

    const unlockedBooks = mockBooks.filter((b) => b.unlocked).length
    const totalBooks = mockBooks.length
    const totalPages = mockBooks.reduce((acc, b) => acc + b.readPages, 0)

    const handleRead = (book: Book) => {
        if (!book.unlocked) return
        setSelectedBook(book)
        setCurrentPage(0)
        setIsReading(true)
    }

    const closeReader = () => {
        setIsReading(false)
    }

    return (
        <GlassContainer>
            <PageHeader title="Books" backTo="/adventure" />

            {/* Reading Mode */}
            {isReading && selectedBook && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
                    <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-amber-400">{selectedBook.title}</h2>
                            <button
                                onClick={closeReader}
                                className="p-2 hover:bg-white/10 rounded-full"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="h-[60vh] overflow-y-auto mb-4 p-6 bg-amber-950/30 rounded-xl border border-amber-500/20">
                            {selectedBook.content ? (
                                <div className="prose prose-invert prose-amber">
                                    <p className="text-white/90 whitespace-pre-line leading-relaxed font-serif">
                                        {selectedBook.content[currentPage]}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-white/60 text-center py-20">
                                    Content not available yet...
                                </p>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <GlassButton
                                variant="secondary"
                                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                disabled={currentPage === 0}
                            >
                                ← Previous
                            </GlassButton>
                            <span className="text-white/60">
                                Page {currentPage + 1} / {selectedBook.content?.length || 1}
                            </span>
                            <GlassButton
                                variant="secondary"
                                onClick={() =>
                                    setCurrentPage(
                                        Math.min(
                                            (selectedBook.content?.length || 1) - 1,
                                            currentPage + 1
                                        )
                                    )
                                }
                                disabled={currentPage >= (selectedBook.content?.length || 1) - 1}
                            >
                                Next →
                            </GlassButton>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-6">
                <GlassCard size="sm" className="flex items-center gap-3">
                    <span className="text-2xl">📚</span>
                    <div>
                        <div className="text-lg font-bold text-white">
                            {unlockedBooks}/{totalBooks}
                        </div>
                        <div className="text-xs text-white/60">Books Collected</div>
                    </div>
                </GlassCard>
                <GlassCard size="sm" className="flex items-center gap-3">
                    <span className="text-2xl">📖</span>
                    <div>
                        <div className="text-lg font-bold text-amber-400">{totalPages}</div>
                        <div className="text-xs text-white/60">Pages Read</div>
                    </div>
                </GlassCard>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        selectedCategory === 'all'
                            ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                            : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                    }`}
                >
                    All
                </button>
                {Object.entries(categoryLabels).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                            selectedCategory === key
                                ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        <span>{categoryIcons[key as keyof typeof categoryIcons]}</span>
                        {label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Book List */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {filteredBooks.map((book) => (
                            <GlassCard
                                key={book.id}
                                variant="hover"
                                size="sm"
                                className={`cursor-pointer relative ${
                                    !book.unlocked ? 'opacity-60' : ''
                                } ${selectedBook?.id === book.id ? 'ring-2 ring-amber-400' : ''}`}
                                onClick={() => setSelectedBook(book)}
                            >
                                {book.new && (
                                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                                        NEW
                                    </span>
                                )}
                                <div className="text-center">
                                    <div className="w-16 h-20 mx-auto mb-2 rounded-lg bg-gradient-to-b from-amber-900/50 to-amber-950/50 border border-amber-500/30 flex items-center justify-center shadow-lg">
                                        <span className="text-3xl">{book.cover}</span>
                                    </div>
                                    <p className="text-sm font-medium text-white truncate">
                                        {book.unlocked ? book.title : '???'}
                                    </p>
                                    <p className="text-xs text-white/50 truncate">
                                        {book.unlocked ? book.author : 'Unknown'}
                                    </p>
                                    {book.unlocked && (
                                        <div className="mt-2">
                                            <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-500 transition-all duration-300"
                                                    style={{
                                                        width: `${(book.readPages / book.pages) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-white/40 mt-1">
                                                {book.readPages}/{book.pages}
                                            </p>
                                        </div>
                                    )}
                                    {!book.unlocked && (
                                        <span className="text-2xl mt-2 block">🔒</span>
                                    )}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>

                {/* Book Details */}
                <div className="lg:col-span-1">
                    {selectedBook ? (
                        <GlassCard variant="glow" className="sticky top-4">
                            <div className="text-center mb-6">
                                <div className="w-24 h-32 mx-auto mb-4 rounded-xl bg-gradient-to-b from-amber-900/50 to-amber-950/50 border-2 border-amber-500/30 flex items-center justify-center shadow-xl">
                                    <span className="text-5xl">{selectedBook.cover}</span>
                                </div>
                                <h3 className="text-xl font-bold text-amber-400">
                                    {selectedBook.unlocked ? selectedBook.title : '???'}
                                </h3>
                                <p className="text-white/60 text-sm">
                                    by {selectedBook.unlocked ? selectedBook.author : 'Unknown'}
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <GlassBadge>
                                        {categoryIcons[selectedBook.category]}{' '}
                                        {categoryLabels[selectedBook.category]}
                                    </GlassBadge>
                                    <GlassBadge>{selectedBook.pages} pages</GlassBadge>
                                </div>
                            </div>

                            {selectedBook.unlocked ? (
                                <>
                                    <p className="text-white/70 text-sm mb-6">
                                        {selectedBook.description}
                                    </p>

                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-white/60">Reading Progress</span>
                                            <span className="text-amber-400">
                                                {Math.round(
                                                    (selectedBook.readPages / selectedBook.pages) * 100
                                                )}
                                                %
                                            </span>
                                        </div>
                                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-500 transition-all duration-300"
                                                style={{
                                                    width: `${(selectedBook.readPages / selectedBook.pages) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <GlassButton
                                        variant="primary"
                                        className="w-full"
                                        onClick={() => handleRead(selectedBook)}
                                    >
                                        📖 Read
                                    </GlassButton>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="text-4xl mb-4 block">🔒</span>
                                    <p className="text-white/60 text-sm">
                                        This book is locked. Complete certain quests or explore
                                        specific areas to unlock it.
                                    </p>
                                </div>
                            )}
                        </GlassCard>
                    ) : (
                        <GlassCard className="text-center py-16">
                            <span className="text-5xl mb-4 block">📚</span>
                            <p className="text-white/60">Select a book to view details</p>
                        </GlassCard>
                    )}
                </div>
            </div>

            {/* Bookshelf Tip */}
            <GlassCard size="sm" className="mt-6">
                <div className="flex items-center gap-4">
                    <span className="text-3xl">💡</span>
                    <div>
                        <h4 className="font-semibold text-white">Tip</h4>
                        <p className="text-sm text-white/50">
                            Reading books can unlock new dialogue options with NPCs and reveal
                            hidden quest locations!
                        </p>
                    </div>
                </div>
            </GlassCard>
        </GlassContainer>
    )
}
