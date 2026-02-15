import { EventEmitter } from 'eventemitter3';
import type { GatewayMessage, GatewayOptions } from '../types/openclaw';

// Toggle this to enable/disable mocking
const USE_MOCK = true;

export class OpenClawClient extends EventEmitter {
    private ws: WebSocket | null = null;
    private pending = new Map<string, { resolve: (val: any) => void; reject: (err: any) => void }>();
    public isConnected = false;
    private options: GatewayOptions;
    private requestQueue: string[] = [];
    private clientId = Math.random().toString(36).slice(2, 6);

    constructor(options: GatewayOptions) {
        super();
        this.options = options;
        console.log(`[OpenClawClient:${this.clientId}] Created (Mock Mode: ${USE_MOCK})`);
    }

    connect() {
        if (USE_MOCK) {
            console.log(`[OpenClawClient:${this.clientId}] Mock Connect...`);
            setTimeout(() => {
                this.isConnected = true;
                this.emit('connected', {
                    user: { id: 'mock-user', name: 'Mock User' },
                    session: { id: 'mock-session' }
                });
                console.log(`[OpenClawClient:${this.clientId}] ✓ MOCK AUTHENTICATED`);
            }, 500);
            return;
        }

        // Only skip if we have a healthy connection
        if (this.ws) {
            const state = this.ws.readyState;
            console.log(`[OpenClawClient:${this.clientId}] Existing WS found, readyState:`, state);

            // If connecting or open, don't create new connection
            if (state === WebSocket.CONNECTING || state === WebSocket.OPEN) {
                return;
            }

            // Otherwise, clean up the dead connection
            console.log(`[OpenClawClient:${this.clientId}] Cleaning up dead connection`);
            this.ws = null;
            this.isConnected = false;
        }

        const wsUrl = this.options.url;
        console.log(`[OpenClawClient:${this.clientId}] Connecting to`, wsUrl);

        this.ws = new WebSocket(wsUrl);
        this.isConnected = false;

        this.ws.onopen = () => {
            console.log(`[OpenClawClient:${this.clientId}] WS Open`);
            const handshake = this.createHandshakeFrame();

            // Register handshake in pending map
            this.pending.set(handshake.id!, {
                resolve: () => {
                    // This will be called when hello-ok is received
                },
                reject: (err) => console.error(`[OpenClawClient:${this.clientId}] Initial handshake failed:`, err),
            });

            // Force direct send for handshake
            const payload = JSON.stringify(handshake);
            console.log(`[OpenClawClient:${this.clientId}] >>> SEND HANDSHAKE (DIRECT):`, payload.slice(0, 100));
            this.ws?.send(payload);

            console.log(`[OpenClawClient:${this.clientId}] Waiting for hello-ok before flushing queue (size: ${this.requestQueue.length})`);
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as GatewayMessage;
                this.handleMessage(data);
            } catch (err) {
                console.error('[OpenClawClient] Parse error', err);
            }
        };

        this.ws.onclose = (ev) => {
            console.log('[OpenClawClient] WS Closed', ev.code, ev.reason);
            this.isConnected = false;
            this.ws = null;
            this.emit('disconnected');
        };

