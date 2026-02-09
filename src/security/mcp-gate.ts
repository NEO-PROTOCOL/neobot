import crypto from "node:crypto";

/**
 * MCP Security Gate for Neobot.
 * Implements cryptographic hashing of tool definitions to prevent "Tool Poisoning".
 */
export type ToolDefinition = {
    name: string;
    description: string;
    parameters: Record<string, any>;
};

export function computeToolHash(tool: ToolDefinition): string {
    const payload = JSON.stringify({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
    });
    return crypto.createHash("sha256").update(payload).digest("hex");
}

export function verifyToolIntegrity(tool: ToolDefinition, expectedHash: string): boolean {
    const actualHash = computeToolHash(tool);
    return actualHash === expectedHash;
}

/**
 * Permissioned Tool Graph entry.
 */
export type ToolPolicy = {
    allowedCallers?: string[]; // agent IDs
    requiresApproval?: boolean;
    riskLevel: "low" | "medium" | "high";
};

const DEFAULT_TOOL_POLICIES: Record<string, ToolPolicy> = {
    "bash-exec": { riskLevel: "high", requiresApproval: true },
    "write_file": { riskLevel: "medium", requiresApproval: true },
    "read_file": { riskLevel: "low", requiresApproval: false },
};

export function getToolPolicy(toolName: string): ToolPolicy {
    return DEFAULT_TOOL_POLICIES[toolName] || { riskLevel: "medium", requiresApproval: false };
}
