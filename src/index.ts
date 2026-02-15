/**
 * Moltbot + Cloudflare Sandbox
 *
 * This Worker runs Moltbot personal AI assistant in a Cloudflare Sandbox container.
 * It proxies all requests to the Moltbot Gateway's web UI and WebSocket endpoint.
 *
 * Features:
 * - Web UI (Control Dashboard + WebChat) at /
 * - WebSocket support for real-time communication
 * - Admin UI at /_admin/ for device management
 * - Configuration via environment secrets
 *
 * Required secrets (set via `wrangler secret put`):
 * - ANTHROPIC_API_KEY: Your Anthropic API key
 *
 * Optional secrets:
 * - MOLTBOT_GATEWAY_TOKEN: Token to protect gateway access
 * - TELEGRAM_BOT_TOKEN: Telegram bot token
 * - DISCORD_BOT_TOKEN: Discord bot token
 * - SLACK_BOT_TOKEN + SLACK_APP_TOKEN: Slack tokens
 */

import { Hono } from 'hono';
import { getSandbox, Sandbox, type SandboxOptions } from '@cloudflare/sandbox';

import type { AppEnv, MoltbotEnv } from './types';
import { MOLTBOT_PORT } from './config';
import { createAccessMiddleware } from './auth';
import { ensureMoltbotGateway, findExistingMoltbotProcess, syncToR2 } from './gateway';
import { publicRoutes, api, adminUi, debug, cdp } from './routes';
import { redactSensitiveParams } from './utils/logging';
import loadingPageHtml from './assets/loading.html';
import configErrorHtml from './assets/config-error.html';

/**
 * Transform error messages from the gateway to be more user-friendly.
 */
function transformErrorMessage(message: string, host: string): string {
  if (message.includes('gateway token missing') || message.includes('gateway token mismatch')) {
    return `Invalid or missing token. Visit https://${host}?token={REPLACE_WITH_YOUR_TOKEN}`;
  }

  if (message.includes('pairing required')) {
    return `Pairing required. Visit https://${host}/_admin/`;
  }

  return message;
}

export { Sandbox, Sandbox as MoltbotSandbox };

/**
 * Validate required environment variables.
 * Returns an array of missing variable descriptions, or empty array if all are set.
 */
function validateRequiredEnv(env: MoltbotEnv): string[] {
  const missing: string[] = [];
  const isTestMode = env.DEV_MODE === 'true' || env.E2E_TEST_MODE === 'true';

  // MOLTBOT_GATEWAY_TOKEN is optional - if not set, device pairing mode is used

  // CF Access vars not required in dev/test mode since auth is skipped
  if (!isTestMode) {
    if (!env.CF_ACCESS_TEAM_DOMAIN) {
      missing.push('CF_ACCESS_TEAM_DOMAIN');
    }

    if (!env.CF_ACCESS_AUD) {
      missing.push('CF_ACCESS_AUD');
    }
  }

  // Check for AI provider configuration (at least one must be set)
  const hasCloudflareGateway = !!(
    env.CLOUDFLARE_AI_GATEWAY_API_KEY &&
    env.CF_AI_GATEWAY_ACCOUNT_ID &&
    env.CF_AI_GATEWAY_GATEWAY_ID
  );
  const hasLegacyGateway = !!(env.AI_GATEWAY_API_KEY && env.AI_GATEWAY_BASE_URL);
  const hasAnthropicKey = !!env.ANTHROPIC_API_KEY;
  const hasOpenAIKey = !!env.OPENAI_API_KEY;

  if (!hasCloudflareGateway && !hasLegacyGateway && !hasAnthropicKey && !hasOpenAIKey) {
    missing.push(
      'ANTHROPIC_API_KEY, OPENAI_API_KEY, or CLOUDFLARE_AI_GATEWAY_API_KEY + CF_AI_GATEWAY_ACCOUNT_ID + CF_AI_GATEWAY_GATEWAY_ID',
    );
  }

  return missing;
}

