import { useState, useEffect } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { auth } from '../../firebase'
import { onAuthStateChanged, type User } from 'firebase/auth'

export const Route = createFileRoute('/_test/game-data-test')({
    component: GameDataTestPage,
})

type TestResult = {
    success: boolean
    message: string
    timestamp: Date
}

// API base URL - adjust for your Firebase project
const API_BASE = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || 'http://127.0.0.1:5001/anify-oiy-ai/us-central1/api'

interface UserAttributes {
    hp: number
    maxHp: number
    atk: number
    def: number
    level: number
    exp: number
    gold: number
}

interface InventoryItem {
    itemId: string
    quantity: number
}

function GameDataTestPage() {
    const [user, setUser] = useState<User | null>(null)
    const [testResults, setTestResults] = useState<TestResult[]>([])
    const [loading, setLoading] = useState(false)

    // User attributes state
    const [attributes, setAttributes] = useState<UserAttributes | null>(null)
    const [hpChange, setHpChange] = useState('')
    const [goldChange, setGoldChange] = useState('')
    const [expChange, setExpChange] = useState('')

    // Inventory state
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [itemIdToAdd, setItemIdToAdd] = useState('')
    const [quantityToAdd, setQuantityToAdd] = useState('1')
    const [itemIdToRemove, setItemIdToRemove] = useState('')
    const [quantityToRemove, setQuantityToRemove] = useState('1')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            if (currentUser) {
                addTestResult(true, `User logged in: ${currentUser.email || currentUser.uid}`)
            }
        })
        return () => unsubscribe()
    }, [])

    const addTestResult = (success: boolean, message: string) => {
        setTestResults((prev) => [
            {
                success,
                message,
                timestamp: new Date(),
            },
            ...prev,
        ])
    }

    const clearResults = () => {
        setTestResults([])
    }

    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'x-user-id': user?.uid || 'test-user-anonymous',
    })

    // =========== User Attributes APIs ===========

    const fetchAttributes = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/user/attributes`, {
                headers: getHeaders(),
            })
            const data = await res.json()
            if (res.ok) {
                setAttributes(data)
                addTestResult(true, `✅ Fetched attributes: HP=${data.hp}/${data.maxHp}, ATK=${data.atk}, DEF=${data.def}, Level=${data.level}, EXP=${data.exp}, Gold=${data.gold}`)
            } else {
                addTestResult(false, `❌ Fetch failed: ${data.error}`)
            }
        } catch (error: any) {
            addTestResult(false, `❌ Network error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const updateAttributes = async (updates: Partial<UserAttributes>) => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/user/attributes`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(updates),
            })
            const data = await res.json()
            if (res.ok) {
                setAttributes(data)
                addTestResult(true, `✅ Updated attributes: ${JSON.stringify(updates)}`)
            } else {
                addTestResult(false, `❌ Update failed: ${data.error}`)
            }
        } catch (error: any) {
            addTestResult(false, `❌ Network error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const resetAttributes = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/user/attributes/reset`, {
                method: 'POST',
                headers: getHeaders(),
            })
            const data = await res.json()
            if (res.ok) {
                setAttributes(data)
                addTestResult(true, `✅ Attributes reset to defaults`)
            } else {
                addTestResult(false, `❌ Reset failed: ${data.error}`)
            }
        } catch (error: any) {
            addTestResult(false, `❌ Network error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleHpChange = () => {
        const delta = parseInt(hpChange)
        if (isNaN(delta) || !attributes) return
        updateAttributes({ hp: Math.max(0, Math.min(attributes.maxHp, attributes.hp + delta)) })
        setHpChange('')
    }

    const handleGoldChange = () => {
        const delta = parseInt(goldChange)
        if (isNaN(delta) || !attributes) return
        updateAttributes({ gold: Math.max(0, attributes.gold + delta) })
        setGoldChange('')
    }

    const handleExpChange = () => {
        const delta = parseInt(expChange)
        if (isNaN(delta) || !attributes) return
        updateAttributes({ exp: attributes.exp + delta })
        setExpChange('')
    }

    // =========== Inventory APIs ===========

    const fetchInventory = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/user/inventory`, {
                headers: getHeaders(),
            })
            const data = await res.json()
            if (res.ok) {
                setInventory(data.items || [])
                addTestResult(true, `✅ Fetched inventory: ${data.items?.length || 0} items`)
            } else {
                addTestResult(false, `❌ Fetch failed: ${data.error}`)
            }
        } catch (error: any) {
            addTestResult(false, `❌ Network error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const addInventoryItem = async () => {
        if (!itemIdToAdd.trim()) {
            addTestResult(false, 'Please enter item ID')
            return
        }
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/user/inventory/add`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    itemId: itemIdToAdd.trim(),
                    quantity: parseInt(quantityToAdd) || 1,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                addTestResult(true, `✅ Added ${quantityToAdd}x ${itemIdToAdd}, new quantity: ${data.quantity}`)
                fetchInventory()
                setItemIdToAdd('')
                setQuantityToAdd('1')
            } else {
                addTestResult(false, `❌ Add failed: ${data.error}`)
            }
        } catch (error: any) {
            addTestResult(false, `❌ Network error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const removeInventoryItem = async () => {
        if (!itemIdToRemove.trim()) {
            addTestResult(false, 'Please enter item ID')
            return
        }
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/user/inventory/remove`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    itemId: itemIdToRemove.trim(),
                    quantity: parseInt(quantityToRemove) || 1,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                addTestResult(true, `✅ Removed ${data.removed}x ${itemIdToRemove}, remaining: ${data.quantity}`)
                fetchInventory()
                setItemIdToRemove('')
                setQuantityToRemove('1')
            } else {
                addTestResult(false, `❌ Remove failed: ${data.error}`)
            }
        } catch (error: any) {
            addTestResult(false, `❌ Network error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                                <span className="text-2xl">🎮</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Game Data Test</h1>
                                <p className="text-sm text-gray-400">Test your game API endpoints</p>
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
                            <Link to="/items-manager" className="bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-full text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition flex items-center gap-2">
                                📦 Items Manager
                            </Link>
                            <Link to="/" className="text-gray-400 hover:text-white transition text-sm">
                                ← Home
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* User Status Alert */}
                {!user && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <div>
                            <p className="text-amber-400 font-medium">Not logged in</p>
                            <p className="text-amber-400/70 text-sm">
                                Please <Link to="/login" className="underline font-bold hover:text-amber-300">login</Link> first. Currently using anonymous test user ID.
                            </p>
                        </div>
                    </div>
                )}

                {/* Current Attributes Display */}
                {attributes && (
                    <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                📊
                            </span>
                            Current Attributes
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition group">
                                <div className="text-3xl mb-1">❤️</div>
                                <div className="text-2xl font-bold text-red-400 group-hover:scale-110 transition">{attributes.hp}/{attributes.maxHp}</div>
                                <div className="text-sm text-gray-400">HP</div>
                                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full transition-all" style={{ width: `${(attributes.hp / attributes.maxHp) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition group">
                                <div className="text-3xl mb-1">⚔️</div>
                                <div className="text-2xl font-bold text-orange-400 group-hover:scale-110 transition">{attributes.atk}</div>
                                <div className="text-sm text-gray-400">ATK</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition group">
                                <div className="text-3xl mb-1">🛡️</div>
                                <div className="text-2xl font-bold text-blue-400 group-hover:scale-110 transition">{attributes.def}</div>
                                <div className="text-sm text-gray-400">DEF</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition group">
                                <div className="text-3xl mb-1">⭐</div>
                                <div className="text-2xl font-bold text-yellow-400 group-hover:scale-110 transition">Lv.{attributes.level}</div>
                                <div className="text-sm text-gray-400">Level</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition group">
                                <div className="text-3xl mb-1">✨</div>
                                <div className="text-2xl font-bold text-purple-400 group-hover:scale-110 transition">{attributes.exp}</div>
                                <div className="text-sm text-gray-400">EXP</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition group">
                                <div className="text-3xl mb-1">🪙</div>
                                <div className="text-2xl font-bold text-amber-400 group-hover:scale-110 transition">{attributes.gold}</div>
                                <div className="text-sm text-gray-400">Gold</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Attributes */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                📊
                            </span>
                            User Attributes
                        </h2>
                        <div className="space-y-4">
                            <button
                                onClick={fetchAttributes}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-xl hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 font-semibold transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                <span className={loading ? 'animate-spin' : ''}>🔄</span>
                                {loading ? 'Loading...' : 'Fetch Attributes'}
                            </button>
                            <button
                                onClick={resetAttributes}
                                disabled={loading}
                                className="w-full bg-white/5 border border-white/10 text-gray-300 px-4 py-3 rounded-xl hover:bg-white/10 disabled:opacity-50 font-medium transition"
                            >
                                🔃 Reset to Defaults
                            </button>

                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={hpChange}
                                        onChange={(e) => setHpChange(e.target.value)}
                                        placeholder="HP +/-"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition"
                                    />
                                    <button
                                        onClick={handleHpChange}
                                        disabled={loading || !attributes}
                                        className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-5 rounded-xl hover:from-red-400 hover:to-rose-400 disabled:opacity-50 font-medium transition shadow-lg shadow-red-500/20"
                                    >
                                        Apply
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={goldChange}
                                        onChange={(e) => setGoldChange(e.target.value)}
                                        placeholder="Gold +/-"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition"
                                    />
                                    <button
                                        onClick={handleGoldChange}
                                        disabled={loading || !attributes}
                                        className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-5 rounded-xl hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 font-medium transition shadow-lg shadow-amber-500/20"
                                    >
                                        Apply
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={expChange}
                                        onChange={(e) => setExpChange(e.target.value)}
                                        placeholder="EXP +/-"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
                                    />
                                    <button
                                        onClick={handleExpChange}
                                        disabled={loading || !attributes}
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 rounded-xl hover:from-purple-400 hover:to-pink-400 disabled:opacity-50 font-medium transition shadow-lg shadow-purple-500/20"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                🎒
                            </span>
                            Inventory
                        </h2>
                        <div className="space-y-4">
                            <button
                                onClick={fetchInventory}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 font-semibold transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                            >
                                <span className={loading ? 'animate-spin' : ''}>🔄</span>
                                {loading ? 'Loading...' : 'Fetch Inventory'}
                            </button>

                            {inventory.length > 0 && (
                                <div className="bg-black/20 rounded-xl p-4 max-h-36 overflow-auto space-y-2">
                                    {inventory.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg">
                                            <span className="font-mono text-sm text-gray-300">{item.itemId}</span>
                                            <span className="text-amber-400 font-semibold">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={itemIdToAdd}
                                        onChange={(e) => setItemIdToAdd(e.target.value)}
                                        placeholder="Item ID"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition"
                                    />
                                    <input
                                        type="number"
                                        value={quantityToAdd}
                                        onChange={(e) => setQuantityToAdd(e.target.value)}
                                        placeholder="Qty"
                                        className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-green-500/50 transition"
                                        min="1"
                                    />
                                    <button
                                        onClick={addInventoryItem}
                                        disabled={loading}
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 rounded-xl hover:from-green-400 hover:to-emerald-400 disabled:opacity-50 font-medium transition shadow-lg shadow-green-500/20"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={itemIdToRemove}
                                        onChange={(e) => setItemIdToRemove(e.target.value)}
                                        placeholder="Item ID"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition"
                                    />
                                    <input
                                        type="number"
                                        value={quantityToRemove}
                                        onChange={(e) => setQuantityToRemove(e.target.value)}
                                        placeholder="Qty"
                                        className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-red-500/50 transition"
                                        min="1"
                                    />
                                    <button
                                        onClick={removeInventoryItem}
                                        disabled={loading}
                                        className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-5 rounded-xl hover:from-red-400 hover:to-rose-400 disabled:opacity-50 font-medium transition shadow-lg shadow-red-500/20"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Test Results */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                📋
                            </span>
                            Test Results
                        </h2>
                        <button
                            onClick={clearResults}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-gray-400 text-sm font-medium transition"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="space-y-2 max-h-[400px] overflow-auto">
                        {testResults.length === 0 ? (
                            <div className="text-gray-500 italic text-center py-12 bg-black/20 rounded-xl">
                                <div className="text-4xl mb-3">🧪</div>
                                <p>No test results yet. Run a test to see results here.</p>
                            </div>
                        ) : (
                            testResults.map((result, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-xl border ${result.success
                                        ? 'bg-green-500/10 border-green-500/30'
                                        : 'bg-red-500/10 border-red-500/30'
                                        }`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className={`flex-1 font-mono text-sm whitespace-pre-wrap ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                                            {result.message}
                                        </div>
                                        <div className="text-xs text-gray-500 whitespace-nowrap">
                                            {result.timestamp.toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* API Reference */}
                <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-xl">
                    <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                        <span className="text-xl">📚</span>
                        API Reference
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <div className="font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center text-xs">📊</span>
                                User Attributes
                            </div>
                            <div className="space-y-2">
                                <code className="block bg-black/30 text-blue-300 px-3 py-2 rounded-lg font-mono text-xs">GET /user/attributes</code>
                                <code className="block bg-black/30 text-blue-300 px-3 py-2 rounded-lg font-mono text-xs">PATCH /user/attributes</code>
                                <code className="block bg-black/30 text-blue-300 px-3 py-2 rounded-lg font-mono text-xs">POST /user/attributes/reset</code>
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center text-xs">🎒</span>
                                Inventory
                            </div>
                            <div className="space-y-2">
                                <code className="block bg-black/30 text-green-300 px-3 py-2 rounded-lg font-mono text-xs">GET /user/inventory</code>
                                <code className="block bg-black/30 text-green-300 px-3 py-2 rounded-lg font-mono text-xs">POST /user/inventory/add</code>
                                <code className="block bg-black/30 text-green-300 px-3 py-2 rounded-lg font-mono text-xs">POST /user/inventory/remove</code>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
