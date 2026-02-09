
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import httpProxy from 'http-proxy';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;
const TARGET = 'https://moltbot-sandbox.xsun.workers.dev';

// HTTP Proxy for /api (REST)
const apiProxy = createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
});

// WebSocket Proxy
const wsProxy = httpProxy.createProxyServer({
    target: TARGET,
    changeOrigin: true,
    secure: false, // Accept self-signed (though target is valid SSL, this is safer for dev)
    ws: true,
});

wsProxy.on('error', (err, req, socket) => {
    console.error('WS Proxy Error:', err);
    socket.end();
});

// Use proxy for /api (REST)
app.use('/api', apiProxy);
// Note: We don't need app.use('/ws') for WS because we handle upgrade manually.
// But some WS connections might send HTTP Upgrade request to /ws.
// The upgrade handler below catches it.

// Serve static files from current directory
app.use(express.static(__dirname));

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Proxying API and WS to ${TARGET}`);
});

// Explicitly handle upgrade for WebSockets
server.on('upgrade', (req, socket, head) => {
    console.log('Upgrade request:', req.url);
    if (req.url.startsWith('/ws')) {
        wsProxy.ws(req, socket, head);
    } else {
        socket.destroy();
    }
});
