
import { EventEmitter } from 'eventemitter3'

export type GatewayMessage = {
    type: 'req' | 'res' | 'event'
    id?: string
    method?: string
    params?: any
    event?: string
    payload?: any
    ok?: boolean
    error?: { message: string; code?: string }
}

export type GatewayOptions = {
    url: string
    token: string
}

export class MoltbotClient extends EventEmitter {
    private ws: WebSocket | null = null
    private pending = new Map<string, { resolve: (val: any) => void; reject: (err: any) => void }>()
    public isConnected = false
    private options: GatewayOptions
    private requestQueue: string[] = []
    private handshakeSent = false
    private clientId = Math.random().toString(36).slice(2, 6)

    constructor(options: GatewayOptions) {
        super()
        this.options = options
        console.log(`[MoltbotClient:${this.clientId}] Created`)
    }

    connect() {
        // Only skip if we have a healthy connection
        if (this.ws) {
            const state = this.ws.readyState
            console.log(`[MoltbotClient:${this.clientId}] Existing WS found, readyState:`, state)

            // If connecting or open, don't create new connection
            if (state === WebSocket.CONNECTING || state === WebSocket.OPEN) {
                return
            }

            // Otherwise, clean up the dead connection
            console.log(`[MoltbotClient:${this.clientId}] Cleaning up dead connection`)
            this.ws = null
            this.handshakeSent = false
            this.isConnected = false
        }

        // Use relative path to leverage Vite proxy if in dev, or same origin in prod
        const token = this.options.token

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const host = window.location.host
        const wsUrl = `${protocol}//${host}/ws?token=${token}`

        console.log(`[MoltbotClient:${this.clientId}] Connecting to`, wsUrl)

        this.ws = new WebSocket(wsUrl)
        this.handshakeSent = false
        this.isConnected = false

        this.ws.onopen = () => {
            console.log(`[MoltbotClient:${this.clientId}] WS Open`)
            const handshake = this.createHandshakeFrame()

            // Register handshake in pending map so we can track the hello-ok response
            this.pending.set(handshake.id, {
                resolve: () => {
                    // This will be called when hello-ok is received
                },
                reject: (err) => console.error(`[MoltbotClient:${this.clientId}] Initial handshake failed:`, err)
            })

            // Force direct send for handshake
            const payload = JSON.stringify(handshake)
            console.log(`[MoltbotClient:${this.clientId}] >>> SEND HANDSHAKE (DIRECT):`, payload.slice(0, 100))
            this.ws?.send(payload)
            this.handshakeSent = true

            // DON'T flush queue here - wait for hello-ok response
            // The server might send a challenge, requiring re-authentication
            console.log(`[MoltbotClient:${this.clientId}] Waiting for hello-ok before flushing queue (size: ${this.requestQueue.length})`)
        }

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as GatewayMessage
                this.handleMessage(data)
            } catch (err) {
                console.error('[MoltbotClient] Parse error', err)
            }
        }

        this.ws.onclose = (ev) => {
            console.log('[MoltbotClient] WS Closed', ev.code, ev.reason)
            this.isConnected = false
            this.ws = null
            this.emit('disconnected')
            // Don't auto-reconnect here to avoid aggressive loops in dev
            // The UI will re-trigger connect() via queries if needed.
        }

        this.ws.onerror = (err) => {
            console.error('[MoltbotClient] WS Error', err)
        }
    }

    private createHandshakeFrame(nonce?: string) {
        const handshakeId = crypto.randomUUID()
        const connectFrame: any = {
            type: 'req',
            id: handshakeId,
            method: 'connect',
            params: {
                minProtocol: 3,
                maxProtocol: 3,
                client: {
                    id: 'gateway-client',
                    displayName: 'webclaw-custom',
                    version: '1.0.0',
                    platform: 'web',
                    mode: 'ui',
                    instanceId: crypto.randomUUID(),
                },
                auth: { token: this.options.token },
                role: 'operator',
                scopes: ['operator.admin'],
            }
        }

        if (nonce) {
            // connectFrame.params.auth.nonce = nonce 
        }

        return connectFrame
    }

    private sendHandshake(nonce?: string) {
        // Only used for re-sending on challenge
        const frame = this.createHandshakeFrame(nonce)

        // Register in pending map to track the response
        this.pending.set(frame.id, {
            resolve: () => { }, // Will be handled by hello-ok logic
            reject: (err) => console.error(`[MoltbotClient:${this.clientId}] Handshake failed:`, err)
        })

        console.log(`[MoltbotClient:${this.clientId}] >>> RESEND HANDSHAKE (CHALLENGE):`, JSON.stringify(frame))
        this.ws?.send(JSON.stringify(frame)) // Direct send
    }

    private send(msg: any) {
        const payload = typeof msg === 'string' ? msg : JSON.stringify(msg)

        // Only send if fully connected and authenticated
        if (this.ws && this.ws.readyState === WebSocket.OPEN && this.isConnected) {
            console.log(`[MoltbotClient:${this.clientId}] >>> SEND:`, payload.slice(0, 100))
            this.ws.send(payload)
        } else {
            console.log(`[MoltbotClient:${this.clientId}] QUEUE (ready=${this.ws?.readyState}, auth=${this.isConnected}, hsSent=${this.handshakeSent}):`, payload.slice(0, 50))
            this.requestQueue.push(payload)
        }
    }

    private handleMessage(msg: GatewayMessage) {
        console.log(`[MoltbotClient:${this.clientId}] <<< RECEIVED:`, JSON.stringify(msg).slice(0, 150))

        if (msg.type === 'res') {
            // Handle Response
            if (msg.id && this.pending.has(msg.id)) {
                const { resolve, reject } = this.pending.get(msg.id)!
                this.pending.delete(msg.id)
                if (msg.ok) {
                    // Check if this is a response to our connect request
                    if (msg.payload?.type === 'hello-ok') {
                        if (!this.isConnected) {
                            console.log(`[MoltbotClient:${this.clientId}] ✓ AUTHENTICATED`)
                            this.isConnected = true
                            this.emit('connected', msg.payload)
                        }

                        // Flush the queue after successful authentication (redundancy check happens in loop)
                        console.log(`[MoltbotClient:${this.clientId}] Received hello-ok, flushing queue size:`, this.requestQueue.length)
                        while (this.requestQueue.length > 0) {
                            const queuedMsg = this.requestQueue.shift()
                            if (queuedMsg) {
                                console.log(`[MoltbotClient:${this.clientId}] >>> FLUSH:`, queuedMsg.slice(0, 100))
                                this.ws?.send(queuedMsg)
                            }
                        }
                    }
                    console.log(`[MoltbotClient:${this.clientId}] ✓ Response resolved for ID:`, msg.id)
                    resolve(msg.payload)
                } else {
                    console.log(`[MoltbotClient:${this.clientId}] ✗ Response error for ID:`, msg.id, msg.error)
                    reject(new Error(msg.error?.message || 'Unknown gateway error'))
                }
            } else {
                console.log(`[MoltbotClient:${this.clientId}] ⚠ Response for unknown ID:`, msg.id)
            }
        } else if (msg.type === 'event') {
            // Handle Event
            if (msg.event === 'connect.challenge') {
                // Resend handshake
                console.log(`[MoltbotClient:${this.clientId}] Received challenge, resending handshake`)
                const nonce = msg.payload?.nonce
                this.sendHandshake(nonce)
                return
            }

            this.emit('event', msg)
            if (msg.event) {
                this.emit(msg.event, msg.payload)
            }
        }
    }

    request(method: string, params: any = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.isConnected && method !== 'connect') {
                // Allow request to pend if connecting? Or fail?
                // For now, fail if not connected
                // Better: wait for connection? 
                // Let's just fail for simplicity, the UI will retry or show error.
                // Actually, if we are 'connecting', we might want to queue.
                // But let's stick to fail-fast.
            }

            const id = crypto.randomUUID()
            console.log(`[MoltbotClient:${this.clientId}] Request: ${method} (ID: ${id})`, params)
            const req = {
                type: 'req',
                id,
                method,
                params
            }

            this.pending.set(id, { resolve, reject })
            this.send(req)

            // Timeout
            setTimeout(() => {
                if (this.pending.has(id)) {
                    this.pending.delete(id)
                    reject(new Error(`Request ${method} timed out`))
                }
            }, 30000) // Increased to 30s for slow connections/handshakes
        })
    }
}

// Persistent Singleton Instance (for HMR)
let moltbotClientInstance: MoltbotClient | null = null

if (typeof window !== 'undefined') {
    const win = window as any
    if (win.__moltbot_client) {
        moltbotClientInstance = win.__moltbot_client
        console.log('[MoltbotClient] Reusing existing instance')
    } else {
        moltbotClientInstance = new MoltbotClient({
            url: 'wss://moltbot-sandbox.xsun.workers.dev/ws',
            token: 'eb6268f2c9a0db35989a428089dcfb5ca51d061ba8b3f38f009eb0fcb80f08ef'
        })
        win.__moltbot_client = moltbotClientInstance
    }
} else {
    moltbotClientInstance = new MoltbotClient({
        url: 'wss://moltbot-sandbox.xsun.workers.dev/ws',
        token: 'eb6268f2c9a0db35989a428089dcfb5ca51d061ba8b3f38f009eb0fcb80f08ef'
    })
}

export const moltbotClient = moltbotClientInstance!
