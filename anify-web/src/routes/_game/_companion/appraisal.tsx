import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
    GlassCard,
    GlassContainer,
    PageHeader,
    GlassBadge,
    GlassButton,
} from '../../../components/ui/glass-card'

export const Route = createFileRoute('/_game/_companion/appraisal')({
    component: AppraisalPage,
})

interface UnidentifiedItem {
    id: string
    name: string
    icon: string
    type: 'weapon' | 'armor' | 'accessory' | 'artifact'
    cost: number
}

interface AppraisalResult {
    name: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    stats: { name: string; value: number }[]
    description: string
    value: number
}

const mockUnidentifiedItems: UnidentifiedItem[] = [
    { id: '1', name: 'Unknown Sword', icon: '⚔️', type: 'weapon', cost: 100 },
    { id: '2', name: 'Mysterious Ring', icon: '💍', type: 'accessory', cost: 150 },
    { id: '3', name: 'Ancient Artifact', icon: '🏺', type: 'artifact', cost: 500 },
    { id: '4', name: 'Dusty Armor', icon: '🛡️', type: 'armor', cost: 200 },
    { id: '5', name: 'Strange Amulet', icon: '📿', type: 'accessory', cost: 180 },
]

const mockResults: Record<string, AppraisalResult> = {
    '1': {
        name: 'Flame Blade',
        rarity: 'epic',
        stats: [
            { name: 'ATK', value: 280 },
            { name: 'Fire DMG', value: 50 },
        ],
        description: 'A sword forged in dragon fire, imbued with flames',
        value: 5000,
    },
    '2': {
        name: 'Ring of Wisdom',
        rarity: 'rare',
        stats: [
            { name: 'INT', value: 30 },
            { name: 'MP', value: 100 },
        ],
        description: 'An ancient ring that enhances magical abilities',
        value: 2000,
    },
    '3': {
        name: 'Cursed Relic',
        rarity: 'legendary',
        stats: [
            { name: 'All Stats', value: 50 },
            { name: 'Curse Resist', value: -30 },
        ],
        description: 'A powerful artifact with a dangerous curse',
        value: 50000,
    },
    '4': {
        name: 'Guardian Plate',
        rarity: 'rare',
        stats: [
            { name: 'DEF', value: 200 },
            { name: 'HP', value: 300 },
        ],
        description: 'Heavy armor worn by ancient guardians',
        value: 3000,
    },
    '5': {
        name: 'Lucky Charm',
        rarity: 'common',
        stats: [
            { name: 'LUCK', value: 15 },
            { name: 'Gold Find', value: 10 },
        ],
        description: 'A simple charm that brings minor fortune',
        value: 500,
    },
}

const rarityColors = {
    common: 'border-gray-500/50 bg-gray-500/10',
    rare: 'border-blue-500/50 bg-blue-500/10',
    epic: 'border-purple-500/50 bg-purple-500/10',
    legendary: 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_20px_rgba(255,215,0,0.2)]',
}

const rarityTextColors = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
}

