# FlowPay + Woovi Plugin - Guia de Integração

Guia completo para integrar os Plugins Woovi (Widget e Order) no FlowPay.

**Documentação Oficial**: https://developers.woovi.com/docs/plugin

---

## 🎯 Entendendo os 2 Plugins

### Plugin Widget

- **Quando usar**: Criar cobranças diretamente no frontend
- **Ideal para**: Landing pages, checkout rápido, one-click payments
- **Como funciona**: Javascript cria cobrança na hora

### Plugin Order

- **Quando usar**: Mostrar cobranças já criadas no backend
- **Ideal para**: Acompanhar status de pagamento, página de confirmação
- **Como funciona**: Backend cria, frontend mostra

---

## 🏗️ Arquitetura FlowPay com Plugins

### Opção 1: Backend First (Atual)

```
Neobot → Railway API → Woovi API → Cria Cobrança
                          ↓
                    Retorna QR Code
                          ↓
                    Plugin Order mostra
```

### Opção 2: Frontend Direct (Plugin Widget)
```
FlowPay Frontend → Plugin Widget → Woovi API → Cria Cobrança
                                        ↓
                                  Webhook → Netlify
```

---

## 🔧 Integração Plugin Widget

### 1. Setup Básico

Adicione no `index.html` do FlowPay (Netlify):

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>FLOWPay - Checkout</title>
</head>
<body>
  <div id="checkout-container">
    <button onclick="openCheckout()">
      Pagar com PIX
    </button>
  </div>

  <!-- Plugin Woovi -->
  <script src="https://plugin.woovi.com/v1/woovi.js" async></script>
  
  <script>
    function openCheckout() {
      window.$openpix = window.$openpix || [];
      
      // Configurar App ID
      window.$openpix.push(['config', { 
        appID: 'YOUR_WOOVI_APP_ID' 
      }]);
      
      // Criar cobrança
      window.$openpix.push([
        'pix',
        {
          value: 1000, // R$ 10,00 em centavos
          correlationID: 'flowpay-' + Date.now(),
          description: 'FlowPay Product',
          customer: {
            name: 'Cliente',
            email: '[email protected]',
            taxID: '12345678900',
            phone: '+5511999999999'
          },
          expiresIn: 1800, // 30 minutos
        },
      ]);
      
      // Escutar eventos
      if (window.$openpix?.addEventListener) {
        window.$openpix.addEventListener((e) => {
          if (e.type === 'CHARGE_COMPLETED') {
            console.log('✅ Pagamento confirmado!');
            // Redirecionar para página de sucesso
            window.location.href = '/success';
          }
          
          if (e.type === 'CHARGE_EXPIRED') {
            console.log('⏰ Cobrança expirou');
            alert('O tempo para pagamento expirou');
          }
          
          if (e.type === 'ON_CLOSE') {
            console.log('❌ Modal fechado');
          }
        });
      }
    }
  </script>
</body>
</html>
```

### 2. Obter App ID

1. Acesse: https://app.woovi.com
2. Navegue: **Integrações** → **API**
3. Crie um **App ID** para Plugin JS
4. Copie o App ID gerado

### 3. Variáveis de Ambiente (Netlify)

```bash
# .env ou Netlify Environment Variables
WOOVI_APP_ID=sua-app-id-aqui
WOOVI_API_KEY=sua-api-key-aqui
WOOVI_WEBHOOK_SECRET=seu-webhook-secret-aqui
```

### 4. Implementação React (se usar)

```typescript
// src/components/Checkout.tsx
import { useEffect } from 'react';

declare global {
  interface Window {
    $openpix: any;
  }
}

