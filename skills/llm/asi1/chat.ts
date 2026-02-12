#!/usr/bin/env node
/**
 * @file chat.ts
 * @description ASI1 chat completion
 * @usage pnpm moltbot llm asi1 chat "Your message here"
 */

import { ASI1_CONFIG, getAPIKey } from './config.js';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ChatOptions {
  message: string;
  system?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

async function chat(options: ChatOptions): Promise<void> {
  console.log('🧠 ASI1 LLM Chat');
  console.log('─'.repeat(40));
  console.log('');

  const apiKey = getAPIKey();
  const model = options.model || ASI1_CONFIG.defaults.model;

  // Build messages
  const messages: ChatMessage[] = [];
  
  if (options.system) {
    messages.push({ role: 'system', content: options.system });
  }
  
  messages.push({ role: 'user', content: options.message });

  const requestBody: ChatCompletionRequest = {
    model,
    messages,
    temperature: options.temperature || ASI1_CONFIG.defaults.temperature,
    max_tokens: options.maxTokens || ASI1_CONFIG.defaults.maxTokens,
    stream: false,
  };

  console.log(`📋 Config:`);
  console.log(`   Model: ${model}`);
  console.log(`   Temperature: ${requestBody.temperature}`);
  console.log(`   Max Tokens: ${requestBody.max_tokens}`);
  console.log('');
  console.log('⏳ Sending request to ASI1...');
  console.log('');

  try {
    const response = await fetch(`${ASI1_CONFIG.baseURL}${ASI1_CONFIG.endpoints.chat}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ASI1 API error (${response.status}): ${errorText}`);
    }

    const data: ChatCompletionResponse = await response.json();

    console.log('🤖 ASI1 Response:');
    console.log('─'.repeat(40));
    console.log('');
    console.log(data.choices[0].message.content);
    console.log('');
    console.log('─'.repeat(40));
    console.log(`📊 Usage:`);
    console.log(`   Prompt: ${data.usage.prompt_tokens} tokens`);
    console.log(`   Completion: ${data.usage.completion_tokens} tokens`);
    console.log(`   Total: ${data.usage.total_tokens} tokens`);
    console.log(`   Cost: ~$${(data.usage.total_tokens / 1000000 * 0.15).toFixed(4)}`);
    console.log('');
    console.log(`✅ Chat complete (ID: ${data.id})`);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   1. Check API key in .env: ASI1AI_API_KEY');
    console.log('   2. Verify endpoint: https://api.asi1.ai/v1/chat/completions');
    console.log('   3. Test with curl (see SKILL.md)');
    console.log('   4. Check docs: https://docs.asi1.ai');
    process.exit(1);
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  
  // Parse arguments
  const options: ChatOptions = {
    message: '',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--message':
      case '-m':
        options.message = next;
        i++;
        break;
      case '--system':
      case '-s':
        options.system = next;
        i++;
        break;
      case '--model':
        options.model = next;
        i++;
        break;
      case '--temperature':
      case '-t':
        options.temperature = parseFloat(next);
        i++;
        break;
      case '--max-tokens':
        options.maxTokens = parseInt(next, 10);
        i++;
        break;
      case '--help':
      case '-h':
        console.log(`
Usage: pnpm moltbot llm asi1 chat [options] <message>

Options:
  -m, --message <text>        User message (required)
  -s, --system <text>         System prompt
  --model <name>              Model (asi1-preview, asi1-turbo, asi1-mini)
  -t, --temperature <number>  Temperature (0-1) (default: 0.7)
  --max-tokens <number>       Max tokens (default: 2000)
  -h, --help                  Show this help

Examples:
  pnpm moltbot llm asi1 chat -m "Explain quantum computing"
  pnpm moltbot llm asi1 chat -m "Analyze this" -s "You are an expert"
  pnpm moltbot llm asi1 chat -m "Quick answer" --model asi1-turbo
        `);
        process.exit(0);
    }
  }

  // If no --message flag, treat first positional arg as message
  if (!options.message && args.length > 0 && !args[0].startsWith('-')) {
    options.message = args.join(' ');
  }

  // Validate required args
  if (!options.message) {
    console.error('❌ Missing required argument: message');
    console.log('Run with --help for usage');
    process.exit(1);
  }

  // Run chat
  chat(options).catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

export { chat, ChatOptions };