/**
 * Build sandbox options based on environment configuration.
 *
 * SANDBOX_SLEEP_AFTER controls how long the container stays alive after inactivity:
 * - 'never' (default): Container stays alive indefinitely (recommended due to long cold starts)
 * - Duration string: e.g., '10m', '1h', '30s' - container sleeps after this period of inactivity
 *
 * To reduce costs at the expense of cold start latency, set SANDBOX_SLEEP_AFTER to a duration:
 *   npx wrangler secret put SANDBOX_SLEEP_AFTER
 *   # Enter: 10m (or 1h, 30m, etc.)
 */
function buildSandboxOptions(env: MoltbotEnv): SandboxOptions {
  const sleepAfter = env.SANDBOX_SLEEP_AFTER?.toLowerCase() || 'never';

  // 'never' means keep the container alive indefinitely
  if (sleepAfter === 'never') {
    return { keepAlive: true };
  }

  // Otherwise, use the specified duration
  return { sleepAfter };
}

// Global cache for gateway ready state
const READY_CACHE = new Set<string>();
const SANDBOX_ID = 'moltbot-v4';

// Main app
const app = new Hono<AppEnv>();

// =============================================================================
// MIDDLEWARE: Applied to ALL routes
// =============================================================================

// Middleware: Log every request
app.use('*', async (c, next) => {
  const url = new URL(c.req.url);
  const redactedSearch = redactSensitiveParams(url);
  console.log(`[REQ] ${c.req.method} ${url.pathname}${redactedSearch}`);
  await next();
});

// Middleware: Initialize sandbox for all requests
app.use('*', async (c, next) => {
  const url = new URL(c.req.url);
  if (url.pathname === '/sandbox-health') {
    return next();
  }

  // Get persistent sandbox instance
  const options = buildSandboxOptions(c.env);
  const sandbox = getSandbox(c.env.Sandbox, SANDBOX_ID, options);
  c.set('sandbox', sandbox);

  // Ensure container is running
  try {
    const startTime = Date.now();
    await sandbox.start();
    console.log(`[Middleware] Container start/check finished in ${Date.now() - startTime}ms`);
  } catch (err) {
    const msg = String(err);
    if (!msg.includes('already running')) {
      console.error('[Middleware] Container start failed:', msg);
      // If it's a fatal start error (not just 'starting'), we might want to clear cache
      READY_CACHE.delete(SANDBOX_ID);
    }
  }

  await next();
});

// =============================================================================
// PUBLIC ROUTES: No Cloudflare Access authentication required
// =============================================================================

// Mount public routes first (before auth middleware)
// Includes: /sandbox-health, /logo.png, /logo-small.png, /api/status, /_admin/assets/*
app.route('/', publicRoutes);

// Mount CDP routes (uses shared secret auth via query param, not CF Access)
app.route('/cdp', cdp);

// =============================================================================
// PROTECTED ROUTES: Cloudflare Access authentication required
// =============================================================================

// Middleware: Validate required environment variables (skip in dev mode and for debug routes)
app.use('*', async (c, next) => {
  const url = new URL(c.req.url);

  // Skip validation for debug routes (they have their own enable check)
  if (url.pathname.startsWith('/debug')) {
    return next();
  }

  // Skip validation in dev mode
  if (c.env.DEV_MODE === 'true') {
    return next();
  }

  const missingVars = validateRequiredEnv(c.env);
  if (missingVars.length > 0) {
    console.error('[CONFIG] Missing required environment variables:', missingVars.join(', '));

    const acceptsHtml = c.req.header('Accept')?.includes('text/html');
    if (acceptsHtml) {
      // Return a user-friendly HTML error page
      const html = configErrorHtml.replace('{{MISSING_VARS}}', missingVars.join(', '));
      return c.html(html, 503);
    }

    // Return JSON error for API requests
    return c.json(
      {
        error: 'Configuration error',
        message: 'Required environment variables are not configured',
        missing: missingVars,
        hint: 'Set these using: wrangler secret put <VARIABLE_NAME>',
      },
      503,
    );
  }

  return next();
});

