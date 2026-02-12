/**
 * @file config.ts
 * @description ASI1 LLM configuration
 */

export const ASI1_CONFIG = {
  apiKey: process.env.ASI1AI_API_KEY || '',
  baseURL: 'https://api.asi1.ai/v1',
  endpoints: {
    chat: '/chat/completions',
    models: '/models',
  },
  models: {
    preview: 'asi1-preview', // 128K context
    turbo: 'asi1-turbo', // 32K context, faster
    mini: 'asi1-mini', // 16K context, cheaper
  },
  defaults: {
    model: 'asi1-preview',
    temperature: 0.7,
    maxTokens: 2000,
    stream: false,
  },
  limits: {
    requestsPerMinute: 100,
    tokensPerRequest: 128000,
  },
};

export function getAPIKey(): string {
  if (!ASI1_CONFIG.apiKey) {
    throw new Error('ASI1AI_API_KEY not found in environment variables');
  }
  return ASI1_CONFIG.apiKey;
}