        this.ws.onerror = (err) => {
            console.error('[OpenClawClient] WS Error', err);
        };
    }

    private createHandshakeFrame() {
        const handshakeId = crypto.randomUUID();
        const connectFrame: GatewayMessage = {
            type: 'req',
            id: handshakeId,
            method: 'connect',
            params: {
                minProtocol: 3,
                maxProtocol: 3,
                client: {
                    id: 'gateway-client',
                    displayName: 'anify-web',
                    version: '1.0.0',
                    platform: 'web',
                    mode: 'ui',
                    instanceId: crypto.randomUUID(),
                },
                auth: { token: this.options.token },
                role: 'operator',
                scopes: ['operator.admin'],
            },
        };

        return connectFrame;
    }

    private send(msg: any) {
        if (USE_MOCK) {
            console.log(`[OpenClawClient:${this.clientId}] Mock Send suppressed`);
            return;
        }

        const payload = typeof msg === 'string' ? msg : JSON.stringify(msg);

        // Only send if fully connected and authenticated
        if (this.ws && this.ws.readyState === WebSocket.OPEN && this.isConnected) {
            console.log(`[OpenClawClient:${this.clientId}] >>> SEND:`, payload.slice(0, 100));
            this.ws.send(payload);
        } else {
            console.log(`[OpenClawClient:${this.clientId}] QUEUE (ready=${this.ws?.readyState}, auth=${this.isConnected}):`, payload.slice(0, 50));
            this.requestQueue.push(payload);
        }
    }

    private handleMessage(msg: GatewayMessage) {
        console.log(`[OpenClawClient:${this.clientId}] <<< RECEIVED:`, JSON.stringify(msg).slice(0, 150));

        if (msg.type === 'res') {
            // Handle Response
            if (msg.id && this.pending.has(msg.id)) {
                const { resolve, reject } = this.pending.get(msg.id)!;
                this.pending.delete(msg.id);
                if (msg.ok) {
                    // Check if this is a response to our connect request
                    if (msg.payload?.type === 'hello-ok') {
                        if (!this.isConnected) {
                            console.log(`[OpenClawClient:${this.clientId}] ✓ AUTHENTICATED`);
                            this.isConnected = true;
                            this.emit('connected', msg.payload);
                        }

                        // Flush the queue after successful authentication
                        console.log(`[OpenClawClient:${this.clientId}] Received hello-ok, flushing queue size:`, this.requestQueue.length);
                        while (this.requestQueue.length > 0) {
                            const queuedMsg = this.requestQueue.shift();
                            if (queuedMsg) {
                                console.log(`[OpenClawClient:${this.clientId}] >>> FLUSH:`, queuedMsg.slice(0, 100));
                                this.ws?.send(queuedMsg);
                            }
                        }
                    }
                    console.log(`[OpenClawClient:${this.clientId}] ✓ Response resolved for ID:`, msg.id);
                    resolve(msg.payload);
                } else {
                    console.log(`[OpenClawClient:${this.clientId}] ✗ Response error for ID:`, msg.id, msg.error);
                    reject(new Error(msg.error?.message || 'Unknown gateway error'));
                }
            } else {
                console.log(`[OpenClawClient:${this.clientId}]⚠ Response for unknown ID:`, msg.id);
            }
        } else if (msg.type === 'event') {
            // Handle Event
            this.emit('event', msg);
            if (msg.event) {
                this.emit(msg.event, msg.payload);
            }
        }
    }

    request(method: string, params: any = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            if (USE_MOCK) {
                console.log(`[OpenClawClient:${this.clientId}] Mock Request: ${method}`, params);

                if (method === 'chat.history') {
                    setTimeout(() => {
                        resolve({
                            messages: [
                                { role: 'system', content: 'You are a helpful assistant.', timestamp: Date.now() - 100000 },
                                { role: 'human', content: 'Hello!', timestamp: Date.now() - 50000 },
                                { role: 'assistant', content: 'Hi there! I am a Mock AI.', timestamp: Date.now() - 40000 }
                            ]
                        });
                    }, 500);
                    return;
                }

                if (method === 'chat.send') {
                    setTimeout(() => {
                        resolve({ ok: true });
                        // Simulate streaming response
                        const runId = 'mock-run-' + Date.now();
                        const sessionKey = params.sessionKey;
                        const responseText = "Thinking... (Mock Response for: " + params.message + ")";

                        // Function to emit stream event
                        const emitDelta = (delta: string) => {
                            this.emit('event', {
                                type: 'event', event: 'agent', payload: {
                                    sessionKey, runId, stream: 'assistant', data: { delta }
                                }
                            });
                        };

                        // Simulate typing
                        let i = 0;
                        const interval = setInterval(() => {
                            if (i < responseText.length) {
                                emitDelta(responseText[i]);
                                i++;
                            } else {
                                clearInterval(interval);
                                // End stream
                                this.emit('event', {
                                    type: 'event', event: 'agent', payload: {
                                        sessionKey, runId, stream: 'assistant', data: { phase: 'end' }
                                    }
                                });
                            }
                        }, 50);

                    }, 200);
                    return;
                }

                if (method === 'debug.listProcesses') {
                    setTimeout(() => {
                        resolve({
                            processes: [
                                { id: 'mock-1', name: 'Moltbot Gateway', status: 'running' },
                                { id: 'mock-2', name: 'Sandbox Agent', status: 'running' }
                            ]
                        });
                    }, 100);
                    return;
                }

                resolve({});
                return;
            }

            const id = crypto.randomUUID();
            console.log(`[OpenClawClient:${this.clientId}] Request: ${method} (ID: ${id})`, params);
            const req: GatewayMessage = {
                type: 'req',
                id,
                method,
                params,
            };

            this.pending.set(id, { resolve, reject });
            this.send(req);

            // Timeout
            setTimeout(() => {
                if (this.pending.has(id)) {
                    this.pending.delete(id);
                    reject(new Error(`Request ${method} timed out`));
                }
            }, 30000);
        });
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
        this.requestQueue = [];
        this.pending.clear();
    }
}

// Singleton instance with hardcoded credentials (stable sandbox)
export const GATEWAY_URL = 'wss://moltbot-sandbox.xsun.workers.dev/ws';
const GATEWAY_TOKEN = 'eb6268f2c9a0db35989a428089dcfb5ca51d061ba8b3f38f009eb0fcb80f08ef';

let openclawClientInstance: OpenClawClient | null = null;

if (typeof window !== 'undefined') {
    const win = window as any;
    if (win.__openclaw_client) {
        openclawClientInstance = win.__openclaw_client;
        console.log('[OpenClawClient] Reusing existing instance');
    } else {
        openclawClientInstance = new OpenClawClient({
            url: GATEWAY_URL,
            token: GATEWAY_TOKEN,
        });
        win.__openclaw_client = openclawClientInstance;
    }
} else {
    openclawClientInstance = new OpenClawClient({
        url: GATEWAY_URL,
        token: GATEWAY_TOKEN,
    });
}

export const openclawClient = openclawClientInstance!;
