---
applyTo: "src/skills/**/*"
---

# Skill Development Conventions — neobot

## Skill Structure
Every skill follows this structure:
```
src/skills/<skill-name>/
  index.ts          # Main entry, exports default Skill function
  types.ts          # Skill-specific types (optional)
  utils.ts          # Skill-specific helpers (optional)
  __tests__/        # Tests
```

## Skill Interface
- Export a default function implementing the `Skill` interface
- The function receives a `SkillContext` with message, session, and services
- Return a `SkillResponse` — never modify the context directly

## Registration
- Register the skill in the central skill registry
- Skill name must match directory name (kebab-case)
- Do NOT import skills directly from other skills — use the registry

## Best Practices
- Skills must be stateless — all state goes through session or storage
- Use `context.services` for external API calls
- Never access channel adapters directly from a skill
- Handle errors gracefully — a failing skill should not crash the gateway
- Log at DEBUG level within skills, not INFO
- Always validate input parameters from user messages
