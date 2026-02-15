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

export const Route = createFileRoute('/_game/_trpg/battle')({
    component: BattlePage,
})

interface Combatant {
    id: string
    name: string
    avatar: string
    hp: number
    maxHp: number
    mp: number
    maxMp: number
    atk: number
    def: number
    spd: number
    isEnemy: boolean
    status?: string[]
}

interface Skill {
    id: string
    name: string
    icon: string
    type: 'attack' | 'magic' | 'heal' | 'buff' | 'debuff'
    mpCost: number
    damage?: number
    description: string
    target: 'single' | 'all' | 'self' | 'ally'
}

const mockParty: Combatant[] = [
    {
        id: 'p1',
        name: 'Hero',
        avatar: '🦸',
        hp: 850,
        maxHp: 1000,
        mp: 200,
        maxMp: 300,
        atk: 150,
        def: 100,
        spd: 120,
        isEnemy: false,
    },
    {
        id: 'p2',
        name: 'Elena',
        avatar: '⚔️',
        hp: 720,
        maxHp: 800,
        mp: 150,
        maxMp: 200,
        atk: 180,
        def: 80,
        spd: 140,
        isEnemy: false,
        status: ['ATK Up'],
    },
    {
        id: 'p3',
        name: 'Iris',
        avatar: '🌿',
        hp: 600,
        maxHp: 600,
        mp: 400,
        maxMp: 500,
        atk: 80,
        def: 60,
        spd: 100,
        isEnemy: false,
    },
]

const mockEnemies: Combatant[] = [
    {
        id: 'e1',
        name: 'Dark Knight',
        avatar: '🗡️',
        hp: 1500,
        maxHp: 2000,
        mp: 100,
        maxMp: 100,
        atk: 200,
        def: 150,
        spd: 90,
        isEnemy: true,
    },
    {
        id: 'e2',
        name: 'Shadow Mage',
        avatar: '🧙',
        hp: 800,
        maxHp: 800,
        mp: 300,
        maxMp: 300,
        atk: 100,
        def: 50,
        spd: 110,
        isEnemy: true,
        status: ['Shield'],
    },
]

const skills: Skill[] = [
    {
        id: 's1',
        name: 'Slash',
        icon: '⚔️',
        type: 'attack',
        mpCost: 0,
        damage: 100,
        description: 'Basic physical attack',
        target: 'single',
    },
    {
        id: 's2',
        name: 'Fireball',
        icon: '🔥',
        type: 'magic',
        mpCost: 30,
        damage: 150,
        description: 'Deals fire damage to one enemy',
        target: 'single',
    },
    {
        id: 's3',
        name: 'Heal',
        icon: '💚',
        type: 'heal',
        mpCost: 40,
        description: 'Restores HP to one ally',
        target: 'ally',
    },
    {
        id: 's4',
        name: 'War Cry',
        icon: '📢',
        type: 'buff',
        mpCost: 25,
        description: 'Increases party ATK',
        target: 'all',
    },
    {
        id: 's5',
        name: 'Meteor',
        icon: '☄️',
        type: 'magic',
        mpCost: 80,
        damage: 200,
        description: 'Deals massive damage to all enemies',
        target: 'all',
    },
    {
        id: 's6',
        name: 'Guard',
        icon: '🛡️',
        type: 'buff',
        mpCost: 0,
        description: 'Reduce damage taken this turn',
        target: 'self',
    },
]

