import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';

const logger = pino({ level: 'silent' });
let sock;

export async function initWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(
        process.env.WHATSAPP_SESSION_PATH || './whatsapp-session'
    );

    sock = makeWASocket({
        auth: state,
        logger,
        printQRInTerminal: true,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('[WHATSAPP] Connection closed. Reconnecting:', shouldReconnect);

            if (shouldReconnect) {
                initWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('[WHATSAPP] Connected successfully');
        }
    });
}

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
    if (!sock) {
        throw new Error('WhatsApp not initialized');
    }

    // Format phone number (remove non-digits, add country code if needed)
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    const jid = `${formattedNumber}@s.whatsapp.net`;

    await sock.sendMessage(jid, { text: message });
    console.log(`[WHATSAPP] Message sent to ${phoneNumber}`);
}

// Initialize on module load
initWhatsApp().catch(console.error);