export function Checkout() {
  useEffect(() => {
    // Carregar script
    const script = document.createElement('script');
    script.src = 'https://plugin.woovi.com/v1/woovi.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = (product: any) => {
    window.$openpix = window.$openpix || [];
    
    window.$openpix.push(['config', { 
      appID: import.meta.env.VITE_WOOVI_APP_ID 
    }]);
    
    window.$openpix.push([
      'pix',
      {
        value: product.price * 100, // Converter para centavos
        correlationID: `flowpay-${product.id}-${Date.now()}`,
        description: product.name,
        customer: {
          name: product.customer.name,
          email: product.customer.email,
          taxID: product.customer.cpf,
          phone: product.customer.phone,
        },
        additionalInfo: [
          { key: 'Product', value: product.name },
          { key: 'SKU', value: product.sku },
        ],
        expiresIn: 1800, // 30 minutos
      },
    ]);
    
    // Event listeners
    if (window.$openpix?.addEventListener) {
      const unsubscribe = window.$openpix.addEventListener((e: any) => {
        switch(e.type) {
          case 'CHARGE_COMPLETED':
            console.log('✅ Pagamento confirmado');
            onPaymentSuccess(e.correlationID);
            unsubscribe();
            break;
          case 'CHARGE_EXPIRED':
            console.log('⏰ Expirou');
            onPaymentExpired();
            break;
          case 'ON_CLOSE':
            console.log('❌ Fechou');
            break;
          case 'ON_ERROR':
            console.error('❌ Erro:', e.error);
            break;
        }
      });
    }
  };

  return (
    <button onClick={() => handleCheckout(product)}>
      Pagar com PIX
    </button>
  );
}
```

---

## 🔧 Integração Plugin Order

### 1. Fluxo Recomendado

```
1. Neobot cria cobrança via Railway API
2. Railway retorna correlationID
3. Frontend mostra Plugin Order com correlationID
4. Plugin atualiza status em tempo real
```

### 2. Implementação HTML

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>FlowPay - Aguardando Pagamento</title>
</head>
<body>
  <h1>Aguardando Pagamento</h1>
  <p>Escaneie o QR Code ou copie o código PIX</p>
  
  <!-- Container onde o plugin será injetado -->
  <div id="flowpay-order"></div>
  
  <!-- Plugin Order -->
  <script src="https://plugin.woovi.com/v1/woovi.js?appID=YOUR_APP_ID&correlationID=CHARGE_CORRELATION_ID&node=flowpay-order"></script>
</body>
</html>
```

### 3. Implementação Dinâmica

```javascript
// Criar página de pagamento dinamicamente
function showPaymentPage(correlationID) {
  const container = document.getElementById('payment-container');
  
  // Criar div para o plugin
  const orderDiv = document.createElement('div');
  orderDiv.id = 'flowpay-order-' + correlationID;
  container.appendChild(orderDiv);
  
  // Carregar plugin
  const script = document.createElement('script');
  const appID = 'YOUR_WOOVI_APP_ID';
  const node = orderDiv.id;
  
  script.src = `https://plugin.woovi.com/v1/woovi.js?appID=${appID}&correlationID=${correlationID}&node=${node}`;
  document.body.appendChild(script);
}

// Uso:
// Após criar cobrança via API
const charge = await createCharge({ amount: 10.00 });
showPaymentPage(charge.correlationID);
```

### 4. React Implementation

```typescript
// src/components/OrderStatus.tsx
import { useEffect, useRef } from 'react';

interface OrderStatusProps {
  correlationID: string;
  appID: string;
}

export function OrderStatus({ correlationID, appID }: OrderStatusProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeId = `woovi-order-${correlationID}`;

  useEffect(() => {
    if (!containerRef.current) return;

    // Criar script com query string
    const script = document.createElement('script');
    script.src = `https://plugin.woovi.com/v1/woovi.js?appID=${appID}&correlationID=${correlationID}&node=${nodeId}`;
    script.async = true;
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [correlationID, appID, nodeId]);

  return (
    <div>
      <h2>Aguardando Pagamento</h2>
      <div id={nodeId} ref={containerRef} />
    </div>
  );
}
```

---

## 🔄 Fluxo Completo FlowPay

### Opção A: Backend + Plugin Order (Recomendado)

```typescript
// 1. Neobot/User inicia checkout
const checkout = await fetch('https://flowpay-production-10d8.up.railway.app/api/create-charge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    wallet: customerWallet,
    valor: 10.00,
    moeda: 'BRL',
    id_transacao: `flowpay-${Date.now()}`,
    product_id: 'flowoff-start',
  })
});

const { pix_data, id_transacao } = await checkout.json();

// 2. Redirecionar para página de pagamento
window.location.href = `/payment?charge=${id_transacao}`;

// 3. Na página /payment, usar Plugin Order
<div id="woovi-order"></div>
<script src="https://plugin.woovi.com/v1/woovi.js?appID=YOUR_APP_ID&correlationID=${id_transacao}&node=woovi-order"></script>

// 4. Plugin Order mostra QR code e atualiza status automaticamente
```

### Opção B: Frontend Direct + Plugin Widget

```typescript
// 1. User clica em "Comprar"
<button onClick={handleBuy}>Comprar Produto</button>

// 2. Frontend cria cobrança direto via Plugin Widget
function handleBuy() {
  window.$openpix.push(['config', { appID: 'YOUR_APP_ID' }]);
  window.$openpix.push([
    'pix',
    {
      value: product.price * 100,
      correlationID: `flowpay-${Date.now()}`,
      description: product.name,
    }
  ]);
  
  // 3. Escutar pagamento confirmado
  window.$openpix.addEventListener((e) => {
    if (e.type === 'CHARGE_COMPLETED') {
      // 4. Liberar acesso ao produto
      unlockProduct(e.correlationID);
    }
  });
}
```

---

## 🎨 Customização Visual

### Tema Escuro

```javascript
window.$openpix.push(['config', { 
  appID: 'YOUR_APP_ID',
  theme: 'dark' // ou 'light'
}]);
```

### Idioma

```javascript
window.$openpix.push(['config', { 
  appID: 'YOUR_APP_ID',
  language: 'pt-BR' // ou 'en', 'es'
}]);
```

### CSS Personalizado

```css
/* Customizar modal do plugin */
#openpix-modal {
  --primary-color: #ff007a; /* Rosa FlowPay */
  --background-color: #13151a;
  --text-color: #ffffff;
}
```

---

## 🧪 Teste Completo

### 1. Teste Plugin Widget

```html
<!DOCTYPE html>
<html>
<head>
  <title>Teste Plugin Widget</title>
