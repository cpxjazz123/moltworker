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

# Create minimal config
echo ""
echo "=== Creating config ==="
cat > /root/.openclaw/openclaw.json << 'CONFIGEOF'
{
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "0.0.0.0"
  }
}
CONFIGEOF
echo "Config created:"
cat /root/.openclaw/openclaw.json

# Try to run OpenClaw with error handling
echo ""
echo "=== Starting gateway on port 18789 ==="
echo "Running: /opt/nodejs/bin/openclaw gateway --port 18789 --verbose --allow-unconfigured --bind 0.0.0.0"

# Use exec to replace this shell with openclaw
exec /opt/nodejs/bin/openclaw gateway --port 18789 --verbose --allow-unconfigured --bind 0.0.0.0

# If exec fails, we'll reach here
echo "ERROR: exec failed!"
exit 1
