/**
 * ASI1AI Tool
 * Provides access to ASI:One AI for advanced reasoning and image generation
 * Can be used as fallback or for specialized tasks
 */

import { Type } from "@sinclair/typebox";
import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import type { MoltbotConfig } from "../../config/config.js";
import type { AnyAgentTool } from "./common.js";
import { jsonResult, readStringParam, readNumberParam } from "./common.js";

interface ASI1AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ASI1AIChatResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
      reasoning?: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ASI1AIImageResponse {
  created: number;
  images: Array<{
    url: string;
  }>;
  message?: string;
  status: number;
}

const ASI1AIToolSchema = Type.Object({
  action: Type.Union([Type.Literal("chat"), Type.Literal("image")], {
    description: "Action: 'chat' for reasoning/completion, 'image' for generation",
  }),
  prompt: Type.String({
    description: "The main prompt/question for the AI",
  }),
  context: Type.Optional(
    Type.String({
      description: "Additional context or system instructions (for chat)",
    }),
  ),
  model: Type.Optional(
    Type.String({
      description: "Model to use: 'asi1-mini' (default) or 'asi1-plus'",
    }),
  ),
  temperature: Type.Optional(
    Type.Number({
      description: "Temperature (0.0-1.0). Higher = more creative",
      minimum: 0,
      maximum: 1,
    }),
  ),
  max_tokens: Type.Optional(
    Type.Number({
      description: "Maximum tokens in response",
      minimum: 1,
      maximum: 4096,
    }),
  ),
  image_size: Type.Optional(
    Type.String({
      description: "Image size for generation: '512x512', '1024x1024', etc",
    }),
  ),
});

export function createASI1AITool(_options?: { config?: MoltbotConfig }): AnyAgentTool {
  return {
    label: "ASI1:One",
    name: "asi1ai",
    description:
      "Access ASI:One AI for advanced reasoning, problem-solving, and image generation. Use 'chat' for complex questions or as reasoning fallback, 'image' for visual content generation.",
    parameters: ASI1AIToolSchema,
    execute: async (_toolCallId, args, signal) => {
      if (signal?.aborted) {
        const err = new Error("ASI1AI operation aborted");
        err.name = "AbortError";
        throw err;
      }

      const params = args as Record<string, unknown>;
      const action = readStringParam(params, "action", { required: true });

      // Get API key from environment
      const apiKey = process.env.ASI1AI_API_KEY;
      if (!apiKey) {
        return jsonResult({
          success: false,
          error: "ASI1AI_API_KEY not configured in environment",
          suggestion: "Add ASI1AI_API_KEY to your .env file",
        });
      }

      if (action === "chat") {
        return await handleChatCompletion(params, apiKey);
      }

      if (action === "image") {
        return await handleImageGeneration(params, apiKey);
      }

      throw new Error(`Unsupported ASI1AI action: ${action}`);
    },
  };
}

async function handleChatCompletion(
  params: Record<string, unknown>,
  apiKey: string,
): Promise<AgentToolResult<unknown>> {
  const prompt = readStringParam(params, "prompt", { required: true });
  const context = readStringParam(params, "context");
  const model = readStringParam(params, "model") || "asi1-mini";
  const temperature = readNumberParam(params, "temperature") || 0.7;
  const maxTokens = readNumberParam(params, "max_tokens") || 2048;

  // Build messages array
  const messages: ASI1AIMessage[] = [];

  if (context) {
    messages.push({
      role: "system",
      content: context,
    });
  }

  messages.push({
    role: "user",
    content: prompt,
  });

  try {
    const response = await fetch("https://api.asi1.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return jsonResult({
        success: false,
        error: `ASI1AI API error: ${response.status} ${response.statusText}`,
        details: errorText,
      });
    }

    const data: ASI1AIChatResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return jsonResult({
        success: false,
        error: "No response from ASI1AI",
      });
    }

    const choice = data.choices[0];
    const content = choice.message.content;
    const reasoning = choice.message.reasoning;

    return jsonResult({
      success: true,
      model: data.model,
      content,
      reasoning,
      usage: {
        prompt_tokens: data.usage.prompt_tokens,
        completion_tokens: data.usage.completion_tokens,
        total_tokens: data.usage.total_tokens,
      },
      finish_reason: choice.finish_reason,
    });
  } catch (error: any) {
    return jsonResult({
      success: false,
      error: `ASI1AI request failed: ${error.message}`,
      suggestion: "Check network connection and API key validity",
    });
  }
}

async function handleImageGeneration(
  params: Record<string, unknown>,
  apiKey: string,
): Promise<AgentToolResult<unknown>> {
  const prompt = readStringParam(params, "prompt", { required: true });
  const model = readStringParam(params, "model") || "asi1-mini";
  const size = readStringParam(params, "image_size") || "1024x1024";

  try {
    const response = await fetch("https://api.asi1.ai/v1/image/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        size,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return jsonResult({
        success: false,
        error: `ASI1AI Image API error: ${response.status} ${response.statusText}`,
        details: errorText,
      });
    }

    const data: ASI1AIImageResponse = await response.json();

    if (!data.images || data.images.length === 0) {
      return jsonResult({
        success: false,
        error: data.message || "No image generated",
      });
    }

    return jsonResult({
      success: true,
      model,
      prompt,
      size,
      image_url: data.images[0].url,
      total_images: data.images.length,
      message: "Image generated successfully. Use the URL to download or display.",
    });
  } catch (error: any) {
    return jsonResult({
      success: false,
      error: `ASI1AI image generation failed: ${error.message}`,
      suggestion: "Check network connection and API key validity",
    });
  }
}
