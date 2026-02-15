import { useState, useEffect } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { auth } from '../../firebase'
import { onAuthStateChanged, type User } from 'firebase/auth'

export const Route = createFileRoute('/_test/items-manager')({
    component: ItemsManagerPage,
})

const API_BASE = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || 'http://127.0.0.1:5001/anify-oiy-ai/us-central1/api'

interface ItemDefinition {
    id: string
    name: string
    description: string
    type: string
    rarity: string
    data?: string
}

type ItemType = 'weapon' | 'armor' | 'consumable' | 'material' | 'quest'
type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

const ITEM_TYPES: { value: ItemType; label: string; icon: string; color: string }[] = [
    { value: 'weapon', label: 'Weapon', icon: '⚔️', color: 'from-red-500 to-orange-500' },
    { value: 'armor', label: 'Armor', icon: '🛡️', color: 'from-blue-500 to-cyan-500' },
    { value: 'consumable', label: 'Consumable', icon: '🧪', color: 'from-green-500 to-emerald-500' },
    { value: 'material', label: 'Material', icon: '💎', color: 'from-amber-500 to-yellow-500' },
    { value: 'quest', label: 'Quest', icon: '📜', color: 'from-purple-500 to-pink-500' },
]

const RARITIES: { value: ItemRarity; label: string; bgClass: string; textClass: string; borderClass: string; glowClass: string }[] = [
    { value: 'common', label: 'Common', bgClass: 'bg-gray-100', textClass: 'text-gray-700', borderClass: 'border-gray-300', glowClass: '' },
    { value: 'uncommon', label: 'Uncommon', bgClass: 'bg-green-100', textClass: 'text-green-700', borderClass: 'border-green-400', glowClass: '' },
    { value: 'rare', label: 'Rare', bgClass: 'bg-blue-100', textClass: 'text-blue-700', borderClass: 'border-blue-400', glowClass: 'shadow-blue-200' },
    { value: 'epic', label: 'Epic', bgClass: 'bg-purple-100', textClass: 'text-purple-700', borderClass: 'border-purple-400', glowClass: 'shadow-purple-300' },
    { value: 'legendary', label: 'Legendary', bgClass: 'bg-gradient-to-r from-yellow-100 to-orange-100', textClass: 'text-amber-700', borderClass: 'border-amber-400', glowClass: 'shadow-amber-300 shadow-lg' },
]

