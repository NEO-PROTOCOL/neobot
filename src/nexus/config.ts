import { z } from "zod";
import fs from "fs";
import path from "path";

// --- 1. Schemas ---

// Template Validation: Tokens {{token}} must contain only alphanumeric/underscore/dot
const TemplateString = z.string().refine(
  (val) => {
    // Check for empty braces "{{"
    if (val.includes("{{") && val.includes("}}")) {
       const matches = val.match(/\{\{([^}]*)\}\}/g);
       if (matches) {
         return matches.every(m => {
           const inner = m.slice(2, -2);
           return inner.length > 0 && /^[a-zA-Z0-9_.]+$/.test(inner);
         });
       }
    }
    // Check if there are unclosed braces (basic check)
    return !(val.includes("{{") && !val.includes("}}"));
  },
  { message: "Invalid template format. Tokens must be {{valid_token}}." }
);

export const ReactorRuleSchema = z.object({
  id: z.string(),
  enabled: z.boolean().default(true),
  on: z.string(),
  dispatch: z.string().optional(),
  action: z.string().optional(),
  // Transform map for dispatch
  transform: z.record(z.string(), z.any()).optional(), // Values can be templates
  // Params map for actions
  params: z.record(z.string(), z.any()).optional(),
  priority: z.number().default(0),
}).refine((data) => data.dispatch || data.action, {
  message: "Rule must define either 'dispatch' or 'action'.",
});

export const SafeModeSchema = z.object({
  allowlist: z.array(z.string()).default(["*"]),
  blocklist: z.array(z.string()).default([]),
  maxEventDepth: z.number().default(10),
});

export type ReactorRule = z.infer<typeof ReactorRuleSchema>;
export type SafeModeConfig = z.infer<typeof SafeModeSchema>;

// --- 2. Loaders ---

const RULES_PATH = path.resolve(process.cwd(), "config/nexus-reactors.json");
const SAFE_MODE_PATH = path.resolve(process.cwd(), "config/safe-mode.json");

// Default Fallback Rules (Empty to avoid side effects on fail)
const FALLBACK_RULES: ReactorRule[] = [];
// Default Safe Mode
const DEFAULT_SAFE_MODE: SafeModeConfig = {
    allowlist: ["*"],
    blocklist: [],
    maxEventDepth: 10
};

export function loadRules(): ReactorRule[] {
  try {
    if (!fs.existsSync(RULES_PATH)) {
      console.warn("[NEXUS] ⚠️ Rules file not found. Using fallback.");
      return FALLBACK_RULES;
    }
    const raw = fs.readFileSync(RULES_PATH, "utf-8");
    const json = JSON.parse(raw);
    
    // Validate Array
    const result = z.array(ReactorRuleSchema).safeParse(json);
    
    if (!result.success) {
      console.error("[NEXUS] 🚨 Invalid Rules Config:", result.error.format());
      return FALLBACK_RULES;
    }
    
    return result.data.filter(r => r.enabled);
  } catch (err) {
    console.error("[NEXUS] 💥 Error loading rules:", err);
    return FALLBACK_RULES;
  }
}

export function loadSafeMode(): SafeModeConfig {
  try {
    if (!fs.existsSync(SAFE_MODE_PATH)) {
      return DEFAULT_SAFE_MODE;
    }
    const raw = fs.readFileSync(SAFE_MODE_PATH, "utf-8");
    const json = JSON.parse(raw);
    
    const result = SafeModeSchema.safeParse(json);
    if (!result.success) {
      console.error("[NEXUS] 🚨 Invalid Safe Mode Config:", result.error.format());
      return DEFAULT_SAFE_MODE;
    }
    return result.data;
  } catch (err) {
    console.error("[NEXUS] 💥 Error loading safe mode:", err);
    return DEFAULT_SAFE_MODE;
  }
}
