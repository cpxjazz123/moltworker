#!/bin/bash
# WebClaw startup script with environment variables
export CLAWDBOT_GATEWAY_URL=wss://moltbot-sandbox.xsun.workers.dev/ws
export CLAWDBOT_GATEWAY_TOKEN=eb6268f2c9a0db35989a428089dcfb5ca51d061ba8b3f38f009eb0fcb80f08ef

cd "$(dirname "$0")"
pnpm -C apps/webclaw dev