function ItemsManagerPage() {
    const [user, setUser] = useState<User | null>(null)
    const [items, setItems] = useState<ItemDefinition[]>([])
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    // Create form state
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [newItemName, setNewItemName] = useState('')
    const [newItemDesc, setNewItemDesc] = useState('')
    const [newItemType, setNewItemType] = useState<ItemType>('material')
    const [newItemRarity, setNewItemRarity] = useState<ItemRarity>('common')
    const [newItemData, setNewItemData] = useState('')

    // Edit state
    const [editingItem, setEditingItem] = useState<ItemDefinition | null>(null)

    // Filter state
    const [filterType, setFilterType] = useState<ItemType | 'all'>('all')
    const [filterRarity, setFilterRarity] = useState<ItemRarity | 'all'>('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        fetchItems()
    }, [])

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [toast])

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type })
    }

    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'x-user-id': user?.uid || 'test-user-anonymous',
    })

    const fetchItems = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/items`, {
                headers: getHeaders(),
            })
            const data = await res.json()
            if (res.ok) {
                setItems(data.items || [])
            } else {
                showToast(`Failed to fetch items: ${data.error}`, 'error')
            }
        } catch (error: any) {
            showToast(`Network error: ${error.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    const createItem = async () => {
        if (!newItemName.trim()) {
            showToast('Please enter item name', 'error')
            return
        }
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/items`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    name: newItemName.trim(),
                    description: newItemDesc.trim() || 'No description',
                    type: newItemType,
                    rarity: newItemRarity,
                    ...(newItemData.trim() && { data: newItemData.trim() }),
                }),
            })
            const data = await res.json()
            if (res.ok) {
                showToast(`Created item: ${data.name}`, 'success')
                fetchItems()
                resetCreateForm()
            } else {
                showToast(`Create failed: ${data.error}`, 'error')
            }
        } catch (error: any) {
            showToast(`Network error: ${error.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    const deleteItem = async (itemId: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/items/${itemId}`, {
                method: 'DELETE',
                headers: getHeaders(),
            })
            if (res.ok) {
                showToast('Item deleted successfully', 'success')
                fetchItems()
            } else {
                const data = await res.json()
                showToast(`Delete failed: ${data.error}`, 'error')
            }
        } catch (error: any) {
            showToast(`Network error: ${error.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    const resetCreateForm = () => {
        setNewItemName('')
        setNewItemDesc('')
        setNewItemType('material')
        setNewItemRarity('common')
        setNewItemData('')
        setShowCreateForm(false)
    }

    const getTypeConfig = (type: string) => {
        return ITEM_TYPES.find(t => t.value === type) || ITEM_TYPES[3]
    }

    const getRarityConfig = (rarity: string) => {
        return RARITIES.find(r => r.value === rarity) || RARITIES[0]
    }

    const filteredItems = items.filter(item => {
        const matchesType = filterType === 'all' || item.type === filterType
        const matchesRarity = filterRarity === 'all' || item.rarity === filterRarity
        const matchesSearch = !searchQuery ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesType && matchesRarity && matchesSearch
    })

    const groupedItems = filteredItems.reduce((acc, item) => {
        const type = item.type
        if (!acc[type]) acc[type] = []
        acc[type].push(item)
        return acc
    }, {} as Record<string, ItemDefinition[]>)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-2xl transform transition-all duration-300 ${toast.type === 'success'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                    }`}>
                    <div className="flex items-center gap-2">
                        <span>{toast.type === 'success' ? '✅' : '❌'}</span>
                        <span className="font-medium">{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <span className="text-2xl">📦</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Items Manager</h1>
                                <p className="text-sm text-gray-400">Manage your game items catalog</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-green-400 text-sm font-medium">{user.email || 'Logged In'}</span>
                                </div>
                            ) : (
                                <Link to="/login" className="bg-blue-500/20 border border-blue-500/30 px-4 py-2 rounded-full text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition">
                                    Login
                                </Link>
                            )}
                            <Link to="/game-data-test" className="text-gray-400 hover:text-white transition text-sm">
                                ← Back to Game Data
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Action Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search items by name or ID..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as ItemType | 'all')}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition cursor-pointer"
                        >
                            <option value="all" className="bg-slate-800">All Types</option>
                            {ITEM_TYPES.map(t => (
                                <option key={t.value} value={t.value} className="bg-slate-800">{t.icon} {t.label}</option>
                            ))}
                        </select>
                        <select
                            value={filterRarity}
                            onChange={(e) => setFilterRarity(e.target.value as ItemRarity | 'all')}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition cursor-pointer"
                        >
                            <option value="all" className="bg-slate-800">All Rarities</option>
                            {RARITIES.map(r => (
                                <option key={r.value} value={r.value} className="bg-slate-800">{r.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={fetchItems}
                            disabled={loading}
                            className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white hover:bg-white/10 disabled:opacity-50 transition flex items-center gap-2"
                        >
                            <span className={loading ? 'animate-spin' : ''}>🔄</span>
                            Refresh
                        </button>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl px-6 py-3 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition shadow-lg shadow-purple-500/30 flex items-center gap-2"
                        >
                            <span>✨</span>
                            Create Item
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-white">{items.length}</div>
                        <div className="text-sm text-gray-400">Total Items</div>
                    </div>
                    {ITEM_TYPES.map(type => (
                        <div key={type.value} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                            <div className="text-2xl mb-1">{type.icon}</div>
                            <div className="text-xl font-bold text-white">{items.filter(i => i.type === type.value).length}</div>
                            <div className="text-xs text-gray-400">{type.label}s</div>
                        </div>
                    ))}
                </div>

                {/* Items Grid */}
                {loading && items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400">Loading items...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-6xl mb-4">📭</span>
                        <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
                        <p className="text-gray-400 mb-6">
                            {items.length === 0 ? 'Create your first item to get started!' : 'Try adjusting your filters'}
                        </p>
                        {items.length === 0 && (
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl px-6 py-3 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition"
                            >
                                ✨ Create First Item
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedItems).map(([type, typeItems]) => {
                            const typeConfig = getTypeConfig(type)
                            return (
                                <div key={type}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${typeConfig.color} flex items-center justify-center shadow-lg`}>
                                            <span className="text-xl">{typeConfig.icon}</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-white">{typeConfig.label}s</h2>
                                        <span className="text-sm text-gray-400">({typeItems.length})</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {typeItems.map(item => {
                                            const rarityConfig = getRarityConfig(item.rarity)
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 hover:bg-white/10 transition-all duration-300 ${rarityConfig.glowClass}`}
                                                >
                                                    {/* Rarity indicator */}
                                                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${typeConfig.color}`}></div>

                                                    <div className="p-5">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${typeConfig.color} flex items-center justify-center shadow-lg`}>
                                                                    <span className="text-2xl">{typeConfig.icon}</span>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-white text-lg">{item.name}</h3>
                                                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${rarityConfig.bgClass} ${rarityConfig.textClass}`}>
                                                                        {rarityConfig.label}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>

                                                        <div className="text-xs text-gray-500 font-mono bg-black/20 rounded px-2 py-1 mb-3 truncate">
                                                            ID: {item.id}
                                                        </div>

                                                        {item.data && (
                                                            <div className="text-xs text-purple-400 bg-purple-500/10 rounded px-2 py-1 mb-3 truncate">
                                                                📊 {item.data}
                                                            </div>
                                                        )}

                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingItem(item)
                                                                    setNewItemName(item.name)
                                                                    setNewItemDesc(item.description)
                                                                    setNewItemType(item.type as ItemType)
                                                                    setNewItemRarity(item.rarity as ItemRarity)
                                                                    setNewItemData(item.data || '')
                                                                    setShowCreateForm(true)
                                                                }}
                                                                className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() => deleteItem(item.id)}
                                                                className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-500/30 transition"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>

            {/* Create/Edit Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">
                                    {editingItem ? '✏️ Edit Item' : '✨ Create New Item'}
                                </h2>
                                <button
                                    onClick={() => {
                                        resetCreateForm()
                                        setEditingItem(null)
                                    }}
                                    className="text-gray-400 hover:text-white transition text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Item Name</label>
                                <input
                                    type="text"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    placeholder="Enter item name..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={newItemDesc}
                                    onChange={(e) => setNewItemDesc(e.target.value)}
                                    placeholder="Enter item description..."
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition resize-none"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {ITEM_TYPES.map(type => (
                                        <button
                                            key={type.value}
                                            onClick={() => setNewItemType(type.value)}
                                            className={`p-3 rounded-xl border transition flex flex-col items-center gap-1 ${newItemType === type.value
                                                    ? `bg-gradient-to-br ${type.color} border-transparent text-white shadow-lg`
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                                }`}
                                        >
                                            <span className="text-xl">{type.icon}</span>
                                            <span className="text-xs">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rarity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Rarity</label>
                                <div className="flex gap-2 flex-wrap">
                                    {RARITIES.map(rarity => (
                                        <button
                                            key={rarity.value}
                                            onClick={() => setNewItemRarity(rarity.value)}
                                            className={`px-4 py-2 rounded-xl border transition font-medium text-sm ${newItemRarity === rarity.value
                                                    ? `${rarity.bgClass} ${rarity.textClass} ${rarity.borderClass}`
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                                }`}
                                        >
                                            {rarity.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Data */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Custom Data <span className="text-gray-500">(Optional JSON)</span>
                                </label>
                                <input
                                    type="text"
                                    value={newItemData}
                                    onChange={(e) => setNewItemData(e.target.value)}
                                    placeholder='{"atk": 10, "crit": 5}'
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 flex gap-3">
                            <button
                                onClick={() => {
                                    resetCreateForm()
                                    setEditingItem(null)
                                }}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-gray-300 font-medium hover:bg-white/10 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createItem}
                                disabled={loading || !newItemName.trim()}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl px-5 py-3 text-white font-semibold hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-purple-500/30"
                            >
                                {loading ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Item'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
