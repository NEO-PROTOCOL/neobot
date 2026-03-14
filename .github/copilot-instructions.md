# Copilot Instructions — neobot

## Project Overview
NeoBot is a personal AI assistant operating as a multi-channel gateway (WhatsApp, iMessage, Discord, Slack, Telegram, Signal, Web). It's a TypeScript monorepo with 74+ modules, 60+ skills, and a plugin SDK.

## Architecture
- **Monorepo**: pnpm workspaces with sub-packages (`clawdbot`, `moltbot`)
- **Runtime**: Node.js with TypeScript (strict mode)
- **Build**: tsdown
- **Test**: Vitest (6 config variants)
- **Lint**: oxlint
- **Deploy**: Docker + Railway

## Critical Conventions

### Skill Registration
- Every skill lives in `src/skills/<skill-name>/`
- Skills must export a default function matching the `Skill` interface
- Always register skills in the skill registry — never import directly from other modules
- Skill names are kebab-case and must match directory name

### Channel Adapters
- Each channel adapter lives in `src/channels/<channel>/`
- Adapters implement the `ChannelAdapter` interface
- NEVER share state between channel adapters — each is isolated
- Message formatting is channel-specific; use the adapter's `format()` method

### Extension / Plugin SDK
- Plugins use the typed export surface from the SDK package
- Hook system follows a specific lifecycle: `onMessage → onProcess → onRespond → onSend`
- NEVER bypass the hook chain — always call `next()` in middleware

### Session Management
- Sessions are per-user-per-channel
- Session state is ephemeral; persistent state goes to the storage layer
- Never store secrets or tokens in session objects

## What NOT To Do
- Do NOT suggest Express.js patterns — this is NOT a web server
- Do NOT import from `src/internal/` — those are private modules
- Do NOT create global singletons for service instances — use dependency injection
- Do NOT use `any` type — the codebase enforces strict TypeScript
- Do NOT suggest npm — this project uses pnpm exclusively

## Security
- Never hardcode API keys, tokens, or secrets
- All external service credentials come from environment variables
- WhatsApp/iMessage adapters handle PII — never log message content at INFO level

## Dependencies
- Use `pnpm add` for new dependencies
- Prefer existing utilities in `src/utils/` before adding new packages
- Check `package.json` for existing deps before suggesting alternatives
