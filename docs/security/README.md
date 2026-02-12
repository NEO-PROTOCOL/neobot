# NEØ Protocol - Segurança & Auditoria

> **Objetivo:** Centralizar diretrizes de segurança, auditorias e conformidade do protocolo.

---

## 🛡️ Visão Geral de Segurança

A segurança do NEØ Protocol baseia-se em três pilares:
1. **Soberania:** Chaves locais (NÃO cloud) via mio-system.
2. **Imutabilidade:** Código e skills endereçados por conteúdo (IPFS).
3. **Auditabilidade:** Manifestos e logs de auditoria regulares.

Veja: [Visão Geral de Segurança](./SECURITY_OVERVIEW.md)

---

## 📋 Histórico de Auditorias

| Data | Tipo | Status | Link |
|------|------|--------|------|
| 30 Jan 2026 | Auditoria de Fundação | ✅ Concluída | [AUDIT_2026-01-30.md](./AUDIT_2026-01-30.md) |
| 30 Jan 2026 | Verificação de Chaves | ✅ Concluída | [COMPLETE_2026-01-30.md](./COMPLETE_2026-01-30.md) |

---

## 🔑 Gerenciamento de Identidades (MIO)

O sistema de identidades `mio-system` gera chaves criptográficas para cada nó do protocolo.
Essas chaves são usadas para assinar mensagens e validar a integridade das skills.

Documentação de Identidades: [IDENTITIES_GENERATED.md](../mio/IDENTITIES_GENERATED.md)

---

## 🚨 Reportar Vulnerabilidades

Se você encontrar uma falha de segurança, por favor, NOTIFIQUE imediatamente o arquiteto através do canal seguro ou e-mail: `security@neoprotocol.space`.

---

**Status:** Ativo  
**Revisão:** 05 Fev 2026
