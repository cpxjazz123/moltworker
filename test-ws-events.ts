
import WebSocket from 'ws';
import { randomUUID } from 'node:crypto';

// Configuration
const GATEWAY_URL = 'wss://moltbot-sandbox.xsun.workers.dev/ws';
const TOKEN = 'eb6268f2c9a0db35989a428089dcfb5ca51d061ba8b3f38f009eb0fcb80f08ef';

// Helper to build connect params (matching WebClaw logic)
function buildConnectParams() {
    return {
        minProtocol: 3,
        maxProtocol: 3,
        client: {
            id: 'test-client',
            displayName: 'test-script',
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
    const url = `${GATEWAY_URL}?token=${TOKEN}`;
    console.log('Connecting to:', url);
    const ws = new WebSocket(url);

    ws.on('open', () => {
        console.log('WebSocket connected!');

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
        console.log('\n[RCV] Message:', str.length > 200 ? str.slice(0, 200) + '...' : str);

        try {
            const parsed = JSON.parse(str);

            // If connected successfully, send a test chat message to trigger generation
            if (parsed.type === 'res' && parsed.ok && parsed.payload?.server) {
                console.log('Handshake successful!');

                const requestId = randomUUID();
                const chatFrame = {
                    type: 'req',
                    id: requestId,
                    method: 'chat.send',
                    params: {
                        sessionKey: 'test-ws-session',
                        message: 'Hello, count from 1 to 5 very quickly.',
                        deliver: false,
                    }
                };
                console.log('Sending chat.send frame:', JSON.stringify(chatFrame));
                ws.send(JSON.stringify(chatFrame));
            }

            // Check for events
            if (parsed.type === 'event') {
                console.log('!!! RECEIVED EVENT !!!', parsed.event, parsed.payload);
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

    // Keep alive for 15 seconds to receive events
    setTimeout(() => {
        console.log('Test complete, closing connection.');
        ws.close();
        process.exit(0);
    }, 15000);
}

testWebSocket();