function BattlePage() {
    const [party] = useState<Combatant[]>(mockParty)
    const [enemies] = useState<Combatant[]>(mockEnemies)
    const [selectedAction, setSelectedAction] = useState<'attack' | 'skill' | 'item' | 'defend' | null>(null)
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
    const [selectedTarget, setSelectedTarget] = useState<Combatant | null>(null)
    const [currentTurn, _setCurrentTurn] = useState<Combatant>(party[0])
    const [battleLog, setBattleLog] = useState<string[]>([
        'Battle Start!',
        "Hero's turn",
    ])
    const [turnOrder] = useState<Combatant[]>([...party, ...enemies].sort((a, b) => b.spd - a.spd))

    const handleAction = (action: 'attack' | 'skill' | 'item' | 'defend') => {
        setSelectedAction(action)
        setSelectedSkill(null)
        setSelectedTarget(null)

        if (action === 'defend') {
            setBattleLog((prev) => [...prev, `${currentTurn.name} is defending!`])
            // Move to next turn
        }
    }

    const handleSkillSelect = (skill: Skill) => {
        setSelectedSkill(skill)
        if (skill.target === 'self' || skill.target === 'all') {
            // Execute immediately for self/all targets
            setBattleLog((prev) => [...prev, `${currentTurn.name} uses ${skill.name}!`])
        }
    }

    const handleTargetSelect = (target: Combatant) => {
        setSelectedTarget(target)
        if (selectedAction === 'attack') {
            setBattleLog((prev) => [...prev, `${currentTurn.name} attacks ${target.name}!`])
        } else if (selectedSkill) {
            setBattleLog((prev) => [...prev, `${currentTurn.name} uses ${selectedSkill.name} on ${target.name}!`])
        }
        // Reset selections
        setSelectedAction(null)
        setSelectedSkill(null)
        setSelectedTarget(null)
    }

    const getHpColor = (hp: number, maxHp: number) => {
        const ratio = hp / maxHp
        if (ratio > 0.5) return 'bg-green-500'
        if (ratio > 0.25) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <GlassContainer>
            <PageHeader title="Battle" backTo="/adventure" />

            <div className="space-y-6">
                {/* Enemy Section */}
                <GlassCard>
                    <h3 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2">
                        <span>👹</span> Enemies
                    </h3>
                    <div className="flex flex-wrap justify-center gap-6">
                        {enemies.map((enemy) => (
                            <div
                                key={enemy.id}
                                className={`relative cursor-pointer transition-all duration-300 ${
                                    selectedAction === 'attack' || (selectedSkill?.target === 'single' && selectedSkill?.type !== 'heal')
                                        ? 'hover:scale-105 hover:ring-2 hover:ring-red-400 rounded-xl'
                                        : ''
                                } ${selectedTarget?.id === enemy.id ? 'ring-2 ring-red-400 rounded-xl' : ''}`}
                                onClick={() => {
                                    if (selectedAction === 'attack' || (selectedSkill?.target === 'single' && selectedSkill?.type !== 'heal')) {
                                        handleTargetSelect(enemy)
                                    }
                                }}
                            >
                                <div className="w-24 h-24 rounded-xl bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center mb-2 mx-auto">
                                    <span className="text-4xl">{enemy.avatar}</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-medium text-sm">{enemy.name}</p>
                                    <div className="w-20 h-2 bg-black/30 rounded-full overflow-hidden mt-1 mx-auto">
                                        <div
                                            className={`h-full ${getHpColor(enemy.hp, enemy.maxHp)} transition-all duration-300`}
                                            style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-white/60 mt-1">
                                        {enemy.hp}/{enemy.maxHp}
                                    </p>
                                    {enemy.status && enemy.status.length > 0 && (
                                        <div className="flex justify-center gap-1 mt-1">
                                            {enemy.status.map((s, idx) => (
                                                <GlassBadge key={idx} className="text-xs px-1">
                                                    {s}
                                                </GlassBadge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Battle Log */}
                <GlassCard size="sm" className="max-h-32 overflow-y-auto">
                    <div className="space-y-1">
                        {battleLog.slice(-5).map((log, idx) => (
                            <p
                                key={idx}
                                className={`text-sm ${idx === battleLog.slice(-5).length - 1 ? 'text-amber-400' : 'text-white/50'}`}
                            >
                                {log}
                            </p>
                        ))}
                    </div>
                </GlassCard>

                {/* Party Section */}
                <GlassCard variant="glow">
                    <h3 className="text-sm font-semibold text-green-400 mb-4 flex items-center gap-2">
                        <span>⚔️</span> Party
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {party.map((member) => (
                            <div
                                key={member.id}
                                className={`p-4 rounded-xl transition-all duration-300 ${
                                    currentTurn.id === member.id
                                        ? 'bg-amber-500/20 border-2 border-amber-500/50'
                                        : 'bg-black/20 border border-white/10'
                                } ${
                                    selectedSkill?.target === 'ally' || selectedSkill?.type === 'heal'
                                        ? 'cursor-pointer hover:bg-green-500/20'
                                        : ''
                                }`}
                                onClick={() => {
                                    if (selectedSkill?.target === 'ally' || selectedSkill?.type === 'heal') {
                                        handleTargetSelect(member)
                                    }
                                }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                        <span className="text-2xl">{member.avatar}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-white">{member.name}</span>
                                            {currentTurn.id === member.id && (
                                                <GlassBadge className="bg-amber-500/30 text-amber-400 text-xs">
                                                    TURN
                                                </GlassBadge>
                                            )}
                                        </div>
                                        {member.status && member.status.length > 0 && (
                                            <div className="flex gap-1 mt-1">
                                                {member.status.map((s, idx) => (
                                                    <span key={idx} className="text-xs text-green-400">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-green-400">HP</span>
                                            <span className="text-white/60">
                                                {member.hp}/{member.maxHp}
                                            </span>
                                        </div>
                                        <GlassProgressBar
                                            value={member.hp}
                                            max={member.maxHp}
                                            size="sm"
                                            showLabel={false}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-blue-400">MP</span>
                                            <span className="text-white/60">
                                                {member.mp}/{member.maxMp}
                                            </span>
                                        </div>
                                        <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all duration-300"
                                                style={{ width: `${(member.mp / member.maxMp) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Action Menu */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Main Actions */}
                    <GlassCard>
                        <h3 className="text-sm font-semibold text-white/60 mb-4">Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <GlassButton
                                variant={selectedAction === 'attack' ? 'primary' : 'secondary'}
                                onClick={() => handleAction('attack')}
                                className="flex flex-col items-center py-4"
                            >
                                <span className="text-2xl mb-1">⚔️</span>
                                <span>Attack</span>
                            </GlassButton>
                            <GlassButton
                                variant={selectedAction === 'skill' ? 'primary' : 'secondary'}
                                onClick={() => handleAction('skill')}
                                className="flex flex-col items-center py-4"
                            >
                                <span className="text-2xl mb-1">✨</span>
                                <span>Skill</span>
                            </GlassButton>
                            <GlassButton
                                variant={selectedAction === 'item' ? 'primary' : 'secondary'}
                                onClick={() => handleAction('item')}
                                className="flex flex-col items-center py-4"
                            >
                                <span className="text-2xl mb-1">🎒</span>
                                <span>Item</span>
                            </GlassButton>
                            <GlassButton
                                variant={selectedAction === 'defend' ? 'primary' : 'secondary'}
                                onClick={() => handleAction('defend')}
                                className="flex flex-col items-center py-4"
                            >
                                <span className="text-2xl mb-1">🛡️</span>
                                <span>Defend</span>
                            </GlassButton>
                        </div>
                    </GlassCard>

                    {/* Skill List */}
                    {selectedAction === 'skill' && (
                        <GlassCard>
                            <h3 className="text-sm font-semibold text-white/60 mb-4">Skills</h3>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                {skills.map((skill) => (
                                    <button
                                        key={skill.id}
                                        onClick={() => handleSkillSelect(skill)}
                                        disabled={currentTurn.mp < skill.mpCost}
                                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                                            selectedSkill?.id === skill.id
                                                ? 'bg-amber-500/30 border-amber-500/50'
                                                : currentTurn.mp < skill.mpCost
                                                  ? 'bg-white/5 border-white/5 opacity-50'
                                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        <span className="text-xl">{skill.icon}</span>
                                        <div className="text-left flex-1">
                                            <p className="text-sm text-white">{skill.name}</p>
                                            <p className="text-xs text-blue-400">
                                                MP: {skill.mpCost}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </GlassCard>
                    )}
                </div>

                {/* Turn Order */}
                <GlassCard size="sm">
                    <h4 className="text-xs font-semibold text-white/40 mb-2">Turn Order</h4>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {turnOrder.map((combatant, idx) => (
                            <div
                                key={combatant.id}
                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                    idx === 0
                                        ? 'border-amber-500 bg-amber-500/20'
                                        : combatant.isEnemy
                                          ? 'border-red-500/50 bg-red-500/10'
                                          : 'border-green-500/50 bg-green-500/10'
                                }`}
                            >
                                <span className="text-lg">{combatant.avatar}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Battle Controls */}
                <div className="flex justify-center gap-4">
                    <GlassButton variant="secondary">⏸️ Pause</GlassButton>
                    <GlassButton variant="secondary">⚡ Auto Battle</GlassButton>
                    <GlassButton variant="danger">🏃 Flee</GlassButton>
                </div>
            </div>
        </GlassContainer>
    )
}
