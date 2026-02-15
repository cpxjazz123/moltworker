import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
    GlassCard,
    GlassContainer,
    PageHeader,
    GlassBadge,
    GlassButton,
} from '../../../components/ui/glass-card'

export const Route = createFileRoute('/_game/_companion/mail')({
    component: MailPage,
})

interface Mail {
    id: string
    sender: string
    senderAvatar: string
    subject: string
    preview: string
    content: string
    date: string
    read: boolean
    type: 'system' | 'friend' | 'guild' | 'event'
    attachments?: { type: string; name: string; amount?: number }[]
    claimed?: boolean
}

const mockMails: Mail[] = [
    {
        id: '1',
        sender: 'System',
        senderAvatar: '📢',
        subject: 'Daily Login Reward',
        preview: 'You have received your daily login bonus...',
        content:
            'Congratulations! You have logged in for 7 consecutive days. As a reward, here are some gifts for you. Keep up the great work, adventurer!',
        date: '2024-12-10',
        read: false,
        type: 'system',
        attachments: [
            { type: 'Gold', name: 'Gold Coins', amount: 500 },
            { type: 'Item', name: 'Energy Potion', amount: 3 },
        ],
        claimed: false,
    },
    {
        id: '2',
        sender: 'Elena',
        senderAvatar: '⚔️',
        subject: 'About our training yesterday',
        preview: 'Thank you for practicing with me...',
        content:
            'Dear adventurer, thank you for taking the time to train with me yesterday. I noticed your sword skills have improved significantly! I hope we can continue our training sessions. I\'ve attached a small gift as a token of appreciation.',
        date: '2024-12-09',
        read: true,
        type: 'friend',
        attachments: [{ type: 'Item', name: 'Friendship Charm', amount: 1 }],
        claimed: true,
    },
    {
        id: '3',
        sender: 'Guild Master',
        senderAvatar: '🏰',
        subject: 'Guild Weekly Summary',
        preview: 'This week our guild has made great progress...',
        content:
            'Hello guild members! This week we completed 15 guild quests and earned a total of 5000 guild points. Special thanks to everyone who participated in the raid. Here are this week\'s rewards!',
        date: '2024-12-08',
        read: true,
        type: 'guild',
        attachments: [
            { type: 'Gold', name: 'Guild Coins', amount: 200 },
            { type: 'EXP', name: 'Guild EXP', amount: 1000 },
        ],
        claimed: true,
    },
    {
        id: '4',
        sender: 'Event Team',
        senderAvatar: '🎉',
        subject: 'Winter Festival Begins!',
        preview: 'The annual Winter Festival is now live...',
        content:
            'The Winter Festival has officially begun! Participate in special events to earn exclusive rewards. Don\'t miss out on the limited-time items and costumes. Here\'s a starter pack to help you get started!',
        date: '2024-12-07',
        read: false,
        type: 'event',
        attachments: [
            { type: 'Item', name: 'Festival Ticket', amount: 5 },
            { type: 'Item', name: 'Snowflake Token', amount: 10 },
        ],
        claimed: false,
    },
    {
        id: '5',
        sender: 'Zephyr',
        senderAvatar: '🌀',
        subject: 'Found something interesting!',
        preview: 'While exploring the ancient ruins, I found...',
        content:
            'Hey! I was exploring the Ancient Ruins and found this mysterious artifact. I thought you might be interested in studying it. Let me know what you discover!',
        date: '2024-12-06',
        read: true,
        type: 'friend',
        attachments: [{ type: 'Item', name: 'Mysterious Fragment', amount: 1 }],
        claimed: false,
    },
]

