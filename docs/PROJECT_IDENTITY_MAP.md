# NEO PROTOCOL - PROJECT IDENTITY MAP
> **Purpose:** Definitive reference to avoid confusion between projects  
> **Last Updated:** 2026-02-16 (Post-Audit Orchestration)

---

## CORE IDENTITY MATRIX

| Project Name | Repository (SSH) | Local Path | Role | Deploy |
|--------------|-----------------|------------|------|--------|
| **Neobot Architect** | `git@github.com:neomello/neobot.git` | `.` | Development Tool, Architect | Local / Railway (Production) |
| **NEO Agent Full** | `git@github.com:neomello/neo-agent-full.git` | `../neo-agent-full` | Sovereign Agent Node (WA/TG) | Railway (agent.neoprotocol.space) |
| **NEO Nexus** | `git@github.com:NEO-PROTOCOL/neo-nexus.git` | `../neo-nexus` | Event Hub / Graph Sovereign | Railway (nexus.neoprotocol.space) |
| **MIO System** | `git@github.com:neomello/mio-system.git` | `../mio-system` | Operational Identity Layer | Railway (id.neoprotocol.space) |
| **Neo Dashboard** | `git@github.com:neomello/neo-dashboard.git` | `../neo-dashboard-deploy` | Control Center Interface | Vercel (dashboard.neoprotocol.space) |

---

## CORRECT REFERENCES (Source of Truth: ecosystem.json)

### Neobot (Architect)
```json
{
  "id": "neobot-architect",
  "name": "Neobot Architect",
  "org": "NEO Protocol",
  "role": "Sovereign Node / Orchestrator / Architect"
}
```

### NEO Agent Full
```json
{
  "id": "neo-agent-full",
  "name": "NEO Agent Full",
  "org": "NEO Protocol",
  "role": "Agent Node / Autonomous Service"
}
```

---

**Status:** Soberania Arquitetural Garantida.  
**Próxima Etapa:** Unificação de Projetos na Railway.