function AppraisalPage() {
    const [items, setItems] = useState<UnidentifiedItem[]>(mockUnidentifiedItems)
    const [selectedItem, setSelectedItem] = useState<UnidentifiedItem | null>(null)
    const [isAppraising, setIsAppraising] = useState(false)
    const [result, setResult] = useState<AppraisalResult | null>(null)
    const [gold] = useState(10000)

    const handleAppraise = () => {
        if (!selectedItem) return

        setIsAppraising(true)
        setResult(null)

        // Simulate appraisal process
        setTimeout(() => {
            setIsAppraising(false)
            setResult(mockResults[selectedItem.id])
            setItems(items.filter((i) => i.id !== selectedItem.id))
        }, 2000)
    }

    const handleClose = () => {
        setSelectedItem(null)
        setResult(null)
    }

    return (
        <GlassContainer>
            <PageHeader title="Appraisal" backTo="/character" />

            {/* Gold Display */}
            <div className="flex justify-end mb-6">
                <GlassCard size="sm" variant="glow" className="flex items-center gap-3">
                    <span className="text-2xl">🪙</span>
                    <div>
                        <div className="text-lg font-bold text-amber-400">{gold.toLocaleString()}</div>
                        <div className="text-xs text-white/60">Gold</div>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Unidentified Items */}
                <div>
                    <GlassCard>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>❓</span> Unidentified Items
                        </h3>

                        {items.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {items.map((item) => (
                                    <GlassCard
                                        key={item.id}
                                        variant="hover"
                                        size="sm"
                                        className={`cursor-pointer text-center ${
                                            selectedItem?.id === item.id ? 'ring-2 ring-amber-400' : ''
                                        }`}
                                        onClick={() => {
                                            setSelectedItem(item)
                                            setResult(null)
                                        }}
                                    >
                                        <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-black/30 flex items-center justify-center border border-white/10">
                                            <span className="text-2xl">{item.icon}</span>
                                        </div>
                                        <p className="text-sm text-white/70 truncate">{item.name}</p>
                                        <p className="text-xs text-amber-400 mt-1">
                                            🪙 {item.cost}
                                        </p>
                                    </GlassCard>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <span className="text-4xl mb-4 block">📦</span>
                                <p className="text-white/60">No unidentified items</p>
                            </div>
                        )}
                    </GlassCard>
                </div>

                {/* Appraisal Station */}
                <div>
                    <GlassCard variant="glow">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>🔮</span> Appraisal Station
                        </h3>

                        {/* Appraisal Circle */}
                        <div className="relative aspect-square max-w-[300px] mx-auto mb-6">
                            {/* Outer ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-pulse" />
                            <div className="absolute inset-4 rounded-full border border-amber-500/20" />
                            <div className="absolute inset-8 rounded-full border border-amber-500/10" />

                            {/* Center platform */}
                            <div className="absolute inset-12 rounded-full bg-black/40 border border-amber-500/40 flex items-center justify-center">
                                {isAppraising ? (
                                    <div className="text-center">
                                        <div className="animate-spin text-5xl mb-2">✨</div>
                                        <p className="text-amber-400 text-sm">Appraising...</p>
                                    </div>
                                ) : result ? (
                                    <div className="text-center p-4">
                                        <span className="text-5xl block mb-2">
                                            {selectedItem?.icon}
                                        </span>
                                        <p className={`font-bold ${rarityTextColors[result.rarity]}`}>
                                            {result.name}
                                        </p>
                                    </div>
                                ) : selectedItem ? (
                                    <div className="text-center">
                                        <span className="text-5xl block mb-2 opacity-50">
                                            {selectedItem.icon}
                                        </span>
                                        <p className="text-white/50 text-sm">Ready to appraise</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <span className="text-4xl block mb-2 opacity-30">❓</span>
                                        <p className="text-white/30 text-sm">Place an item</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Result */}
                        {result && (
                            <div className={`p-4 rounded-xl mb-4 ${rarityColors[result.rarity]}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className={`font-bold ${rarityTextColors[result.rarity]}`}>
                                        {result.name}
                                    </h4>
                                    <GlassBadge className={rarityColors[result.rarity]}>
                                        {result.rarity.toUpperCase()}
                                    </GlassBadge>
                                </div>
                                <p className="text-sm text-white/60 mb-3">{result.description}</p>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {result.stats.map((stat, idx) => (
                                        <div
                                            key={idx}
                                            className="flex justify-between text-sm bg-black/20 px-2 py-1 rounded"
                                        >
                                            <span className="text-white/60">{stat.name}</span>
                                            <span
                                                className={
                                                    stat.value >= 0 ? 'text-green-400' : 'text-red-400'
                                                }
                                            >
                                                {stat.value >= 0 ? '+' : ''}
                                                {stat.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/50 text-sm">Market Value</span>
                                    <span className="text-amber-400 font-bold">
                                        🪙 {result.value.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            {result ? (
                                <>
                                    <GlassButton variant="primary" className="flex-1">
                                        Add to Inventory
                                    </GlassButton>
                                    <GlassButton variant="secondary" onClick={handleClose}>
                                        Close
                                    </GlassButton>
                                </>
                            ) : (
                                <>
                                    <GlassButton
                                        variant="primary"
                                        className="flex-1"
                                        onClick={handleAppraise}
                                        disabled={!selectedItem || isAppraising}
                                    >
                                        {isAppraising
                                            ? 'Appraising...'
                                            : selectedItem
                                              ? `Appraise (🪙 ${selectedItem.cost})`
                                              : 'Select an Item'}
                                    </GlassButton>
                                    <GlassButton
                                        variant="secondary"
                                        disabled={items.length === 0}
                                    >
                                        Appraise All
                                    </GlassButton>
                                </>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Tips */}
            <GlassCard size="sm" className="mt-6">
                <h4 className="text-sm font-semibold text-white/60 mb-2">Tips</h4>
                <ul className="text-xs text-white/50 space-y-1">
                    <li>• Higher level items may reveal rarer equipment</li>
                    <li>• Artifacts have a chance to contain cursed items</li>
                    <li>• Use "Appraise All" for a 10% discount on bulk appraisals</li>
                </ul>
            </GlassCard>
        </GlassContainer>
    )
}