const typeColors = {
    system: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    friend: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    guild: 'bg-green-500/20 text-green-400 border-green-500/30',
    event: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

const typeLabels = {
    system: 'System',
    friend: 'Friend',
    guild: 'Guild',
    event: 'Event',
}

function MailPage() {
    const [selectedMail, setSelectedMail] = useState<Mail | null>(null)
    const [mails, setMails] = useState<Mail[]>(mockMails)
    const [filter, setFilter] = useState<string>('all')

    const filteredMails = mails.filter((mail) => {
        if (filter === 'all') return true
        if (filter === 'unread') return !mail.read
        return mail.type === filter
    })

    const unreadCount = mails.filter((m) => !m.read).length
    const unclaimedCount = mails.filter((m) => m.attachments && !m.claimed).length

    const handleRead = (mail: Mail) => {
        setMails(mails.map((m) => (m.id === mail.id ? { ...m, read: true } : m)))
        setSelectedMail({ ...mail, read: true })
    }

    const handleClaim = (mailId: string) => {
        setMails(mails.map((m) => (m.id === mailId ? { ...m, claimed: true } : m)))
        if (selectedMail?.id === mailId) {
            setSelectedMail({ ...selectedMail, claimed: true })
        }
    }

    const handleDelete = (mailId: string) => {
        setMails(mails.filter((m) => m.id !== mailId))
        if (selectedMail?.id === mailId) {
            setSelectedMail(null)
        }
    }

    return (
        <GlassContainer>
            <PageHeader title="Mailbox" backTo="/character" />

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-6">
                <GlassCard size="sm" className="flex items-center gap-3">
                    <span className="text-2xl">📬</span>
                    <div>
                        <div className="text-lg font-bold text-white">{mails.length}</div>
                        <div className="text-xs text-white/60">Total</div>
                    </div>
                </GlassCard>
                {unreadCount > 0 && (
                    <GlassCard size="sm" variant="glow" className="flex items-center gap-3">
                        <span className="text-2xl">📩</span>
                        <div>
                            <div className="text-lg font-bold text-amber-400">{unreadCount}</div>
                            <div className="text-xs text-white/60">Unread</div>
                        </div>
                    </GlassCard>
                )}
                {unclaimedCount > 0 && (
                    <GlassCard size="sm" className="flex items-center gap-3">
                        <span className="text-2xl">🎁</span>
                        <div>
                            <div className="text-lg font-bold text-green-400">{unclaimedCount}</div>
                            <div className="text-xs text-white/60">Unclaimed</div>
                        </div>
                    </GlassCard>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'unread', 'system', 'friend', 'guild', 'event'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                            filter === type
                                ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        {type === 'all'
                            ? 'All'
                            : type === 'unread'
                              ? 'Unread'
                              : typeLabels[type as keyof typeof typeLabels]}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mail List */}
                <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
                    {filteredMails.map((mail) => (
                        <GlassCard
                            key={mail.id}
                            variant="hover"
                            size="sm"
                            className={`cursor-pointer ${!mail.read ? 'border-l-4 border-l-amber-500' : ''} ${
                                selectedMail?.id === mail.id ? 'ring-1 ring-amber-400' : ''
                            }`}
                            onClick={() => handleRead(mail)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-lg">{mail.senderAvatar}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className={`font-semibold text-sm ${!mail.read ? 'text-white' : 'text-white/70'}`}
                                        >
                                            {mail.sender}
                                        </span>
                                        <GlassBadge className={`text-xs ${typeColors[mail.type]}`}>
                                            {typeLabels[mail.type]}
                                        </GlassBadge>
                                    </div>
                                    <p
                                        className={`text-sm truncate ${!mail.read ? 'text-white/80' : 'text-white/50'}`}
                                    >
                                        {mail.subject}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-white/40">{mail.date}</span>
                                        {mail.attachments && !mail.claimed && (
                                            <span className="text-xs text-green-400">🎁</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}

                    {filteredMails.length === 0 && (
                        <GlassCard className="text-center py-8">
                            <span className="text-3xl mb-2 block">📭</span>
                            <p className="text-white/50 text-sm">No mails found</p>
                        </GlassCard>
                    )}
                </div>

                {/* Mail Content */}
                <div className="lg:col-span-2">
                    {selectedMail ? (
                        <GlassCard variant="glow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                                        <span className="text-2xl">{selectedMail.senderAvatar}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            {selectedMail.subject}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-white/60">
                                            <span>From: {selectedMail.sender}</span>
                                            <span>•</span>
                                            <span>{selectedMail.date}</span>
                                            <GlassBadge className={typeColors[selectedMail.type]}>
                                                {typeLabels[selectedMail.type]}
                                            </GlassBadge>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(selectedMail.id)}
                                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-red-400"
                                    >
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>

                            <div className="border-t border-white/10 py-6">
                                <p className="text-white/80 leading-relaxed">{selectedMail.content}</p>
                            </div>

                            {selectedMail.attachments && selectedMail.attachments.length > 0 && (
                                <div className="border-t border-white/10 pt-4">
                                    <h4 className="text-sm font-semibold text-white/60 mb-3">
                                        Attachments
                                    </h4>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        {selectedMail.attachments.map((attachment, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10"
                                            >
                                                <span className="text-xl">
                                                    {attachment.type === 'Gold'
                                                        ? '🪙'
                                                        : attachment.type === 'EXP'
                                                          ? '✨'
                                                          : '📦'}
                                                </span>
                                                <span className="text-white text-sm">
                                                    {attachment.name}
                                                </span>
                                                {attachment.amount && (
                                                    <span className="text-amber-400 text-sm font-medium">
                                                        x{attachment.amount}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {!selectedMail.claimed ? (
                                        <GlassButton
                                            variant="primary"
                                            onClick={() => handleClaim(selectedMail.id)}
                                        >
                                            Claim All Rewards
                                        </GlassButton>
                                    ) : (
                                        <div className="text-green-400 text-sm flex items-center gap-2">
                                            <span>✓</span> Rewards claimed
                                        </div>
                                    )}
                                </div>
                            )}
                        </GlassCard>
                    ) : (
                        <GlassCard className="text-center py-16">
                            <span className="text-5xl mb-4 block">📧</span>
                            <p className="text-white/60">Select a mail to read</p>
                        </GlassCard>
                    )}
                </div>
            </div>
        </GlassContainer>
    )
}
