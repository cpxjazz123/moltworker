#!/bin/bash
# Simplified startup script for OpenClaw in Cloudflare Sandbox

# Redirect all output to a log file as well as stdout
exec > >(tee -a /tmp/openclaw-startup.log) 2>&1

echo "=========================================="
echo "=== Starting OpenClaw Gateway ==="
echo "Date: $(date)"
echo "User: $(whoami)"
echo "Current directory: $(pwd)"
echo "=========================================="

# Set PATH to use our custom Node.js installation
export PATH="/opt/nodejs/bin:${PATH}"
echo "PATH: $PATH"

# Set OpenClaw environment variables for container/headless environment
export OPENCLAW_HOME="/root/.openclaw"
export OPENCLAW_STATE_DIR="/root/.openclaw"
export OPENCLAW_NO_TTY="1"
echo "Environment:"
echo "  OPENCLAW_HOME: $OPENCLAW_HOME"
echo "  OPENCLAW_STATE_DIR: $OPENCLAW_STATE_DIR"

# Check node version
echo ""
echo "=== Node.js Check ==="
echo "Node version: $(node --version 2>&1 || echo 'node not found')"
echo "NPM version: $(npm --version 2>&1 || echo 'npm not found')"

# Check if openclaw exists
echo ""
echo "=== OpenClaw Check ==="
if [ -f /opt/nodejs/bin/openclaw ]; then
    echo "OpenClaw binary found"
    ls -la /opt/nodejs/bin/openclaw
else
    echo "ERROR: OpenClaw binary not found at /opt/nodejs/bin/openclaw"
    find /opt -name "openclaw*" 2>/dev/null
    exit 1
fi

# Create config directory
mkdir -p /root/.openclaw
mkdir -p /root/clawd

# Set terminal size (best effort)
stty rows 40 cols 120 2>/dev/null || true

echo ""
echo "=== Starting Gateway ==="
echo "Command: openclaw gateway --port 18789 --bind lan --allow-unconfigured --verbose"
echo ""

# Run OpenClaw gateway directly
# --allow-unconfigured: Run without initial setup
# --bind lan: Listen on all network interfaces (for container access)
# --port 18789: Gateway port
exec /opt/nodejs/bin/openclaw gateway \
    --port 18789 \
    --bind lan \
    --allow-unconfigured \
    --verbose

# If exec fails, we'll reach here
echo "ERROR: exec failed!"
exit 1
