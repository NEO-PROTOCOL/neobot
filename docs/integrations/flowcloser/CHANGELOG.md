<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
    FLOWCLOSER · CHANGELOG
========================================
```

Complete change history for FlowCloser
Agent integration and improvements.

────────────────────────────────────────

## 🚀 2026-01-30 · Major Improvements

### ✅ Security Fixed

**Vulnerabilities: 3 HIGH → 0** ✅

- Added security overrides in `package.json`
- Fixed `qs` DoS mitigation
- Fixed `cross-spawn` vulnerability
- Ran `npm install` and validated
- **Result:** Zero vulnerabilities

### 🤖 Dependabot Configured

- Created `.github/dependabot.yml`
- Weekly checks (Mondays)
- Automatic npm updates
- Security patches auto-applied

### ⚡ OpenAPI Documentation

**Swagger UI available at `/api-docs`**

- Installed `swagger-jsdoc`
- Installed `swagger-ui-express`
- Implemented in `src/main.ts`
- Documented critical endpoints:
  - `GET /health`
  - `POST /api/agents/flowcloser/message`
  - `POST /api/webhooks/instagram`

**Access:** `http://localhost:8042/api-docs`

### 🧪 Automated Tests

**12 tests passing** ✅

**Setup:**
- Vitest as test runner
- Supertest for HTTP tests
- Coverage configured

**Test files created:**
- `src/services/leads.test.ts` (unit)
- `src/main.test.ts` (integration)

**Coverage:**
- Unit tests: Score calculation
- Unit tests: Data extraction
- Integration: Health endpoint
- Integration: Message endpoint
- Integration: Webhook handlers

### 🐛 Bug Fix

**Unicode names fixed** ✅

- **Issue:** Regex didn't match names
  with accents (João, María, etc)
- **Fix:** Updated regex in
  `src/services/leads.ts`
- **Support:** Full Unicode in names
- **Discovered:** During test development

────────────────────────────────────────

## 📊 Status Update

```text
[####] Vulnerabilities ............. OK
      (3 HIGH → 0)

[####] Dependabot .................. OK
      (Weekly auto-updates)

[####] OpenAPI Docs ................ OK
      (Swagger UI at /api-docs)

[####] Tests ..................... OK
      (12 tests passing)

[####] Unicode Support ............. OK
      (Bug discovered & fixed)
```

────────────────────────────────────────

## 🎯 Next Priorities

From briefing Priority 1:

```text
[####] Tests ..................... DONE
[#---] Error handling ........... TODO
[----] Type safety .............. TODO
```

From briefing Priority 2:

```text
[----] Modularize main.ts ....... TODO
      (924 lines → modules)

[----] Configure linter ......... TODO
      (ESLint + Prettier)
```

────────────────────────────────────────

## 📚 Documentation Updates Needed

**In Neobot docs:**

1. Update `architecture.md`:
   - Add Swagger UI endpoint
   - Add test coverage info
   - Update security status

2. Update `api-reference.md`:
   - Link to `/api-docs` (interactive)
   - Note: Unicode support in names

3. Update `development.md`:
   - Add test commands
   - Add coverage commands
   - Update setup steps

4. Update `troubleshooting.md`:
   - Add Swagger UI issues
   - Add test failures section

────────────────────────────────────────

## 🔗 References

**Implemented by:** Antigravity AI
**Date:** 2026-01-30
**Briefing:** ANTIGRAVITY_INSTRUCTIONS.md
**Priority level:** 1 (Critical)

**Pull Request:** (to be created)
**Tests:** All passing ✅
**Deploy:** Railway auto-deploy ready

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Code is law. Expand until
 chaos becomes protocol."

Security by design.
Exploits find no refuge here.
────────────────────────────────────────
