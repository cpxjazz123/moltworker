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

export const Route = createFileRoute('/_game/_trpg/reincarnation')({
    component: ReincarnationPage,
})

interface ReincarnationBonus {
    id: string
    name: string
    icon: string
    description: string
    type: 'permanent' | 'starting'
    unlocked: boolean
    cost: number
}

interface LifeRecord {
    id: string
    lifeNumber: number
    maxLevel: number
    playtime: string
    achievements: number
    date: string
}

const mockBonuses: ReincarnationBonus[] = [
    {
        id: '1',
        name: 'Soul Memory',
        icon: '🧠',
        description: 'Retain 10% of your previous stats',
        type: 'permanent',
        unlocked: true,
        cost: 0,
    },
    {
        id: '2',
        name: 'Golden Start',
        icon: '🪙',
        description: 'Start with 10,000 gold',
        type: 'starting',
        unlocked: true,
        cost: 100,
    },
    {
        id: '3',
        name: 'Experienced Soul',
        icon: '✨',
        description: '+50% EXP gain until level 30',
        type: 'starting',
        unlocked: true,
        cost: 200,
    },
    {
        id: '4',
        name: 'Karmic Bond',
        icon: '💕',
        description: 'Keep companion affinity levels',
        type: 'permanent',
        unlocked: false,
        cost: 500,
    },
    {
        id: '5',
        name: 'Skill Resonance',
        icon: '⚔️',
        description: 'Unlock one skill from previous life',
        type: 'starting',
        unlocked: false,
        cost: 300,
    },
    {
        id: '6',
        name: 'Lucky Soul',
        icon: '🍀',
        description: '+25% rare item drop rate permanently',
        type: 'permanent',
        unlocked: false,
        cost: 1000,
    },
]

const mockLifeRecords: LifeRecord[] = [
    {
        id: '1',
        lifeNumber: 1,
        maxLevel: 45,
        playtime: '24h 35m',
        achievements: 23,
        date: '2024-10-15',
    },
    {
        id: '2',
        lifeNumber: 2,
        maxLevel: 60,
        playtime: '48h 12m',
        achievements: 45,
        date: '2024-11-20',
    },
    {
        id: '3',
        lifeNumber: 3,
        maxLevel: 72,
        playtime: '65h 48m',
        achievements: 67,
        date: '2024-12-01',
    },
]

