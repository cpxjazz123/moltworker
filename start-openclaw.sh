#!/bin/bash
# Debug startup script for OpenClaw in Cloudflare Sandbox

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
export OPENCLAW_CONFIG_PATH="/root/.openclaw/openclaw.json"
# Disable TTY detection for container environment
export OPENCLAW_NO_TTY="1"
echo "OPENCLAW_HOME: $OPENCLAW_HOME"
echo "OPENCLAW_STATE_DIR: $OPENCLAW_STATE_DIR"
echo "OPENCLAW_CONFIG_PATH: $OPENCLAW_CONFIG_PATH"

# Check node version
echo "Node version: $(node --version 2>&1 || echo 'node not found')"
echo "NPM version: $(npm --version 2>&1 || echo 'npm not found')"

# Check if openclaw exists
echo ""
echo "=== Checking OpenClaw installation ==="
if [ -f /opt/nodejs/bin/openclaw ]; then
    echo "OpenClaw binary found at /opt/nodejs/bin/openclaw"
    ls -la /opt/nodejs/bin/openclaw
    file /opt/nodejs/bin/openclaw
else
    echo "ERROR: OpenClaw binary not found at /opt/nodejs/bin/openclaw"
    echo "Searching for openclaw..."
    find /opt -name "openclaw*" 2>/dev/null
    exit 1
fi

# Create config directory
mkdir -p /root/.openclaw
mkdir -p /root/clawd

# Set terminal size to avoid TUI rendering issues in container
echo ""
echo "=== Setting terminal size ==="
stty rows 40 cols 120 2>/dev/null || echo "stty failed (expected in non-pty environment)"

# Check if OpenClaw is already initialized
echo ""
echo "=== Checking OpenClaw initialization ==="
if [ ! -f /root/.openclaw/config.json ] && [ ! -d /root/.openclaw/.openclaw ]; then
    echo "OpenClaw not initialized, running onboard..."

    # Run onboard in non-interactive mode
    # --install-daemon installs the background daemon
    # --skip-interactive skips the interactive prompts
    /opt/nodejs/bin/openclaw onboard --install-daemon --skip-interactive 2>&1 || {
        echo "Onboard completed (some errors expected in container)"
    }
else
    echo "OpenClaw already initialized"
fi

# Configure gateway for container/external access
echo ""
echo "=== Configuring gateway ==="
/opt/nodejs/bin/openclaw config set gateway.port 18789 2>&1 || echo "Config set port failed"
/opt/nodejs/bin/openclaw config set gateway.bind "lan" 2>&1 || echo "Config set bind failed"
/opt/nodejs/bin/openclaw config set gateway.mode "local" 2>&1 || echo "Config set mode failed"

# Show current config
echo "Current gateway config:"
/opt/nodejs/bin/openclaw config get gateway 2>&1 || echo "Config get failed"

# Try to run OpenClaw with error handling
echo ""
echo "=== Starting gateway on port 18789 ==="
echo "Running: /opt/nodejs/bin/openclaw gateway --port 18789 --verbose --allow-unconfigured"

# Use exec to replace this shell with openclaw
exec /opt/nodejs/bin/openclaw gateway --port 18789 --verbose --allow-unconfigured

# If exec fails, we'll reach here
echo "ERROR: exec failed!"
exit 1