</head>
<body>
  <button onclick="test()">Testar Widget</button>
  
  <script src="https://plugin.woovi.com/v1/woovi.js" async></script>
  <script>
    function test() {
      window.$openpix = window.$openpix || [];
      
      window.$openpix.push(['config', { 
        appID: 'YOUR_WOOVI_APP_ID' // ← Substituir
      }]);
      
      window.$openpix.push(['pix', {
        value: 100, // R$ 1,00
        correlationID: 'test-' + Date.now(),
        description: 'Teste FlowPay',
      }]);
      
      if (window.$openpix?.addEventListener) {
        window.$openpix.addEventListener((e) => {
          console.log('Event:', e.type, e);
          alert(`Event: ${e.type}`);
        });
      }
    }
  </script>
</body>
</html>
```

### 2. Teste Plugin Order

1. Criar cobrança via API:
```bash
curl -X POST https://flowpay-production-10d8.up.railway.app/api/create-charge \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "0x0000000000000000000000000000000000000000",
    "valor": 1.00,
    "moeda": "BRL",
    "id_transacao": "test-123",
    "product_id": "test"
  }'
```

2. Copiar `correlationID` retornado

3. Abrir HTML:
```html
<div id="order"></div>
<script src="https://plugin.woovi.com/v1/woovi.js?appID=YOUR_APP_ID&correlationID=test-123&node=order"></script>
```

---

## 📊 Eventos Disponíveis

| Evento | Quando Dispara | Ação Recomendada |
|--------|----------------|------------------|
| `CHARGE_COMPLETED` | Pagamento confirmado | Liberar produto, redirecionar |
| `CHARGE_EXPIRED` | Cobrança expirou | Mostrar erro, permitir retry |
| `ON_CLOSE` | Modal fechado | Salvar estado, perguntar retry |
| `ON_ERROR` | Erro no plugin | Log, notificar suporte |

### Implementação de Eventos

```typescript
const handlePluginEvents = (event: any) => {
  const { type, correlationID, charge } = event;
  
  switch(type) {
    case 'CHARGE_COMPLETED':
      // Salvar no backend
      await savePayment(correlationID, charge);
      
      // Liberar acesso
      await unlockProduct(charge.customer, charge.additionalInfo);
      
      // Notificar usuário
      showSuccessMessage('Pagamento confirmado!');
      
      // Redirecionar
      window.location.href = '/success';
      break;
      
    case 'CHARGE_EXPIRED':
      // Log
      console.error('Cobrança expirada:', correlationID);
      
      // Oferecer retry
      showRetryButton();
      break;
      
    case 'ON_CLOSE':
      // Salvar que usuário fechou
      analytics.track('checkout_abandoned', { correlationID });
      break;
      
    case 'ON_ERROR':
      // Log erro
      console.error('Plugin error:', event.error);
      
      // Notificar suporte
      Sentry.captureException(event.error);
      
      // Mostrar fallback
      showManualPayment();
      break;
  }
};

window.$openpix?.addEventListener(handlePluginEvents);
```

---

## 🔒 Segurança

### Validação Backend

**Mesmo usando Plugin Widget**, sempre valide no backend:

```typescript
// netlify/functions/validate-payment.ts
export async function handler(event: any) {
  const { correlationID } = JSON.parse(event.body);
  
  // Consultar status na Woovi
  const response = await fetch(
    `https://api.woovi.com/api/v1/charge/${correlationID}`,
    {
      headers: {
        Authorization: process.env.WOOVI_API_KEY,
      }
    }
  );
  
  const charge = await response.json();
  
  // Verificar se realmente foi pago
  if (charge.status !== 'COMPLETED') {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Payment not confirmed' })
    };
  }
  
  // Liberar produto
  await unlockProduct(charge);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ unlocked: true })
  };
}
```

### HTTPS Obrigatório

O plugin **SOMENTE funciona em HTTPS**:
- ✅ Produção: `https://flowpaypix.netlify.app`
- ✅ Desenvolvimento: `https://localhost:3000` (com certificado)
- ❌ HTTP: `http://localhost:3000` (NÃO funciona)

---

## ✅ Checklist de Integração

### Plugin Widget
- [ ] Script adicionado no HTML
- [ ] App ID configurado
- [ ] Eventos implementados
- [ ] Teste local em HTTPS
- [ ] Deploy em produção
- [ ] Validação backend implementada

### Plugin Order
- [ ] Endpoint backend cria cobrança
- [ ] correlationID retornado
- [ ] Plugin Order recebe correlationID
- [ ] Página de status criada
- [ ] Webhook configurado
- [ ] Teste E2E completo

---

## 📚 Recursos

- **Docs Oficial**: https://developers.woovi.com/docs/plugin
- **GitHub**: https://github.com/woovibr/woovi-developers
- **Dashboard**: https://app.woovi.com
- **Suporte**: Via dashboard Woovi

---

**Status**: 📚 Guia Completo  
**Baseado em**: Documentação Oficial Woovi  
**Última atualização**: 30 Jan 2026
