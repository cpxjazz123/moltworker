import type { Sandbox, Process as SandboxProcess } from '@cloudflare/sandbox';
import type { MoltbotEnv } from '../types';
import { MOLTBOT_PORT, STARTUP_TIMEOUT_MS } from '../config';
import { buildEnvVars } from './env';
import { mountR2Storage } from './r2';



/**
 * Find an existing OpenClaw gateway process
 *
 * @param sandbox - The sandbox instance
 * @returns The process if found and running/starting, null otherwise
 */
export async function findExistingMoltbotProcess(sandbox: Sandbox): Promise<SandboxProcess | null> {
  try {
    let processes: SandboxProcess[];
    try {
      processes = await sandbox.listProcesses();
    } catch (e) {
      throw new Error(`[Sandbox.listProcesses] Failed: ${e}`);
    }

    console.log('[Debug] Found processes count:', processes.length);
    for (const proc of processes) {
      // Match gateway process (openclaw gateway or legacy clawdbot gateway)
      const isGatewayProcess =
        proc.command.includes('start-openclaw.sh') ||
        proc.command.includes('openclaw gateway') ||
        proc.command.includes('start-moltbot.sh') ||
        proc.command.includes('clawdbot gateway');
      const isCliCommand =
        proc.command.includes('openclaw devices') ||
        proc.command.includes('openclaw --version') ||
        proc.command.includes('openclaw onboard') ||
        proc.command.includes('clawdbot devices') ||
        proc.command.includes('clawdbot --version');

      if (isGatewayProcess && !isCliCommand) {
        if (proc.status === 'starting' || proc.status === 'running') {
          return proc;
        } else {
          console.log('[Debug] Found gateway process but status is:', proc.status);
        }
      }
    }
  } catch (e) {
    const msg = String(e);
    console.error('[Gateway] Management API failed to list processes:', msg);
    // Rethrow with prefix if not already prefixed
    if (msg.includes('[Sandbox.listProcesses]')) {
      throw e;
    }
    throw new Error(`[findExistingMoltbotProcess] Error: ${msg}`);
  }
  console.log('[Debug] No running gateway process found');
  return null;
}

/**
 * Ensure the OpenClaw gateway is running
 *
 * This will:
 * 1. Mount R2 storage if configured
 * 2. Check for an existing gateway process
 * 3. Wait for it to be ready, or start a new one
 *
 * @param sandbox - The sandbox instance
 * @param env - Worker environment bindings
 * @returns The running gateway process
 */
// Helper to create a dummy process when API fails but service is up
function createDummyProcess(): any {
  return {
    id: 'dummy-' + Date.now().toString(36),
    status: 'running',
    command: 'dummy-gateway',
    kill: async () => console.log('Dummy kill called'),
    waitForPort: async () => console.log('Dummy waitForPort called'),
    getLogs: async () => ({ stdout: '', stderr: '' }),
    refresh: async () => { },
  };
}

