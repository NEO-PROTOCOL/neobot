# AGENTS.md — neobot

## Project Overview
NeoBot is a multi-channel AI assistant gateway (WhatsApp, iMessage, Discord, Slack, Telegram, Signal, Web). TypeScript monorepo with 74+ modules, 60+ skills, plugin SDK, CLI, daemon mode, cron, browser automation, TTS, and canvas host.

## Tech Stack
- **Language**: TypeScript (strict)
- **Runtime**: Node.js
- **Build**: tsdown
- **Test**: Vitest (6 config variants — check `vitest.config.*.ts`)
- **Lint**: oxlint
- **Package Manager**: pnpm (workspaces)
- **Deploy**: Docker → Railway
- **Sub-packages**: `clawdbot`, `moltbot`

## Repository Structure
```
src/
  channels/       # WhatsApp, iMessage, Discord, Slack, Telegram, Signal, Web adapters
  skills/         # 60+ skills (flowpay, coding-agent, spotify, obsidian, etc.)
  core/           # Gateway routing, AI orchestration, session management
  internal/       # Private modules — DO NOT import from outside
  utils/          # Shared utilities
  cli/            # CLI interface
  daemon/         # Daemon mode
  cron/           # Scheduled tasks
  plugins/        # Plugin SDK and extensions
packages/
  clawdbot/       # Sub-package
  moltbot/        # Sub-package
```

## How to Build & Test
```bash
pnpm install
pnpm build          # tsdown build
pnpm test           # runs vitest
pnpm lint           # oxlint
```

## Key Patterns

### Adding a New Skill
1. Create `src/skills/<skill-name>/index.ts`
2. Export a default function implementing the `Skill` interface
3. Register in the skill registry
4. Add tests in `src/skills/<skill-name>/__tests__/`
5. Skill name = directory name (kebab-case)

### Adding a Channel Adapter
1. Create `src/channels/<channel>/index.ts`
2. Implement `ChannelAdapter` interface
3. Channel adapters are isolated — no shared state
4. Use adapter's `format()` for channel-specific message formatting

### Hook Lifecycle
`onMessage → onProcess → onRespond → onSend` — always call `next()`

## Rules
- Use pnpm, never npm or yarn
- Strict TypeScript — no `any`
- Never import from `src/internal/` outside internal modules
- No global singletons — use dependency injection
- Never hardcode secrets — use env vars
- Never log PII (message content) at INFO level
- Check existing `src/utils/` before adding dependencies
- Run `pnpm test` before committing
- Run `pnpm lint` before committing
