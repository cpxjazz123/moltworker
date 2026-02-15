#!/bin/bash
# Verbose debug startup script for OpenClaw in Cloudflare Sandbox

# Redirect all output to a log file as well as stdout
exec > >(tee -a /tmp/openclaw-startup.log) 2>&1

echo "=========================================="
echo "=== Starting OpenClaw Gateway (DEBUG) ==="
echo "Date: $(date)"
echo "User: $(whoami)"
echo "Current directory: $(pwd)"
echo "Hostname: $(hostname)"
echo "=========================================="

# Set PATH to use our custom Node.js installation
export PATH="/opt/nodejs/bin:${PATH}"
echo ""
echo "=== Environment ==="
echo "PATH: $PATH"
echo "HOME: $HOME"
echo "OPENCLAW_HOME: ${OPENCLAW_HOME:-not set}"

# Set OpenClaw environment variables for container/headless environment
export OPENCLAW_HOME="/root/.openclaw"
export OPENCLAW_STATE_DIR="/root/.openclaw"
export OPENCLAW_NO_TTY="1"

echo ""
echo "=== Set Environment Variables ==="
echo "OPENCLAW_HOME: $OPENCLAW_HOME"
echo "OPENCLAW_STATE_DIR: $OPENCLAW_STATE_DIR"
echo "OPENCLAW_NO_TTY: $OPENCLAW_NO_TTY"

# Check node version
echo ""
echo "=== Node.js Check ==="
echo "Which node: $(which node)"
echo "Node version: $(node --version 2>&1)"
echo "NPM version: $(npm --version 2>&1)"

# Check if openclaw exists
echo ""
echo "=== OpenClaw Installation Check ==="
if [ -f /opt/nodejs/bin/openclaw ]; then
    echo "OpenClaw binary found at /opt/nodejs/bin/openclaw"
    ls -la /opt/nodejs/bin/openclaw
    echo ""
    echo "OpenClaw package info:"
    ls -la /opt/nodejs/lib/node_modules/openclaw/ 2>/dev/null || echo "Cannot list openclaw module directory"
else
    echo "ERROR: OpenClaw binary not found at /opt/nodejs/bin/openclaw"
    echo "Searching for openclaw..."
    find /opt -name "openclaw*" 2>/dev/null
    exit 1
fi

# Create config directory
echo ""
echo "=== Creating Directories ==="
mkdir -pv /root/.openclaw
mkdir -pv /root/clawd
mkdir -pv /root/clawd/skills

# Check existing config
echo ""
echo "=== Checking Existing Config ==="
if [ -f /root/.openclaw/openclaw.json ]; then
    echo "Found existing openclaw.json:"
    cat /root/.openclaw/openclaw.json
else
    echo "No existing openclaw.json found"
fi

if [ -d /root/.openclaw/.openclaw ]; then
    echo "Found .openclaw directory:"
    ls -la /root/.openclaw/.openclaw/
else
    echo "No .openclaw directory found"
fi

# Set terminal size (best effort)
echo ""
echo "=== Terminal Setup ==="
stty rows 40 cols 120 2>/dev/null && echo "Terminal size set" || echo "stty failed (expected in non-pty environment)"

# Check network
echo ""
echo "=== Network Check ==="
echo "Available interfaces:"
ip addr 2>/dev/null || ifconfig 2>/dev/null || echo "Cannot check network interfaces"
echo ""
echo "Checking if port 18789 is available:"
netstat -tlnp 2>/dev/null | grep 18789 || ss -tlnp 2>/dev/null | grep 18789 || echo "Port 18789 is free"

# Try to get OpenClaw version first
echo ""
echo "=== Testing OpenClaw CLI ==="
echo "Running: openclaw --version"
OPENCLAW_VERSION_OUTPUT=$(openclaw --version 2>&1)
OPENCLAW_VERSION_EXIT=$?
echo "Exit code: $OPENCLAW_VERSION_EXIT"
echo "Output: $OPENCLAW_VERSION_OUTPUT"

if [ $OPENCLAW_VERSION_EXIT -ne 0 ]; then
    echo "ERROR: openclaw --version failed!"
    echo "This indicates a basic installation problem."
fi

# Check gateway help
echo ""
echo "=== Gateway Command Help ==="
echo "Running: openclaw gateway --help"
openclaw gateway --help 2>&1 | head -30 || echo "Failed to get gateway help"

# Try running gateway with different options to see what happens
echo ""
echo "=== Starting Gateway (Attempt 1: with --dev) ==="
echo "Command: openclaw gateway --port 18789 --bind lan --dev --allow-unconfigured --verbose"
echo "Starting at: $(date)"
echo ""

# Run in a way that captures all output
openclaw gateway \
    --port 18789 \
    --bind lan \
    --dev \
    --allow-unconfigured \
    --verbose 2>&1 &

GATEWAY_PID=$!
echo "Gateway started with PID: $GATEWAY_PID"

# Wait a bit and check if process is still running
sleep 5

if kill -0 $GATEWAY_PID 2>/dev/null; then
    echo "Gateway process is running (PID: $GATEWAY_PID)"
    echo "Checking if port is listening..."
    netstat -tlnp 2>/dev/null | grep 18789 || ss -tlnp 2>/dev/null | grep 18789 || echo "Port not yet listening"

    # Wait for the process
    echo "Waiting for gateway process..."
    wait $GATEWAY_PID
    EXIT_CODE=$?
    echo "Gateway process exited with code: $EXIT_CODE"
else
    echo "Gateway process has already exited!"
    wait $GATEWAY_PID 2>/dev/null
    EXIT_CODE=$?
    echo "Exit code: $EXIT_CODE"
fi

echo ""
echo "=== Gateway Failed - Attempting Alternative ==="
echo "Trying without --dev flag..."

openclaw gateway \
    --port 18789 \
    --bind lan \
    --allow-unconfigured \
    --verbose 2>&1 &

GATEWAY_PID=$!
echo "Gateway started with PID: $GATEWAY_PID"

sleep 5

if kill -0 $GATEWAY_PID 2>/dev/null; then
    echo "Gateway process is running (PID: $GATEWAY_PID)"
    wait $GATEWAY_PID
    EXIT_CODE=$?
    echo "Gateway exited with code: $EXIT_CODE"
else
    echo "Gateway process exited"
    wait $GATEWAY_PID 2>/dev/null
    EXIT_CODE=$?
    echo "Exit code: $EXIT_CODE"
fi

echo ""
echo "=== All attempts failed ==="
echo "Check /tmp/openclaw-startup.log for full output"
echo "Current directory contents:"
ls -la /root/.openclaw/
echo ""
echo "System information:"
uname -a
echo ""
echo "Memory info:"
free -m 2>/dev/null || echo "Cannot get memory info"

exit 1
