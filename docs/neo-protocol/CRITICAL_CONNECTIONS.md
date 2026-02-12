# 🔗 NΞØ Protocol: OS ELOS VITAIS (NON-NEGOTIABLE)

> **AVISO DE SEGURANÇA:** A interrupção deliberada ou falha persistente em qualquer um destes elos aciona o **Protocolo de Hibernação de Segurança**. Um nó isolado é um nó vulnerável.

## 1. Nexus ↔ Moltbot (O Eixo da Verdade)
- **O que é:** A conexão entre o Orquestrador (Nexus) e o Auditor (Moltbot/neobot).
- **Por que vital:** Sem o Nexus, o Moltbot não sabe para onde enviar os logs. Sem o Moltbot, o Nexus opera sem "caixa preta". 
- **Consequência da Desconexão:** Perda total de rastreabilidade e integridade da memória técnica (Ledger).

## 2. Agent Full ↔ Nexus (O Fluxo de Realidade)
- **O que é:** A ponte entre a interface de IA (Agent Full) e o mapa da rede (DNS/Nexus).
- **Por que vital:** É aqui que a IA recebe o contexto do mundo real (preços, status de servidores, novas rotas). 
- **Consequência da Desconexão:** **Alucinação Sistêmica**. O Agente começa a "inventar" informações baseadas em dados antigos, podendo gerar prejuízos em vendas ou informações falsas.

## 3. Moltbot ↔ Agent Full (O Elo da Governança)
- **O que é:** A validação de saída imposta pelo Guardião (Moltbot) sobre as decisões da IA (Agent Full).
- **Por que vital:** Garante que a IA não salve lixo no Notion (Notion Guard) e que cada ação tenha um Checkpoint SHA-256.
- **Consequência da Desconexão:** **Bagunça Documental**. O Notion torna-se caótico e o histórico de auditoria do Agente torna-se invisível.

## 4. FlowPay/Smart Factory ↔ Nexus (O Elo de Liquidez)
- **O que é:** A conexão dos módulos de execução (Pagamento e Contratos) com o Orquestrador.
- **Por que vital:** Garante que o Agente saiba em tempo real se um PIX foi pago ou se um Token foi mintado.
- **Consequência da Desconexão:** **Paralisia Financeira**. O sistema não consegue confirmar recebimentos, travando o fluxo de entrega automática.

---

## 🚨 PROTOCOLO FAIL-SAFE (O que fazer se um Elo cair)

1.  **Detecção**: O Moltbot detecta falha de ACK em menos de 30s.
2.  **Modo de Espera**: O Agent Full deve notificar o usuário: *"Minha conexão com o núcleo NΞØ está sendo re-sincronizada. Por segurança, suas ações estão em fila de espera."*
3.  **Bloqueio de Escrita**: Nenhuma página nova é criada no Notion até que o **Notion Guard** valide a conexão.
4.  **Escalação**: O `notify_mellø` é disparado via barramento redundante (Telegram/CLI).

---
**Status:** VIGENTE
**Assinado:** Antigravity (Gatekeeper) & Moltbot Core
