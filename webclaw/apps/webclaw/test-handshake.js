
import WebSocket from 'ws';

// Mimic the MoltbotClient logic
const token = 'eb6268f2c9a0db35989a428089dcfb5ca51d061ba8b3f38f009eb0fcb80f08ef';
const url = 'ws://localhost:3003/ws?token=' + token;

console.log('Connecting to', url);
const ws = new WebSocket(url);

ws.on('open', () => {
    console.log('Connected');

    const handshakeId = crypto.randomUUID();
    const connectFrame = {
        type: 'req',
        id: handshakeId,
        method: 'connect',
        params: {
            minProtocol: 3,
            maxProtocol: 3,
            client: {
                id: 'gateway-client',
                displayName: 'webclaw-custom-test',
                version: '1.0.0',
                platform: 'web',
                mode: 'ui',
                instanceId: crypto.randomUUID(),
            },
            auth: { token: token },
            role: 'operator',
            scopes: ['operator.admin'],
        }
    };

    console.log('Sending handshake:', JSON.stringify(connectFrame));
    ws.send(JSON.stringify(connectFrame));

    // Simulate a health check immediately after
    setTimeout(() => {
        const healthId = crypto.randomUUID();
        const healthFrame = {
            type: 'req',
            id: healthId,
            method: 'health',
            params: {}
        };
        console.log('Sending health check:', JSON.stringify(healthFrame));
        ws.send(JSON.stringify(healthFrame));
    }, 100);
});

ws.on('message', (data) => {
    console.log('Received:', data.toString());
});

ws.on('error', (err) => {
    console.error('Error:', err);
});

ws.on('close', (code, reason) => {
    console.log('Closed:', code, reason.toString());
});