// Middleware: Cloudflare Access authentication for protected routes
app.use('*', async (c, next) => {
  // Allow bypassing Access if:
  // 1. It's a WebSocket request
  // 2. A valid MOLTBOT_GATEWAY_TOKEN is provided in the query
  const upgradeHeader = c.req.header('Upgrade');
  if (upgradeHeader === 'websocket') {
    const url = new URL(c.req.url);
    const token = url.searchParams.get('token');
    // Using a constant time comparison would be better, but for this use case string comparison is acceptable
    if (token && c.env.MOLTBOT_GATEWAY_TOKEN && token === c.env.MOLTBOT_GATEWAY_TOKEN) {
      console.log('[AUTH] Bypassing Cloudflare Access for WebSocket with valid token');
      c.set('accessUser', { email: 'cli@bot', name: 'Moltbot CLI' });
      return next();
    }
  }

  // Determine response type based on Accept header
  const acceptsHtml = c.req.header('Accept')?.includes('text/html');
  const middleware = createAccessMiddleware({
    type: acceptsHtml ? 'html' : 'json',
    redirectOnMissing: acceptsHtml,
  });

  return middleware(c, next);
});

// Mount API routes (protected by Cloudflare Access)
app.route('/api', api);

// Mount Admin UI routes (protected by Cloudflare Access)
app.route('/_admin', adminUi);

// Mount debug routes (protected by Cloudflare Access, only when DEBUG_ROUTES is enabled)
app.use('/debug/*', async (c, next) => {
  if (c.env.DEBUG_ROUTES !== 'true') {
    return c.json({ error: 'Debug routes are disabled' }, 404);
  }
  return next();
});
app.route('/debug', debug);

// =============================================================================
// CATCH-ALL: Proxy to Moltbot gateway
// =============================================================================

