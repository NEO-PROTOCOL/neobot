
import { ReactorRule } from "./config.js";

interface EventPayload {
  __chainId?: string;
  __depth?: number;
  [key: string]: any;
}

// --- 1. Circuit Breaker (Event Depth) ---

export class CircuitBreaker {
  private static MAX_DEPTH = 10;

  static check(payload: EventPayload, eventName: string): boolean {
    const chainId = payload.__chainId || crypto.randomUUID();
    const depth = payload.__depth || 0;

    if (depth > this.MAX_DEPTH) {
      console.error(`[NEXUS] 🛑 Circuit Breaker Triggered! Event: ${eventName}, Chain: ${chainId}, Depth: ${depth}`);
      return false; // Block dispatch
    }
    
    // Mutate Payload to carry state forward
    payload.__chainId = chainId;
    payload.__depth = depth + 1;
    return true;
  }
}

// --- 2. Idempotency Check (Memory TTL) ---

class IdempotencyGuard {
  private cache = new Map<string, number>();
  private readonly TTL_MS = 60 * 60 * 1000; // 1 Hour

  checkAndLock(key: string): boolean {
    const now = Date.now();
    this.cleanup(now);

    if (this.cache.has(key)) {
       console.warn(`[NEXUS] ♻️ Idempotency Lock: Duplicate processing detected for ${key}`);
       return false; // Already processed
    }

    this.cache.set(key, now + this.TTL_MS);
    return true; // Proceed
  }

  private cleanup(now: number) {
    for (const [key, expiry] of this.cache.entries()) {
      if (expiry < now) {
        this.cache.delete(key);
      }
    }
  }
}

export const PaymentIdempotency = new IdempotencyGuard();

// --- 3. Wrapper (Try-Catch Global) ---

export async function runSafeHandler(
  rule: ReactorRule, 
  payload: any, 
  handler: (r: ReactorRule, p: any) => Promise<void> | void
): Promise<boolean> {
  const meta = {
    ruleId: rule.id,
    event: rule.on,
    timestamp: new Date().toISOString()
  };

  try {
    await handler(rule, payload);
    return true;
  } catch (error: any) {
    console.error(`[NEXUS] 💥 Rule Execution Failed`, {
      ...meta,
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack
    });
    return false;
  }
}

// --- 4. Template Engine (Robust) ---

export function applyTemplate(templateParams: Record<string, any>, payload: any): any {
  const result: any = {};
  
  for (const key in templateParams) {
    const val = templateParams[key];
    
    if (typeof val === "string") {
      // 1. Check for Full Token Replacement (preserves types like number/boolean)
      // e.g. "{{amount}}" -> 100 (number)
      const fullMatch = val.match(/^\{\{([^{}]+)\}\}$/);
      if (fullMatch) {
        const token = fullMatch[1].trim();
        result[key] = resolvePath(payload, token);
        continue;
      }

      // 2. Check for String Interpolation (Partial Replacement)
      // e.g. "Tx: {{txId}}" -> "Tx: 0x123..."
      if (val.includes("{{")) {
        result[key] = val.replace(/\{\{([^{}]+)\}\}/g, (_, token) => {
          const resolved = resolvePath(payload, token.trim());
          return resolved !== undefined && resolved !== null ? String(resolved) : '';
        });
        continue;
      }
    }
    
    // Default: Copy value as-is
    result[key] = val;
  }
  return result;
}

function resolvePath(obj: any, path: string): any {
  if (!obj) {return undefined;}
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : undefined, obj);
}
