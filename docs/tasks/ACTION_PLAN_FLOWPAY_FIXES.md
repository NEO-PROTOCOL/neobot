# 📟 Plano de Ação de Melhorias: FlowPay Checkout & Bridge

**Para:** Node Dev Payments
**De:** Node Arquitetura
**Prioridade:** Imediata (Tornar Auditável para Launch)

Recebi o resultado da auditoria automatizada. O status **AMARELO** é preocupante para um produto que promete "processamento industrial" e "confiabilidade absoluta".

Abaixo está o plano de ação detalhado para resolver as falhas identificadas e entregar a experiência prometida.

---

## 🚨 Ações Imediatas (Hotfixes)

### 1. Hardening do Webhook (P1 - Crítico)
*   **Problema:** Risco de processamento duplo (idempotência fraca).
*   **Solução:** Implementar verificação de estado antes de disparar o comando de unlock.
    *   No handler do webhook, adicionar:
        ```javascript
        if (order.status === 'PAID' || order.bridge_status === 'SENT') {
            return res.status(200).send('Already Processed');
        }
        ```

### 2. Implementar Retry Simples (P1 - Crítico)
*   **Problema:** Se a chamada para o Neobot (Smart Factory) falhar, o usuário paga e não recebe.
*   **Solução (MVP):** Adicionar retry *in-memory* ou tabela de falhas.
    *   Modificar o serviço de chamadas ao Neobot para usar um wrapper `withRetry(fn, retries=3)`.
    *   Se todas as tentativas falharem, **gravar em uma tabela/arquivo `failed_provisions.json`** para processamento manual ou via cronjob posterior. Isso evita perda de dados silenciosa.

---

## 🛠️ Melhorias de Curto Prazo (Pré-Launch)

### 3. Persistência de Estado no Checkout (P2 - UX)
*   **Problema:** Reload da página perde a seleção "Crypto" ou dados preenchidos.
*   **Solução:** Sincronizar estado com URL.
    *   Ao clicar nas abas, atualizar a URL: `/checkout?mode=crypto` ou `/checkout?mode=pix`.
    *   Ao carregar a página, ler o parâmetro `mode` e inicializar o estado correto.
    *   (Opcional) Salvar inputs parciais no `localStorage` (`checkout_draft`).

### 4. Feedback Visual Aprimorado (P2 - UX)
*   **Problema:** UI muda pouco durante o processamento, gerando ansiedade em pagadores de alto valor.
*   **Solução:** Adicionar um "Stepper" visual ou feedback de Polling.
    *   Estado 1: "Aguardando PIX..." (Spinner)
    *   Estado 2: "Pagamento Detectado! Acionando Fábrica..." (Ícone de Engrenagem/Fábrica)
    *   Estado 3: "Ativos Gerados. Verificando Blockchain..." (Ícone de Blockchain)
    *   Estado 4: "Sucesso! Veja sua carteira." (Check Verde)

---

## 🏭 Estrutural (Smart Factory Bridge)

### 5. Configuração do Proxy (Transparência)
*   **Ação:** Documentar explicitamente (no `README.md` do serviço) que o FlowPay atua como **Relayer Proxy** para o Neobot.
*   **Motivo:** Se precisarmos auditar onde as chaves privadas estão, deve ficar claro que *não* estão no FlowPay, mas sim no Neobot (Smart Factory Core). Isso é crucial para a segurança.

---

## 📆 Cronograma Sugerido

*   **Hoje:** Implementar Idempotência (1) e Retry Simples (2).
*   **Amanhã:** Ajustar UX do Checkout (3 e 4).
*   **Quarta:** Teste End-to-End completo (Pagamento Real -> Falha Simulada -> Retry -> Sucesso).

---

*"Confiança se constrói na falha. Quando algo dá errado, o sistema precisa saber se recuperar sozinho."*
