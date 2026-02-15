import { useState, useEffect } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { auth } from '../../firebase'
import { onAuthStateChanged, type User } from 'firebase/auth'

export const Route = createFileRoute('/_test/resources-manager')({
    component: ResourcesManagerPage,
})

const API_BASE = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || 'http://127.0.0.1:5001/anify-oiy-ai/us-central1/api'

interface Resource {
    id: string
    data: Record<string, unknown>
}

function ResourcesManagerPage() {
    const [user, setUser] = useState<User | null>(null)
    const [resources, setResources] = useState<Resource[]>([])
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    // Create/Edit form state
    const [showForm, setShowForm] = useState(false)
    const [editingResource, setEditingResource] = useState<Resource | null>(null)
    const [formId, setFormId] = useState('')
    const [formData, setFormData] = useState('')
    const [jsonError, setJsonError] = useState<string | null>(null)

    // Search state
    const [searchQuery, setSearchQuery] = useState('')

    // View state
    const [viewingResource, setViewingResource] = useState<Resource | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        fetchResources()
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

    const fetchResources = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/resources`, {
                headers: getHeaders(),
            })
            const data = await res.json()
            if (res.ok) {
                setResources(data.resources || [])
            } else {
                showToast(`Failed to fetch resources: ${data.error}`, 'error')
            }
        } catch (error: any) {
            showToast(`Network error: ${error.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    const validateJson = (value: string): boolean => {
        if (!value.trim()) {
            setJsonError('JSON data is required')
            return false
        }
        try {
            JSON.parse(value)
            setJsonError(null)
            return true
        } catch {
            setJsonError('Invalid JSON format')
            return false
        }
    }

    const handleFormDataChange = (value: string) => {
        setFormData(value)
        if (value.trim()) {
            validateJson(value)
        } else {
            setJsonError(null)
        }
    }

    const createResource = async () => {
        if (!validateJson(formData)) {
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/resources`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    ...(formId.trim() && { id: formId.trim() }),
                    data: JSON.parse(formData),
                }),
            })
            const data = await res.json()
            if (res.ok) {
                showToast(`Created resource: ${data.id}`, 'success')
                fetchResources()
                resetForm()
            } else {
                showToast(`Create failed: ${data.error}`, 'error')
            }
        } catch (error: any) {
            showToast(`Network error: ${error.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    const updateResource = async () => {
        if (!editingResource || !validateJson(formData)) {
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/resources/${editingResource.id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({
                    data: JSON.parse(formData),
                }),
            })
            const data = await res.json()
            if (res.ok) {
                showToast(`Updated resource: ${data.id}`, 'success')
                fetchResources()
                resetForm()
            } else {
                showToast(`Update failed: ${data.error}`, 'error')
            }
        } catch (error: any) {
            showToast(`Network error: ${error.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    const deleteResource = async (resourceId: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/resources/${resourceId}`, {
                method: 'DELETE',
                headers: getHeaders(),
            })
            if (res.ok) {
                showToast('Resource deleted successfully', 'success')
                fetchResources()
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

    const resetForm = () => {
        setFormId('')
        setFormData('')
        setJsonError(null)
        setEditingResource(null)
        setShowForm(false)
    }

    const openEditForm = (resource: Resource) => {
        setEditingResource(resource)
        setFormId(resource.id)
        setFormData(JSON.stringify(resource.data, null, 2))
        setJsonError(null)
        setShowForm(true)
    }

    const openCreateForm = () => {
        resetForm()
        setFormData('{\n  \n}')
        setShowForm(true)
    }

    const filteredResources = resources.filter(resource => {
        if (!searchQuery) return true
        const searchLower = searchQuery.toLowerCase()
        return (
            resource.id.toLowerCase().includes(searchLower) ||
            JSON.stringify(resource.data).toLowerCase().includes(searchLower)
        )
    })

    const formatJson = (data: Record<string, unknown>): string => {
        return JSON.stringify(data, null, 2)
    }

    const truncateJson = (data: Record<string, unknown>, maxLength: number = 100): string => {
        const str = JSON.stringify(data)
        if (str.length <= maxLength) return str
        return str.substring(0, maxLength) + '...'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
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
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <span className="text-2xl">⚙️</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Resources Manager</h1>
                                <p className="text-sm text-gray-400">Manage JSON resource configurations</p>
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
                            placeholder="Search resources by ID or content..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={fetchResources}
                            disabled={loading}
                            className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white hover:bg-white/10 disabled:opacity-50 transition flex items-center gap-2"
                        >
                            <span className={loading ? 'animate-spin' : ''}>🔄</span>
                            Refresh
                        </button>
                        <button
                            onClick={openCreateForm}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl px-6 py-3 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                        >
                            <span>✨</span>
                            Create Resource
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl font-bold text-white">{resources.length}</div>
                            <div className="text-gray-400">Total Resources</div>
                        </div>
                        {searchQuery && (
                            <div className="text-gray-400">
                                Showing {filteredResources.length} of {resources.length} resources
                            </div>
                        )}
                    </div>
                </div>

                {/* Resources List */}
                {loading && resources.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400">Loading resources...</p>
                    </div>
                ) : filteredResources.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-6xl mb-4">📭</span>
                        <h3 className="text-xl font-semibold text-white mb-2">No resources found</h3>
                        <p className="text-gray-400 mb-6">
                            {resources.length === 0 ? 'Create your first resource to get started!' : 'Try adjusting your search'}
                        </p>
                        {resources.length === 0 && (
                            <button
                                onClick={openCreateForm}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl px-6 py-3 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition"
                            >
                                ✨ Create First Resource
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredResources.map(resource => (
                            <div
                                key={resource.id}
                                className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-300"
                            >
                                {/* Header */}
                                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                                <span className="text-lg">📄</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white truncate max-w-[180px]" title={resource.id}>
                                                    {resource.id}
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {Object.keys(resource.data).length} keys
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Preview */}
                                <div className="p-4">
                                    <div className="bg-black/30 rounded-lg p-3 mb-4 max-h-24 overflow-hidden">
                                        <code className="text-xs text-gray-400 font-mono break-all">
                                            {truncateJson(resource.data, 150)}
                                        </code>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setViewingResource(resource)}
                                            className="flex-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500/30 transition"
                                        >
                                            👁️ View
                                        </button>
                                        <button
                                            onClick={() => openEditForm(resource)}
                                            className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => deleteResource(resource.id)}
                                            className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-500/30 transition"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-white/10 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">
                                    {editingResource ? '✏️ Edit Resource' : '✨ Create New Resource'}
                                </h2>
                                <button
                                    onClick={resetForm}
                                    className="text-gray-400 hover:text-white transition text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto flex-1">
                            {/* ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Resource ID {!editingResource && <span className="text-gray-500">(Optional, auto-generated if empty)</span>}
                                </label>
                                <input
                                    type="text"
                                    value={formId}
                                    onChange={(e) => setFormId(e.target.value)}
                                    placeholder="Enter resource ID..."
                                    disabled={!!editingResource}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                                />
                            </div>

                            {/* JSON Data */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    JSON Data
                                </label>
                                <textarea
                                    value={formData}
                                    onChange={(e) => handleFormDataChange(e.target.value)}
                                    placeholder='{"key": "value"}'
                                    rows={15}
                                    className={`w-full bg-black/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition font-mono text-sm resize-none ${jsonError
                                            ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                                            : 'border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20'
                                        }`}
                                />
                                {jsonError && (
                                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                        <span>❌</span> {jsonError}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 flex gap-3 flex-shrink-0">
                            <button
                                onClick={resetForm}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-gray-300 font-medium hover:bg-white/10 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingResource ? updateResource : createResource}
                                disabled={loading || !!jsonError || !formData.trim()}
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl px-5 py-3 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-500/30"
                            >
                                {loading ? 'Saving...' : editingResource ? 'Save Changes' : 'Create Resource'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {viewingResource && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-white/10 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                        <span className="text-lg">📄</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{viewingResource.id}</h2>
                                        <span className="text-sm text-gray-400">{Object.keys(viewingResource.data).length} keys</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewingResource(null)}
                                    className="text-gray-400 hover:text-white transition text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <pre className="bg-black/50 rounded-xl p-4 text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
                                {formatJson(viewingResource.data)}
                            </pre>
                        </div>

                        <div className="p-6 border-t border-white/10 flex gap-3 flex-shrink-0">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(formatJson(viewingResource.data))
                                    showToast('JSON copied to clipboard', 'success')
                                }}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-gray-300 font-medium hover:bg-white/10 transition flex items-center justify-center gap-2"
                            >
                                📋 Copy JSON
                            </button>
                            <button
                                onClick={() => {
                                    setViewingResource(null)
                                    openEditForm(viewingResource)
                                }}
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl px-5 py-3 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition shadow-lg shadow-indigo-500/30"
                            >
                                ✏️ Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
