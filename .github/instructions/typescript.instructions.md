---
applyTo: "**/*.ts"
---

# TypeScript Conventions — neobot

## Strict Mode
- This project uses `strict: true` in tsconfig
- Never use `any` — use `unknown` and narrow types
- All functions must have explicit return types
- All parameters must be typed

## Imports
- Use relative imports within the same module
- Use path aliases (`@/`) for cross-module imports
- Never import from `src/internal/` outside internal modules
- Barrel exports (`index.ts`) are the public API of each module

## Async Patterns
- Always use async/await (never raw Promises with `.then()`)
- Always handle errors with try/catch — never let promises float
- Use `Promise.allSettled()` for parallel operations that can partially fail

## Error Handling
- Throw typed errors extending `NeoError` base class
- Include context in error messages (channel, skill name, user ID)
- Never swallow errors silently

## Naming
- Files: kebab-case (`my-skill.ts`)
- Classes: PascalCase
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces: PascalCase, no `I` prefix
- Types: PascalCase

## Testing
- Test files go in `__tests__/` adjacent to source
- Use `describe/it` pattern
- Mock external services, never real APIs in tests
- Use Vitest's `vi.mock()` for mocking
