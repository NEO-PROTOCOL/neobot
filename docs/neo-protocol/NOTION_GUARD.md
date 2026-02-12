# 🛡️ NOTION GUARD :: Protocolo de Escrita NΞØ

> **REGRAS DE OURO:** 
> 1. É terminantemente proibido criar páginas na RAÍZ do Notion.
> 2. Toda nova informação deve ter um "Pai" definido conforme o mapa abaixo.
> 3. Log de atividades deve ser enviado APENAS para o banco de dados 'Work Log'.

## 🗺️ Mapa de Destinos Oficiais

| Tipo de Conteúdo | Destino (Pai) | ID do Destino |
| :--- | :--- | :--- |
| **Doc Técnica Nova** | Documentation Hub | `2f88c6e8-3be0-8120-971c-ee616b52e5ff` |
| **Decisões / ADRs** | Decisões Estratégicas | `5041cdeb-1d58-4029-bdfc-6e7271a3a20b` |
| **Tarefas / Bugs** | Tarefas & Ações | `73b8b7cc-b818-45b9-8907-fc7066b4c2da` |
| **Logs Diários** | Work Log · Diário | `93f062cd-fb28-4c48-a370-d67579b9c902` |
| **Smart Factory** | Neural Core V2 | `2f78c6e8-3be0-8129-bcfc-f52c91ebc00a` |
| **FlowPay** | Gateway Hub | `2f78c6e8-3be0-816a-9348-e927c258ec0b` |

## 🚫 PROTOCOLO SWORDFISH (RESTRICTED)

As páginas que contêm "**swordfish**" no nome são estritamente confidenciais. 
Agentes de IA estão proibidos de:
- Abrir, ler ou vasculhar o conteúdo.
- Mover, renomear ou apagar as páginas.
- Listar IDs ou propriedades dessas páginas em logs.

Qualquer detecção de strings "swordfish" deve resultar no encerramento imediato da consulta ao item.

Ao interagir com o Notion através de qualquer script ou API:
1. Verifique se o `parent.page_id` ou `parent.database_id` NÃO está vazio.
2. NUNCA use o root workspace como parent.
3. Se não souber onde colocar, use o **Documentation Hub**.

---
**Status:** ATIVO
**Responsável:** Antigravity (Gatekeeper)