app.all('*', async (c) => {
  // Use bound sandbox from context
  const sandbox = c.get('sandbox');
  const request = c.req.raw;
  const url = new URL(request.url);

  console.log('[PROXY] Handling request:', url.pathname);

  const isWebSocketRequest = request.headers.get('Upgrade')?.toLowerCase() === 'websocket';
  const acceptsHtml = request.headers.get('Accept')?.includes('text/html');
  const isPreviouslyReady = READY_CACHE.has(SANDBOX_ID);

  // Final Proxy Logic
  let errorMessage = '';
  try {
    // STARTUP LOGIC:
    // If we aren't "ready", we trigger startup in the background and show the loading page.
    if (!isPreviouslyReady) {
      if (acceptsHtml && !isWebSocketRequest) {
        console.log('[PROXY] Gateway not ready, showing loading page and triggering startup in background...');

        // Use waitUntil to trigger startup without blocking the loading page response
        c.executionCtx.waitUntil(
          (async () => {
            try {
              await ensureMoltbotGateway(sandbox, c.env);
              READY_CACHE.add(SANDBOX_ID);
              console.log('[PROXY] Background startup from catch-all successful.');
            } catch (e) {
              console.error('[PROXY] Background startup from catch-all failed:', e);
            }
          })()
        );

        return c.html(loadingPageHtml);
      }

      // For non-HTML/WS (API calls), we MUST wait for startup or they will fail
      try {
        await ensureMoltbotGateway(sandbox, c.env);
        READY_CACHE.add(SANDBOX_ID);
      } catch (e) {
        throw new Error(`[ensureMoltbotGateway fail] ${e}`);
      }
    }
  } catch (error) {
    console.error('[PROXY] Failed to ensure Moltbot:', error);
    errorMessage = error instanceof Error ? error.message : 'Unknown error';

    let hint = 'Check worker logs with: wrangler tail';
    if (!c.env.ANTHROPIC_API_KEY) {
      hint = 'ANTHROPIC_API_KEY is not set. Run: wrangler secret put ANTHROPIC_API_KEY';
    } else if (errorMessage.includes('heap out of memory') || errorMessage.includes('OOM')) {
      hint = 'Gateway ran out of memory. Try again or check for memory leaks.';
    }

    return c.json(
      {
        error: 'Moltbot gateway failed to start',
        details: errorMessage,
        hint,
      },
      503,
    );
  } finally {
    // If we failed with a "not running" error, clear cache so next request retries
    if (errorMessage.includes('not running')) {
      READY_CACHE.delete(SANDBOX_ID);
    }
  }

  // Proxy to Moltbot with WebSocket message interception
  if (isWebSocketRequest) {
    const debugLogs = c.env.DEBUG_ROUTES === 'true';
    const redactedSearch = redactSensitiveParams(url);

    console.log('[WS] Proxying WebSocket connection to Moltbot');
    if (debugLogs) {
      console.log('[WS] URL:', url.pathname + redactedSearch);
    }

    // Inject gateway token into WebSocket request if not already present.
    // CF Access redirects strip query params, so authenticated users lose ?token=.
    // Since the user already passed CF Access auth, we inject the token server-side.
    let wsRequest = request;
    if (c.env.MOLTBOT_GATEWAY_TOKEN && !url.searchParams.has('token')) {
      const tokenUrl = new URL(url.toString());
      tokenUrl.searchParams.set('token', c.env.MOLTBOT_GATEWAY_TOKEN);
      wsRequest = new Request(tokenUrl.toString(), request);
    }

    // Get WebSocket connection to the container
    let containerResponse;
    try {
      const rawSandbox = getSandbox(c.env.Sandbox, SANDBOX_ID, buildSandboxOptions(c.env));
      containerResponse = await rawSandbox.wsConnect(wsRequest, MOLTBOT_PORT);
    } catch (e) {
      throw new Error(`[Sandbox.wsConnect] Proxy fail: ${e}`);
    }
    console.log('[WS] wsConnect response status:', containerResponse.status);

    // Get the container-side WebSocket
    const containerWs = containerResponse.webSocket;
    if (!containerWs) {
      console.error('[WS] No WebSocket in container response - falling back to direct proxy');
      return containerResponse;
    }

    if (debugLogs) {
      console.log('[WS] Got container WebSocket, setting up interception');
    }

    // Create a WebSocket pair for the client
    const [clientWs, serverWs] = Object.values(new WebSocketPair());

    // Accept both WebSockets
    serverWs.accept();
    containerWs.accept();

    if (debugLogs) {
      console.log('[WS] Both WebSockets accepted');
      console.log('[WS] containerWs.readyState:', containerWs.readyState);
      console.log('[WS] serverWs.readyState:', serverWs.readyState);
    }

    // Relay messages from client to container
    serverWs.addEventListener('message', (event: any) => {
      if (containerWs.readyState === WebSocket.OPEN) {
        containerWs.send(event.data);
      }
    });

    // Relay messages from container to client, with error transformation
    containerWs.addEventListener('message', (event: any) => {
      let data = event.data;

      // Try to intercept and transform error messages
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error?.message) {
            parsed.error.message = transformErrorMessage(parsed.error.message, url.host);
            data = JSON.stringify(parsed);
          }
        } catch (e) {
          // Not JSON
        }
      }

      if (serverWs.readyState === WebSocket.OPEN) {
        serverWs.send(data);
      }
    });

    // Handle close events
    serverWs.addEventListener('close', (event: any) => {
      containerWs.close(event.code, event.reason);
    });

    containerWs.addEventListener('close', (event: any) => {
      let reason = transformErrorMessage(event.reason, url.host);
      if (reason.length > 123) {
        reason = reason.slice(0, 120) + '...';
      }
      serverWs.close(event.code, reason);
    });

    // Handle errors
    serverWs.addEventListener('error', (event: any) => {
      console.error('[WS] Client error:', event);
      containerWs.close(1011, 'Client error');
    });

    containerWs.addEventListener('error', (event: any) => {
      console.error('[WS] Container error:', event);
      serverWs.close(1011, 'Container error');
    });

    if (debugLogs) {
      console.log('[WS] Returning intercepted WebSocket response');
    }
    return new Response(null, {
      status: 101,
      webSocket: clientWs,
    });
  }

  console.log('[HTTP] Proxying:', url.pathname + url.search);

  // Recreate request
  const proxyUrl = new URL(`http://localhost:${MOLTBOT_PORT}${url.pathname}${url.search}`);

  // Clone request to avoid body consumption issues on retry
  const proxyRequest = new Request(proxyUrl.toString(), request.clone() as Request);

  try {
    // Re-fetch raw sandbox stub to ensure no property corruption/this context issues
    const rawSandbox = getSandbox(c.env.Sandbox, SANDBOX_ID, buildSandboxOptions(c.env));
    let httpResponse = await rawSandbox.containerFetch(proxyRequest, MOLTBOT_PORT);
    console.log('[HTTP] Response status:', httpResponse.status);

    // If we get the specific "not running" error from the SDK, retry starting and fetching once
    if (httpResponse.status === 500) {
      const clonedResponse = httpResponse.clone();
      const body = await clonedResponse.text();
      if (body.includes('The container is not running')) {
        console.warn('[HTTP] Container reported as not running during fetch. Retrying start...');
        READY_CACHE.delete(SANDBOX_ID);

        await rawSandbox.start();
        await ensureMoltbotGateway(rawSandbox, c.env);
        READY_CACHE.add(SANDBOX_ID);

        // Re-cloning again for second attempt
        const retryRequest = new Request(proxyUrl.toString(), request.clone() as Request);
        httpResponse = await rawSandbox.containerFetch(retryRequest, MOLTBOT_PORT);
      }
    }

    console.log('[HTTP] Response status:', httpResponse.status);

    // Add debug header to verify worker handled the request
    const newHeaders = new Headers(httpResponse.headers);
    newHeaders.set('X-Worker-Debug', 'proxy-to-moltbot');
    newHeaders.set('X-Debug-Path', url.pathname);

    return new Response(httpResponse.body, {
      status: httpResponse.status,
      statusText: httpResponse.statusText,
      headers: newHeaders,
    });
  } catch (e) {
    console.error('[HTTP] Proxy fail:', e);
    const proxyError = String(e);

    // If proxy fails, try to get gateway logs for debugging
    let logs = 'Unable to retrieve logs';
    try {
      const gProcess = await findExistingMoltbotProcess(sandbox);
      if (gProcess) {
        const fullLogs = await gProcess.getLogs();
        logs = fullLogs.stderr.slice(-2000) || fullLogs.stdout.slice(-2000) || 'Logs are empty';
      }
    } catch (logErr) {
      logs = `Failed to get logs: ${logErr}`;
    }

    return c.json(
      {
        error: 'Error proxying request to container',
        details: proxyError,
        container_logs: logs,
        hint: 'Check if the gateway process crashed or is binding to the wrong address (should be 0.0.0.0).',
      },
      502,
    );
  }
});

