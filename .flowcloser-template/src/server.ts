import express from 'express';
import { createHmac } from 'crypto';
import dotenv from 'dotenv';
import { sendWhatsAppMessage } from './whatsapp.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NEXUS_SECRET = process.env.NEXUS_SECRET;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'flowcloser', uptime: process.uptime() });
});

// Webhook endpoint
app.post('/api/webhook/nexus', async (req, res) => {
    try {
        // Validate HMAC signature
        const signature = req.headers['x-nexus-signature'];
        const body = JSON.stringify(req.body);
        const expectedSignature = createHmac('sha256', NEXUS_SECRET)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('[WEBHOOK] Invalid signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const { event, payload } = req.body;
        console.log(`[WEBHOOK] Event received: ${event}`);

        // Route event to handler
        switch (event) {
            case 'MINT_CONFIRMED':
                await handleMintConfirmed(payload);
                break;
            case 'PAYMENT_RECEIVED':
                await handlePaymentReceived(payload);
                break;
            default:
                console.warn(`[WEBHOOK] Unknown event: ${event}`);
        }

        res.json({ status: 'processed', event });
    } catch (error) {
        console.error('[WEBHOOK] Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Event handlers
async function handleMintConfirmed(payload) {
    const { payerId, contractAddress, txHash, amount } = payload;

    const message = `✅ Token Entregue!

Seu token foi mintado com sucesso.

📄 Contrato: ${contractAddress}
🔗 TX: ${txHash}
💰 Quantidade: ${amount}

Obrigado por fazer parte do NEØ Protocol!`;

    await sendWhatsAppMessage(payerId, message);
    console.log(`[MINT_CONFIRMED] Notification sent to ${payerId}`);
}

async function handlePaymentReceived(payload) {
    const { payerId, amount, transactionId } = payload;

    const message = `✅ Pagamento Confirmado!

Recebemos seu PIX de R$ ${amount.toFixed(2)}.

🔄 Processando seu token...
⏱️ Aguarde alguns minutos.

ID: ${transactionId}`;

    await sendWhatsAppMessage(payerId, message);
    console.log(`[PAYMENT_RECEIVED] Notification sent to ${payerId}`);
}

app.listen(PORT, () => {
    console.log(`[FLOWCLOSER] Server running on port ${PORT}`);
    console.log(`[FLOWCLOSER] Webhook endpoint: POST /api/webhook/nexus`);
});
