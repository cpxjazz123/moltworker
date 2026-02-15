import type { MoltbotEnv } from '../types';

/**
 * Build environment variables to pass to the OpenClaw container process
 *
 * @param env - Worker environment bindings
 * @returns Environment variables record
 */
export function buildEnvVars(env: MoltbotEnv): Record<string, string> {
  const envVars: Record<string, string> = {
    // Prevent interactive prompts and update checks that hang the container
    CI: 'true',
    NO_UPDATE_NOTIFIER: '1',
    NPM_CONFIG_UPDATE_NOTIFIER: 'false',
  };

  // Helper to safely add to record as string
  const add = (key: string, value: any) => {
    if (value !== undefined && value !== null) {
      envVars[key] = String(value);
    }
  };

  // Cloudflare AI Gateway configuration (new native provider)
  add('CLOUDFLARE_AI_GATEWAY_API_KEY', env.CLOUDFLARE_AI_GATEWAY_API_KEY);
  add('CF_AI_GATEWAY_ACCOUNT_ID', env.CF_AI_GATEWAY_ACCOUNT_ID);
  add('CF_AI_GATEWAY_GATEWAY_ID', env.CF_AI_GATEWAY_GATEWAY_ID);

  // Direct provider keys
  add('ANTHROPIC_API_KEY', env.ANTHROPIC_API_KEY);
  add('OPENAI_API_KEY', env.OPENAI_API_KEY);

  // Legacy AI Gateway support: AI_GATEWAY_BASE_URL + AI_GATEWAY_API_KEY
  // When set, these override direct keys for backward compatibility
  if (env.AI_GATEWAY_API_KEY && env.AI_GATEWAY_BASE_URL) {
    const normalizedBaseUrl = String(env.AI_GATEWAY_BASE_URL).replace(/\/+$/, '');
    envVars.AI_GATEWAY_BASE_URL = normalizedBaseUrl;
    // Legacy path routes through Anthropic base URL
    envVars.ANTHROPIC_BASE_URL = normalizedBaseUrl;
    envVars.ANTHROPIC_API_KEY = String(env.AI_GATEWAY_API_KEY);
  } else if (env.ANTHROPIC_BASE_URL) {
    add('ANTHROPIC_BASE_URL', env.ANTHROPIC_BASE_URL);
  }

  // Map MOLTBOT_GATEWAY_TOKEN to OPENCLAW_GATEWAY_TOKEN (container expects this name)
  add('OPENCLAW_GATEWAY_TOKEN', env.MOLTBOT_GATEWAY_TOKEN);
  add('OPENCLAW_DEV_MODE', env.DEV_MODE);
  add('TELEGRAM_BOT_TOKEN', env.TELEGRAM_BOT_TOKEN);
  add('TELEGRAM_DM_POLICY', env.TELEGRAM_DM_POLICY);
  add('DISCORD_BOT_TOKEN', env.DISCORD_BOT_TOKEN);
  add('DISCORD_DM_POLICY', env.DISCORD_DM_POLICY);
  add('SLACK_BOT_TOKEN', env.SLACK_BOT_TOKEN);
  add('SLACK_APP_TOKEN', env.SLACK_APP_TOKEN);
  add('CF_AI_GATEWAY_MODEL', env.CF_AI_GATEWAY_MODEL);
  add('CF_ACCOUNT_ID', env.CF_ACCOUNT_ID);
  add('CDP_SECRET', env.CDP_SECRET);
  add('WORKER_URL', env.WORKER_URL);

  return envVars;
}