export async function ensureMoltbotGateway(sandbox: Sandbox, env: MoltbotEnv): Promise<SandboxProcess> {
  console.log('[Gateway] ensureMoltbotGateway starting...');

  // Check if gateway is already responding (Fast Path)
  try {
    console.log('[Gateway] Attempting fast path ping...');
    const checkRequest = new Request(`http://localhost:${MOLTBOT_PORT}/sandbox-health`, { method: 'HEAD' });

    let resp;
    try {
      resp = await Promise.race([
        sandbox.containerFetch(checkRequest, MOLTBOT_PORT),
        new Promise<Response>((_, reject) => setTimeout(() => reject('timeout'), 2000))
      ]);
    } catch (e) {
      throw new Error(`[Sandbox.containerFetch] Failed during fast path: ${e}`);
    }

    if (resp && resp.status > 0) {
      console.log('[Gateway] Direct ping succeeded, skipping expensive checks');
      try {
        const proc = await Promise.race([
          findExistingMoltbotProcess(sandbox),
          new Promise<SandboxProcess | null>((_, reject) => setTimeout(() => reject('timeout'), 1000))
        ]);
        if (proc) return proc;
        console.log('[Gateway] No process found via API, but ping succeeded. Returning dummy process.');
        return createDummyProcess() as unknown as SandboxProcess;
      } catch (e) {
        console.log('[Gateway] Failed to find process via API (or timed out), but ping succeeded. Returning dummy process.', e);
        return createDummyProcess() as unknown as SandboxProcess;
      }
    }
  } catch (_e) {
    // Ping failed - only log, don't throw, proceed to standard startup
    const msg = String(_e);
    console.log('[Gateway] Fast path ping failed or timed out:', msg);
    // If it was our specific error, log it more prominently
    if (msg.includes('[Sandbox.containerFetch]')) {
      console.error('CRITICAL: Fast path containerFetch failed with:', msg);
    }
  }

  // Explicitly start the container if it's not running
  console.log('[Gateway] Ensuring container is started (sandbox.start)...');
  try {
    await sandbox.start();
    console.log('[Gateway] Container started/checked successfully');
  } catch (startErr) {
    const msg = String(startErr);
    console.log('[Gateway] Container start result/error:', msg);
    // If it's the "Specific" error we are looking for, wrap it
    if (msg.includes('Illegal invocation')) {
      throw new Error(`[Sandbox.start] Illegal invocation detected: ${msg}`);
    }
  }

  // Mount R2 storage for persistent data (non-blocking if not configured)
  console.log('[Gateway] Mounting R2 storage...');
  await mountR2Storage(sandbox, env);
  console.log('[Gateway] R2 storage mount finished');

  // Check if gateway is already running or starting
  console.log('[Gateway] Checking for existing process...');
  let existingProcess: SandboxProcess | null = null;
  try {
    existingProcess = await findExistingMoltbotProcess(sandbox);
  } catch (e) {
    console.log('[Gateway] Management API error during startup:', e);
  }

  if (existingProcess) {
    console.log(
      'Found existing gateway process:',
      existingProcess.id,
      'status:',
      existingProcess.status,
    );

    try {
      console.log('Waiting for gateway on port', MOLTBOT_PORT, 'timeout:', STARTUP_TIMEOUT_MS);
      try {
        await existingProcess.waitForPort(MOLTBOT_PORT, { mode: 'tcp', timeout: STARTUP_TIMEOUT_MS });
      } catch (e) {
        throw new Error(`[Process.waitForPort] Failed on existing process: ${e}`);
      }
      console.log(`[Gateway] Port ${MOLTBOT_PORT} detected via waitForPort`);
      console.log('Gateway is reachable');
      return existingProcess;
    } catch (_e) {
      console.log('Existing process not reachable after timeout, killing and restarting...', _e);
      try {
        await existingProcess.kill();
      } catch (killError) {
        console.log('Failed to kill process:', killError);
      }
    }
  }

  // Start a new OpenClaw gateway
  console.log('Starting new OpenClaw gateway...');
  const envVars = buildEnvVars(env);
  const command = '/usr/local/bin/start-openclaw.sh';

  let process: SandboxProcess;
  try {
    try {
      process = await sandbox.startProcess(command, {
        env: Object.keys(envVars).length > 0 ? envVars : undefined,
      });
    } catch (e) {
      throw new Error(`[Sandbox.startProcess] Failed to start gateway: ${e}`);
    }
    console.log('Process started with id:', process.id, 'status:', process.status);
  } catch (startErr) {
    console.error('Failed to start process:', startErr);
    throw startErr;
  }

  // Wait for the gateway to be ready
  try {
    console.log('[Gateway] Waiting for readiness on port', MOLTBOT_PORT);
    try {
      await process.waitForPort(MOLTBOT_PORT, { mode: 'tcp', timeout: STARTUP_TIMEOUT_MS });
    } catch (e) {
      // Capture detailed logs for diagnostics
      let logs = { stdout: 'N/A', stderr: 'N/A' };
      try {
        logs = await process.getLogs();
      } catch (logErr) {
        console.error('[Gateway] Failed to retrieve logs:', logErr);
      }
      console.error('[Gateway] Startup failed. Container logs:', logs.stderr.slice(-1000));
      throw new Error(`[Gateway.waitForPort] Timed out or failed: ${e}`);
    }
    console.log(`[Gateway] Port ${MOLTBOT_PORT} detected via waitForPort (new process)`);
    console.log('[Gateway] Ready!');
  } catch (e) {
    console.error('[Gateway] Fatal startup error:', e);
    throw e;
  }

  return process;
}