/**
 * Scheduled handler for cron triggers.
 * Syncs moltbot config/state from container to R2 for persistence.
 */
async function scheduled(
  _event: ScheduledEvent,
  env: MoltbotEnv,
  _ctx: ExecutionContext,
): Promise<void> {
  const options = buildSandboxOptions(env);
  const sandbox = getSandbox(env.Sandbox, SANDBOX_ID, options);

  // Ensure container is running
  try {
    await sandbox.start();
  } catch (err) {
    const msg = String(err);
    if (!msg.includes('already running')) {
      console.error('[cron] Container start fail:', msg);
      return;
    }
  }

  // Ensure gateway is running (Immortality check)
  console.log('[cron] Ensuring Moltbot is running...');
  try {
    const gatewayProcess = await ensureMoltbotGateway(sandbox, env);
    console.log('[cron] Gateway is alive (id:', gatewayProcess.id, ')');
    READY_CACHE.add(SANDBOX_ID);
  } catch (err) {
    console.error('[cron] Failed to ensure gateway during keep-alive:', err);
    return;
  }

  console.log('[cron] Starting backup sync to R2...');
  const result = await syncToR2(sandbox, env);

  if (result.success) {
    console.log('[cron] Backup sync completed successfully at', result.lastSync);
  } else {
    console.error('[cron] Backup sync failed:', result.error, result.details || '');
  }
}

export default {
  fetch: app.fetch,
  scheduled,
};
