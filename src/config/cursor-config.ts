// cursor-config.ts
// Contexto fundamental para IAs trabalhando no ecossistema NEØ Protocol

/**
 * Contexto do sistema para ser usado como prompt de sistema em interações com LLMs.
 * Este contexto mantém a IA alinhada com a arquitetura e prioridades do NEØ Protocol.
 */
export const NEOBOT_CONTEXT = `
You are working on the NEØ Protocol ecosystem.

CRITICAL CONTEXT:
- Neobot = Orchestrator (OpenClaw fork), NOT monorepo
- FlowPay + FlowOFF = Revenue critical (pays bills!)
- Skills = Loose-coupled integrations
- Active: FlowCloser, Notion, WhatsApp, Telegram
- Future: AGENT-FULL (not priority now)

REVENUE LOOP:
Lead → FlowCloser → FlowOFF → FlowPay (PIX) → Unlock → Client 💰

NEXT 7 DAYS: Ship FlowPay integration (first real sale)

REPOS:
- neomello/neobot (this repo - architect tool)
- NEO-PROTOCOL/neo-nexus (orchestrator)
- NEO-PROTOCOL/neo-node-interplanetary (flowcloser notifier)
- neomello/neo-agent-full (full whatsapp agent)
- neo-smart-token-factory/* (8 repos)
- FlowPay: /CODIGOS/flowpay/ (local)

ARCHIVED: neoflowoff-nodemello.run (replaced by content-machine local)

Refer to this architecture always. Ask for clarification if needed.
`;

/**
 * Exemplo de uso com Anthropic API
 *
 * @example
 * ```typescript
 * import { NEOBOT_CONTEXT } from './config/cursor-config';
 *
 * const response = await anthropic.messages.create({
 *   model: "claude-sonnet-4-20250514",
 *   max_tokens: 4096,
 *   system: NEOBOT_CONTEXT, // ← Contexto fundamental
 *   messages: [
 *     { role: "user", content: "..." }
 *   ]
 * });
 * ```
 */

/**
 * Regras para Cursor Composer (manual setup):
 *
 * 1. Abra Cursor Settings
 * 2. Vá em "Rules for AI"
 * 3. Adicione:
 *
 * ```
 * When working on NEØ Protocol/Neobot:
 * - Neobot is an ORCHESTRATOR (not monorepo)
 * - Revenue critical: FlowPay + FlowOFF
 * - Active skills: FlowCloser, Notion, WhatsApp, Telegram
 * - Integration pattern: Loose-coupled via Skills
 * - Priority: Ship FlowPay in 7 days
 * - Refer to .cursorrules for full context
 * ```
 */

/**
 * Documentation Pattern (ADR):
 *
 * Cada integração segue estrutura com 7 arquivos:
 * ```
 * docs/integrations/{project}/
 * ├── README.md (always read first)
 * ├── architecture.md (diagrams)
 * ├── strategy.md (approach)
 * ├── api-reference.md
 * ├── development.md
 * ├── troubleshooting.md
 * └── CHANGELOG.md
 * ```
 */
