
import WebSocket from 'ws';
import { randomUUID } from 'node:crypto';

// Configuration
// Connect to the LOCAL Vite proxy, which forwards to the remote worker
const GATEWAY_URL = 'ws://localhost:3002/ws';
const TOKEN = 'eb6268f2c9a0db35989a428089dcfb5ca51d061ba8b3f38f009eb0fcb80f08ef';

function buildConnectParams() {
    return {
        minProtocol: 3,
        maxProtocol: 3,
        client: {
            id: 'gateway-client',
            displayName: 'test-script-proxy',
            version: '1.0.0',
            platform: 'linux',
            mode: 'cli',
            instanceId: randomUUID(),
        },
        auth: {
            token: TOKEN,
        },
        role: 'operator',
        scopes: ['operator.admin'],
    };
}

async function testWebSocket() {
    // Note: The Native UI might append ?token=... or send it in the handshake.
    // The Gateway accepts token in the URL query param OR in the connect frame `auth.token`.
    // We will put it in BOTH to be safe and match potential browser behavior.
    const url = `${GATEWAY_URL}?token=${TOKEN}`;
    console.log('Connecting to Proxy:', url);
    const ws = new WebSocket(url);

    ws.on('open', () => {
        console.log('WebSocket connected to Proxy!');

        // 1. Send Connect Handshake
        const connectId = randomUUID();
        const connectFrame = {
            type: 'req',
            id: connectId,
            method: 'connect',
            params: buildConnectParams(),
        };
        console.log('Sending connect frame:', JSON.stringify(connectFrame));
        ws.send(JSON.stringify(connectFrame));
    });

    ws.on('message', (data) => {
        const str = data.toString();
        // Truncate long messages for log readability
        console.log('\n[RCV] Message:', str.length > 200 ? str.slice(0, 200) + '...' : str);

        try {
            const parsed = JSON.parse(str);

            // Responding to the connect handshake
            if (parsed.type === 'res' && parsed.id && parsed.ok) {
                // Check if it's the connect response (usually has server info)
                if (parsed.payload?.server) {
                    console.log('Handshake successful!');

                    // Send a dummy chat message
                    const requestId = randomUUID();
                    const chatFrame = {
                        type: 'req',
                        id: requestId,
                        method: 'chat.send',
                        params: {
                            sessionKey: 'proxy-test-session',
                            friendlyId: 'proxy-test',
                            message: 'Hello via Proxy!',
                            deliver: false,
                            idempotencyKey: randomUUID(),
                        }
                    };
                    console.log('Sending chat.send frame:', JSON.stringify(chatFrame));
                    ws.send(JSON.stringify(chatFrame));
                }
            }

            if (parsed.type === 'event') {
                console.log('!!! RECEIVED EVENT !!!', parsed.event);
            }

        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });

    ws.on('close', (code, reason) => {
        console.log('WebSocket closed:', code, reason.toString());
    });

    // Keep alive for 10 seconds
    setTimeout(() => {
        console.log('Test complete, closing connection.');
        ws.close();
        process.exit(0);
    }, 10000);
}

testWebSocket();