function ReincarnationPage() {
    const [selectedBonuses, setSelectedBonuses] = useState<string[]>(['1'])
    const [showConfirm, setShowConfirm] = useState(false)
    const [currentKarma] = useState(850)
    const [currentLevel] = useState(75)
    const [currentPlaytime] = useState('82h 15m')

    const currentLife = mockLifeRecords.length + 1
    const karmaGain = Math.floor(currentLevel * 10 + mockLifeRecords.length * 50)

    const toggleBonus = (bonusId: string) => {
        const bonus = mockBonuses.find((b) => b.id === bonusId)
        if (!bonus || !bonus.unlocked) return

        if (selectedBonuses.includes(bonusId)) {
            setSelectedBonuses(selectedBonuses.filter((id) => id !== bonusId))
        } else {
            setSelectedBonuses([...selectedBonuses, bonusId])
        }
    }

    const totalCost = selectedBonuses.reduce((acc, id) => {
        const bonus = mockBonuses.find((b) => b.id === id)
        return acc + (bonus?.cost || 0)
    }, 0)

    return (
        <GlassContainer>
            <PageHeader title="Reincarnation" backTo="/adventure" />

            {/* Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
                    <GlassCard className="w-full max-w-md">
                        <div className="text-center mb-6">
                            <span className="text-6xl mb-4 block">🌀</span>
                            <h2 className="text-2xl font-bold text-amber-400">
                                Begin New Life?
                            </h2>
                            <p className="text-white/60 mt-2">
                                Your soul will be reborn with the selected bonuses.
                                This action cannot be undone.
                            </p>
                        </div>

                        <div className="bg-black/20 rounded-xl p-4 mb-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-white/60">Karma Gained</span>
                                <span className="text-green-400 font-bold">+{karmaGain}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-white/60">Karma Cost</span>
                                <span className="text-red-400 font-bold">-{totalCost}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-white/10">
                                <span className="text-white">Final Karma</span>
                                <span className="text-amber-400 font-bold">
                                    {currentKarma + karmaGain - totalCost}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <GlassButton
                                variant="secondary"
                                className="flex-1"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </GlassButton>
                            <GlassButton variant="primary" className="flex-1">
                                🌀 Reincarnate
                            </GlassButton>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-6">
                <GlassCard size="sm" variant="glow" className="flex items-center gap-3">
                    <span className="text-2xl">🌀</span>
                    <div>
                        <div className="text-lg font-bold text-amber-400">Life #{currentLife}</div>
                        <div className="text-xs text-white/60">Current</div>
                    </div>
                </GlassCard>
                <GlassCard size="sm" className="flex items-center gap-3">
                    <span className="text-2xl">⭐</span>
                    <div>
                        <div className="text-lg font-bold text-purple-400">{currentKarma}</div>
                        <div className="text-xs text-white/60">Karma</div>
                    </div>
                </GlassCard>
                <GlassCard size="sm" className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                        <div className="text-lg font-bold text-blue-400">Lv. {currentLevel}</div>
                        <div className="text-xs text-white/60">Current Level</div>
                    </div>
                </GlassCard>
                <GlassCard size="sm" className="flex items-center gap-3">
                    <span className="text-2xl">⏱️</span>
                    <div>
                        <div className="text-lg font-bold text-green-400">{currentPlaytime}</div>
                        <div className="text-xs text-white/60">Playtime</div>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bonuses Selection */}
                <div className="lg:col-span-2">
                    <GlassCard>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>✨</span> Reincarnation Bonuses
                        </h3>
                        <p className="text-white/60 text-sm mb-6">
                            Select bonuses to carry into your next life. Each bonus has a karma cost.
                        </p>

                        <div className="space-y-3">
                            {mockBonuses.map((bonus) => (
                                <div
                                    key={bonus.id}
                                    onClick={() => toggleBonus(bonus.id)}
                                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                                        !bonus.unlocked
                                            ? 'opacity-50 bg-black/20 cursor-not-allowed'
                                            : selectedBonuses.includes(bonus.id)
                                              ? 'bg-amber-500/20 border border-amber-500/50'
                                              : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                    }`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                            bonus.type === 'permanent'
                                                ? 'bg-purple-500/20 border border-purple-500/50'
                                                : 'bg-blue-500/20 border border-blue-500/50'
                                        }`}
                                    >
                                        <span className="text-2xl">{bonus.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-white">
                                                {bonus.name}
                                            </span>
                                            <GlassBadge
                                                className={
                                                    bonus.type === 'permanent'
                                                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                                                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                }
                                            >
                                                {bonus.type === 'permanent' ? 'Permanent' : 'Starting'}
                                            </GlassBadge>
                                        </div>
                                        <p className="text-sm text-white/60">{bonus.description}</p>
                                    </div>
                                    <div className="text-right">
                                        {bonus.unlocked ? (
                                            <>
                                                <div className="text-amber-400 font-bold">
                                                    {bonus.cost > 0 ? `${bonus.cost} ⭐` : 'Free'}
                                                </div>
                                                {selectedBonuses.includes(bonus.id) && (
                                                    <span className="text-green-400 text-sm">✓ Selected</span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-red-400 text-sm">🔒 Locked</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="mt-6 p-4 bg-black/20 rounded-xl">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-white/60">Total Karma Cost</span>
                                <span className="text-2xl font-bold text-amber-400">{totalCost} ⭐</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-white/60">Karma After Reincarnation</span>
                                <span
                                    className={`text-lg font-bold ${
                                        currentKarma + karmaGain - totalCost >= 0
                                            ? 'text-green-400'
                                            : 'text-red-400'
                                    }`}
                                >
                                    {currentKarma + karmaGain - totalCost} ⭐
                                </span>
                            </div>
                            <GlassButton
                                variant="primary"
                                className="w-full"
                                onClick={() => setShowConfirm(true)}
                                disabled={currentKarma + karmaGain - totalCost < 0}
                            >
                                🌀 Begin Reincarnation (+{karmaGain} Karma)
                            </GlassButton>
                        </div>
                    </GlassCard>
                </div>

                {/* Life History */}
                <div className="lg:col-span-1">
                    <GlassCard variant="glow" className="sticky top-4">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>📜</span> Past Lives
                        </h3>

                        {mockLifeRecords.length > 0 ? (
                            <div className="space-y-3">
                                {mockLifeRecords
                                    .slice()
                                    .reverse()
                                    .map((record) => (
                                        <div
                                            key={record.id}
                                            className="p-3 bg-black/20 rounded-xl border border-white/10"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-white">
                                                    Life #{record.lifeNumber}
                                                </span>
                                                <span className="text-xs text-white/40">
                                                    {record.date}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                                <div>
                                                    <div className="text-amber-400 font-bold">
                                                        Lv.{record.maxLevel}
                                                    </div>
                                                    <div className="text-white/40">Max Level</div>
                                                </div>
                                                <div>
                                                    <div className="text-blue-400 font-bold">
                                                        {record.playtime}
                                                    </div>
                                                    <div className="text-white/40">Time</div>
                                                </div>
                                                <div>
                                                    <div className="text-green-400 font-bold">
                                                        {record.achievements}
                                                    </div>
                                                    <div className="text-white/40">Achieve</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <span className="text-4xl block mb-2">🌱</span>
                                <p className="text-white/50 text-sm">This is your first life</p>
                            </div>
                        )}

                        {/* Progress to Next Tier */}
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white/60 text-sm">Soul Tier Progress</span>
                                <GlassBadge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                    Tier 2
                                </GlassBadge>
                            </div>
                            <GlassProgressBar value={currentKarma} max={1000} size="sm" />
                            <p className="text-xs text-white/40 mt-1">
                                {1000 - currentKarma} karma to Tier 3
                            </p>
                        </div>
                    </GlassCard>

                    {/* Tips */}
                    <GlassCard size="sm" className="mt-4">
                        <h4 className="text-sm font-semibold text-white/60 mb-2">About Reincarnation</h4>
                        <ul className="text-xs text-white/50 space-y-1">
                            <li>• Higher level = more karma gained</li>
                            <li>• Permanent bonuses last forever</li>
                            <li>• Starting bonuses only affect new life</li>
                            <li>• Unlock new bonuses with higher soul tiers</li>
                        </ul>
                    </GlassCard>
                </div>
            </div>
        </GlassContainer>
    )
}
