#!/bin/bash
# Minimal startup script for OpenClaw in Cloudflare Sandbox
# This version skips all config and just starts the gateway

echo "=== Starting OpenClaw Gateway ==="
echo "Date: $(date)"
echo "User: $(whoami)"
echo "Current directory: $(pwd)"

# Set PATH to use our custom Node.js installation
export PATH="/opt/nodejs/bin:${PATH}"
echo "PATH: $PATH"

# Check node version
echo "Node version: $(node --version 2>&1 || echo 'node not found')"

# Check if openclaw exists
if [ -f /opt/nodejs/bin/openclaw ]; then
    echo "OpenClaw binary found at /opt/nodejs/bin/openclaw"
    ls -la /opt/nodejs/bin/openclaw
else
    echo "ERROR: OpenClaw binary not found!"
    exit 1
fi

# Create config directory if needed
mkdir -p /root/.openclaw

# Create minimal config if none exists
if [ ! -f /root/.openclaw/openclaw.json ]; then
    echo '{"gateway":{"port":18789,"mode":"local"}}' > /root/.openclaw/openclaw.json
    echo "Created minimal config"
fi

echo "Config contents:"
cat /root/.openclaw/openclaw.json

echo ""
echo "=== Starting gateway on port 18789 ==="
exec /opt/nodejs/bin/openclaw gateway --port 18789 --verbose --allow-unconfigured --bind 0.0.0.0
