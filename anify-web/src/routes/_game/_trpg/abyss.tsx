import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
    GlassCard,
    GlassContainer,
    PageHeader,
    GlassBadge,
    GlassButton,
    GlassProgressBar,
} from '../../../components/ui/glass-card'

export const Route = createFileRoute('/_game/_trpg/abyss')({
    component: AbyssPage,
})

interface AbyssFloor {
    id: string
    floor: number
    name: string
    icon: string
    difficulty: 'easy' | 'normal' | 'hard' | 'nightmare'
    enemies: { name: string; icon: string }[]
    rewards: { name: string; icon: string; amount?: number }[]
    cleared: boolean
    stars: number
    maxStars: number
    unlocked: boolean
    bossFloor?: boolean
}

const mockFloors: AbyssFloor[] = [
    {
        id: '1',
        floor: 1,
        name: 'Entrance Hall',
        icon: '🚪',
        difficulty: 'easy',
        enemies: [
            { name: 'Slime', icon: '🟢' },
            { name: 'Goblin', icon: '👺' },
        ],
        rewards: [
            { name: 'Gold', icon: '🪙', amount: 500 },
            { name: 'EXP', icon: '✨', amount: 100 },
        ],
        cleared: true,
        stars: 3,
        maxStars: 3,
        unlocked: true,
    },
    {
        id: '2',
        floor: 2,
        name: 'Dark Corridor',
        icon: '🌑',
        difficulty: 'easy',
        enemies: [
            { name: 'Shadow', icon: '👤' },
            { name: 'Bat', icon: '🦇' },
        ],
        rewards: [
            { name: 'Gold', icon: '🪙', amount: 750 },
            { name: 'EXP', icon: '✨', amount: 150 },
        ],
        cleared: true,
        stars: 3,
        maxStars: 3,
        unlocked: true,
    },
    {
        id: '3',
        floor: 3,
        name: 'Crystal Cave',
        icon: '💎',
        difficulty: 'normal',
        enemies: [
            { name: 'Crystal Golem', icon: '🗿' },
            { name: 'Cave Spider', icon: '🕷️' },
        ],
        rewards: [
            { name: 'Gold', icon: '🪙', amount: 1000 },
            { name: 'Crystal', icon: '💎', amount: 5 },
        ],
        cleared: true,
        stars: 2,
        maxStars: 3,
        unlocked: true,
    },
    {
        id: '4',
        floor: 4,
        name: 'Flame Chamber',
        icon: '🔥',
        difficulty: 'normal',
        enemies: [
            { name: 'Fire Elemental', icon: '🔥' },
            { name: 'Magma Hound', icon: '🐕' },
        ],
        rewards: [
            { name: 'Gold', icon: '🪙', amount: 1500 },
            { name: 'Fire Stone', icon: '🔴', amount: 3 },
        ],
        cleared: true,
        stars: 1,
        maxStars: 3,
        unlocked: true,
    },
    {
        id: '5',
        floor: 5,
        name: 'Guardian\'s Gate',
        icon: '🚧',
        difficulty: 'hard',
        enemies: [{ name: 'Gate Guardian', icon: '🗡️' }],
        rewards: [
            { name: 'Gold', icon: '🪙', amount: 3000 },
            { name: 'Rare Chest', icon: '📦', amount: 1 },
        ],
        cleared: false,
        stars: 0,
        maxStars: 3,
        unlocked: true,
        bossFloor: true,
    },
    {
        id: '6',
        floor: 6,
        name: 'Frozen Depths',
        icon: '❄️',
        difficulty: 'hard',
        enemies: [
            { name: 'Ice Wraith', icon: '👻' },
            { name: 'Frost Giant', icon: '🧌' },
        ],
        rewards: [
            { name: 'Gold', icon: '🪙', amount: 2000 },
            { name: 'Ice Crystal', icon: '🧊', amount: 5 },
        ],
        cleared: false,
        stars: 0,
        maxStars: 3,
        unlocked: false,
    },
    {
        id: '7',
        floor: 7,
        name: 'Shadow Realm',
        icon: '🌌',
        difficulty: 'hard',
        enemies: [
            { name: 'Shadow Knight', icon: '🗡️' },
            { name: 'Dark Mage', icon: '🧙' },
        ],
        rewards: [
            { name: 'Gold', icon: '🪙', amount: 2500 },
            { name: 'Shadow Essence', icon: '💜', amount: 3 },
        ],
        cleared: false,
        stars: 0,
        maxStars: 3,
        unlocked: false,
    },
    {
        id: '8',
        floor: 8,
        name: 'Dragon\'s Lair',
        icon: '🐉',
        difficulty: 'nightmare',
        enemies: [{ name: 'Ancient Dragon', icon: '🐲' }],
        rewards: [
            { name: 'Gold', icon: '🪙', amount: 10000 },
            { name: 'Dragon Scale', icon: '🐉', amount: 1 },
            { name: 'Legendary Chest', icon: '🎁', amount: 1 },
        ],
        cleared: false,
        stars: 0,
        maxStars: 3,
        unlocked: false,
        bossFloor: true,
    },
]

