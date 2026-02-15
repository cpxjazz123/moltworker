---
name: moltbot-ops
description: Operations and troubleshooting guide for running Moltbot (OpenClaw) on Cloudflare Workers Sandbox. Covers memory configuration, custom model injection, and TUI remote connection bypass.
---

# Moltbot Operations (Cloudflare Sandbox)

This skill covers frequent tasks and troubleshooting steps for maintaining a Moltbot instance in a containerized Cloudflare environment.

## 1. Instance Configuration

Moltbot is a resource-intensive Node.js application. Avoid using the default instance size as it will likely result in Out-Of-Memory (OOM) errors.

- **Check/Update Instance Type**:
  In `wrangler.jsonc`, ensure `instance_type` is set to `standard-1` (4 GiB) or higher.
  ```json
  "containers": [
    {
      "class_name": "Sandbox",
      "instance_type": "standard-1",
      "max_instances": 1
    }
  ]
  ```

## 2. Injecting Custom Models (GLM-4.7 etc.)

If the default `openclaw onboard` doesn't support your specific model provider, use the `start-openclaw.sh` hook to patch the configuration at runtime.

### Patch Pattern:
Add the following to the `node` patching section in `start-openclaw.sh`:
```javascript
if (process.env.ANTHROPIC_API_KEY && !process.env.CF_AI_GATEWAY_MODEL) {
    config.models.providers['anthropic'] = {
        baseUrl: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
        apiKey: process.env.ANTHROPIC_API_KEY,
        api: 'anthropic-messages',
        models: [{ id: 'glm-4.7', name: 'GLM-4.7', contextWindow: 200000, maxTokens: 8192 }]
    };
    config.agents.defaults.model = { primary: 'anthropic/glm-4.7' };
}
```

## 3. Remote TUI Connectivity

Remote connection via `openclaw tui` normally fails due to Cloudflare Access. We use a token-based bypass.

### Usage:
1. Ensure `MOLTBOT_GATEWAY_TOKEN` is set in secrets.
2. The Worker handles the bypass in `src/index.ts`.
3. Connect using:
   ```bash
   npx openclaw tui --url "wss://your-worker.workers.dev/ws?token=YOUR_TOKEN" --token "YOUR_TOKEN"
   ```

## 4. Deployment Troubleshooting

- **Docker Error**: If `wrangler deploy` fails with "Docker CLI could not be launched", start the daemon:
  ```bash
  sudo dockerd > /tmp/dockerd.log 2>&1 &
  ```
- **Cold Starts**: Initial connection after inactivity can take 30-60s as the container boots. Do not refresh; wait for the loading screen to disappear.

## 5. Git Workflow for Forks

To prevent accidental Pull Requests to the main repository:
1. Set up remotes:
   ```bash
   git remote rename origin upstream
   git remote add origin git@github.com:YOUR_USERNAME/moltworker.git
   ```
2. When pushing, always check active branch and target:
   ```bash
   git push origin feat/your-feature
   ```
3. Avoid clicking "Compare & pull request" on GitHub if you intend to keep the code in your private fork.
