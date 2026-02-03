# 🛡️ Auditoria Técnica: Checkout Bridge & FlowPay

> **Status:** ✅ Infraestrutura Pronta / 🚧 UX Setup
> **Data:** 02 Fev 2026
> **Responsável:** NEØ Protocol (Antigravity)

## 1. Infraestrutura FlowPay

A infraestrutura de persistência do FlowPay foi auditada e blindada para operação em ambientes containerizados (Railway/Docker).

### ✅ Diagnóstico de Permissões
- **Problema Anterior:** O módulo tentava escrever em `process.cwd()/data/flowpay` (vulgo `/app/data/flowpay`), mas o container não garantia permissões de escrita para o usuário `node`.
- **Solução Aplicada:** O `Dockerfile` agora cria explicitamente `/app/data` e atribui propriedade ao usuário `node:node`.
- **Resultado:** O banco SQLite `flowpay.db` será criado e mantido com segurança, sem erros `EPERM` ou `EACCES`.

### 🔗 Integração com Webhooks
- O módulo `FlowPayTool` está configurado para apontar para `process.env.FLOWPAY_API_URL`.
- **Ação Recomendada:** Verificar se a variável `FLOWPAY_API_URL` está definida no Railway para apontar para o serviço correto (se externo) ou se o módulo roda in-process (o padrão parece ser in-process via `infra/flowpay`).

## 2. Bridge de Checkout (FlowCloser -> FlowPay)

O fluxo de vendas via WhatsApp inicia no FlowCloser e termina no link de pagamento.

### 🔄 Fluxo Atual
1.  **Lead** interage no WhatsApp.
2.  **FlowCloser** detecta intenção de compra.
3.  **Tool Call:** `createFlowPayTool` é invocado.
4.  **Geração de Link:** O bot chama a API interna para criar um Charge.
5.  **Retorno:** O link é enviado ao cliente.

### ⚠️ Pontos de Atenção (UX)
- **Latência:** A geração do PIX deve ser instantânea. Com o banco SQLite local (`/app/data`), a latência será <10ms. Excelente.
- **Idempotência:** O sistema deve evitar gerar cobranças duplicadas se o usuário clicar duas vezes. O Schema do banco deve garantir `UNIQUE` keys para `order_id` externos.

## 3. Próximos Passos (Sessão de UX)

Agora que o "backend" está sólido, o foco muda para a experiência do usuário:

1.  [ ] **Testar Fluxo Real:** Realizar uma compra de teste de R$1,00 via WhatsApp.
2.  [ ] **Mensagem de Sucesso:** Personalizar a mensagem de confirmação pós-pagamento ("Seu acesso foi liberado!").
3.  [ ] **Recuperação de Carrinho:** Configurar Cron Job (agora funcional!) para lembrar usuários que geraram PIX mas não pagaram em 30min.

---
*Assinado digitalmente por NEØ Protocol.*