const difficultyColors = {
    easy: 'text-green-400 bg-green-500/20 border-green-500/30',
    normal: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    hard: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    nightmare: 'text-red-400 bg-red-500/20 border-red-500/30',
}

function AbyssPage() {
    const [selectedFloor, setSelectedFloor] = useState<AbyssFloor | null>(null)
    const [showPartySelect, setShowPartySelect] = useState(false)

    const totalStars = mockFloors.reduce((acc, f) => acc + f.stars, 0)
    const maxStars = mockFloors.reduce((acc, f) => acc + f.maxStars, 0)
    const clearedFloors = mockFloors.filter((f) => f.cleared).length
    const currentFloor = mockFloors.find((f) => !f.cleared && f.unlocked)?.floor || 1

    const handleChallenge = () => {
        if (!selectedFloor || !selectedFloor.unlocked) return
        setShowPartySelect(true)
    }

    return (
        <GlassContainer>
            <PageHeader title="Abyss" backTo="/adventure" />

            {/* Party Select Modal */}
            {showPartySelect && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
                    <GlassCard className="w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Select Party</h2>
                        <div className="space-y-3 mb-6">
                            {['Hero', 'Elena', 'Iris'].map((member, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                        <span className="text-xl">
                                            {['🦸', '⚔️', '🌿'][idx]}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{member}</p>
                                        <p className="text-xs text-white/50">Lv. {30 - idx * 3}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-5 h-5 rounded"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <GlassButton
                                variant="secondary"
                                className="flex-1"
                                onClick={() => setShowPartySelect(false)}
                            >
                                Cancel
                            </GlassButton>
                            <GlassButton variant="primary" className="flex-1">
                                Start Challenge
                            </GlassButton>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-6">
                <GlassCard size="sm" variant="glow" className="flex items-center gap-3">
                    <span className="text-2xl">🏔️</span>
                    <div>
                        <div className="text-lg font-bold text-amber-400">Floor {currentFloor}</div>
                        <div className="text-xs text-white/60">Current</div>
                    </div>
                </GlassCard>
                <GlassCard size="sm" className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                        <div className="text-lg font-bold text-green-400">
                            {clearedFloors}/{mockFloors.length}
                        </div>
                        <div className="text-xs text-white/60">Cleared</div>
                    </div>
                </GlassCard>
                <GlassCard size="sm" className="flex items-center gap-3">
                    <span className="text-2xl">⭐</span>
                    <div>
                        <div className="text-lg font-bold text-yellow-400">
                            {totalStars}/{maxStars}
                        </div>
                        <div className="text-xs text-white/60">Stars</div>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Floor List */}
                <div className="lg:col-span-2">
                    <GlassCard>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>🌀</span> Abyss Floors
                        </h3>
                        <div className="space-y-3">
                            {mockFloors.map((floor) => (
                                <div
                                    key={floor.id}
                                    onClick={() => setSelectedFloor(floor)}
                                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                                        !floor.unlocked
                                            ? 'opacity-50 bg-black/20'
                                            : selectedFloor?.id === floor.id
                                              ? 'bg-amber-500/20 border border-amber-500/50'
                                              : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                    } ${floor.bossFloor ? 'ring-1 ring-red-500/50' : ''}`}
                                >
                                    <div
                                        className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                                            floor.cleared
                                                ? 'bg-green-500/20 border-2 border-green-500/50'
                                                : floor.unlocked
                                                  ? 'bg-white/10 border-2 border-white/20'
                                                  : 'bg-black/30 border-2 border-white/5'
                                        }`}
                                    >
                                        {floor.unlocked ? (
                                            <span className="text-2xl">{floor.icon}</span>
                                        ) : (
                                            <span className="text-2xl">🔒</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-white font-semibold">
                                                F{floor.floor}: {floor.name}
                                            </span>
                                            {floor.bossFloor && (
                                                <GlassBadge className="bg-red-500/20 text-red-400 border-red-500/30">
                                                    BOSS
                                                </GlassBadge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <GlassBadge
                                                className={difficultyColors[floor.difficulty]}
                                            >
                                                {floor.difficulty.toUpperCase()}
                                            </GlassBadge>
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: floor.maxStars }).map(
                                                    (_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`text-sm ${
                                                                i < floor.stars
                                                                    ? 'text-yellow-400'
                                                                    : 'text-white/20'
                                                            }`}
                                                        >
                                                            ⭐
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {floor.cleared && (
                                        <span className="text-green-400 text-xl">✓</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Floor Details */}
                <div className="lg:col-span-1">
                    {selectedFloor ? (
                        <GlassCard variant="glow" className="sticky top-4">
                            <div className="text-center mb-6">
                                <div
                                    className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center border-2 ${
                                        selectedFloor.bossFloor
                                            ? 'bg-red-500/20 border-red-500/50'
                                            : 'bg-white/10 border-white/20'
                                    }`}
                                >
                                    <span className="text-4xl">{selectedFloor.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    Floor {selectedFloor.floor}
                                </h3>
                                <p className="text-white/60">{selectedFloor.name}</p>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <GlassBadge
                                        className={difficultyColors[selectedFloor.difficulty]}
                                    >
                                        {selectedFloor.difficulty.toUpperCase()}
                                    </GlassBadge>
                                    {selectedFloor.bossFloor && (
                                        <GlassBadge className="bg-red-500/20 text-red-400 border-red-500/30">
                                            BOSS
                                        </GlassBadge>
                                    )}
                                </div>
                            </div>

                            {/* Enemies */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-white/60 mb-3">
                                    Enemies
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedFloor.enemies.map((enemy, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 px-3 py-2 bg-red-500/10 rounded-xl border border-red-500/30"
                                        >
                                            <span>{enemy.icon}</span>
                                            <span className="text-sm text-white">{enemy.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rewards */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-white/60 mb-3">
                                    Rewards
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedFloor.rewards.map((reward, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 rounded-xl border border-amber-500/30"
                                        >
                                            <span>{reward.icon}</span>
                                            <span className="text-sm text-white">
                                                {reward.name}
                                            </span>
                                            {reward.amount && (
                                                <span className="text-xs text-amber-400 ml-auto">
                                                    x{reward.amount}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Stars */}
                            {selectedFloor.cleared && (
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white/60 text-sm">Best Result</span>
                                        <div className="flex gap-1">
                                            {Array.from({ length: selectedFloor.maxStars }).map(
                                                (_, i) => (
                                                    <span
                                                        key={i}
                                                        className={
                                                            i < selectedFloor.stars
                                                                ? 'text-yellow-400'
                                                                : 'text-white/20'
                                                        }
                                                    >
                                                        ⭐
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Challenge Button */}
                            {selectedFloor.unlocked ? (
                                <GlassButton
                                    variant="primary"
                                    className="w-full"
                                    onClick={handleChallenge}
                                >
                                    {selectedFloor.cleared ? '🔄 Retry' : '⚔️ Challenge'}
                                </GlassButton>
                            ) : (
                                <div className="text-center py-4">
                                    <span className="text-3xl block mb-2">🔒</span>
                                    <p className="text-white/50 text-sm">
                                        Clear Floor {selectedFloor.floor - 1} to unlock
                                    </p>
                                </div>
                            )}
                        </GlassCard>
                    ) : (
                        <GlassCard className="text-center py-16">
                            <span className="text-5xl mb-4 block">🌀</span>
                            <p className="text-white/60">Select a floor to view details</p>
                        </GlassCard>
                    )}
                </div>
            </div>

            {/* Progress */}
            <GlassCard className="mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span>🏆</span> Season Progress
                    </h3>
                    <GlassBadge>Season 1</GlassBadge>
                </div>
                <div className="mb-2">
                    <GlassProgressBar value={clearedFloors} max={mockFloors.length} size="md" />
                </div>
                <div className="flex justify-between text-sm text-white/50">
                    <span>Progress: {clearedFloors}/{mockFloors.length} Floors</span>
                    <span>Resets in: 14 days</span>
                </div>
            </GlassCard>
        </GlassContainer>
    )
}
