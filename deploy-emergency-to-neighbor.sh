#!/bin/bash
TARGET_DIR="../neo-agent-full"

echo "🦞 [Emergency Deploy] Mirando em: $TARGET_DIR"

if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Diretório não encontrado!"
    exit 1
fi

# 1. Instalar dependências no vizinho
echo "📦 Instalando dependências (Baileys, Pino, QRCode)..."
cd "$TARGET_DIR"
# Usando npm porque vi package-lock.json lá. Adicionando --legacy-peer-deps para evitar conflitos de versão antigos.
npm install @whiskeysockets/baileys@latest qrcode-terminal pino --save --legacy-peer-deps

# 2. Criar código do servidor WhatsApp
echo "📝 Criando src/whatsapp-server.ts..."
cat <<EOF > src/whatsapp-server.ts
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import qrcode from "qrcode-terminal"; // @ts-ignore

const SESSION_DIR = process.env.WHATSAPP_SESSION_DIR || "./data/whatsapp-session";

async function connectToWhatsApp() {
  console.log("🦞 [FlowCloser] Inicializando State em:", SESSION_DIR);
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version } = await fetchLatestBaileysVersion();
  
  console.log(\`🦞 [FlowCloser] Iniciando WhatsApp v\${version.join(".")}\`);

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    auth: state,
    browser: ["FlowCloser", "Chrome", "1.0.0"],
    syncFullHistory: false,
    generateHighQualityLinkPreview: true
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\\n⚠️  QR Code Recebido - ESCANEIE ABAIXO:\\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      
      console.log(
        "❌ Conexão fechada. Reconectando:",
        shouldReconnect
      );

      if (shouldReconnect) {
        setTimeout(connectToWhatsApp, 5000); // Wait 5s before reconnect
      }
    } else if (connection === "open") {
      console.log("✅ [FlowCloser] WhatsApp Conectado com Sucesso! 🚀");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (m) => {
    if (m.type !== "notify") return;
    
    for (const msg of m.messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const remoteJid = msg.key.remoteJid!;
      // Simple text extraction
      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption;

      if (!text) continue;

      console.log(\`📩 Mensagem de \${remoteJid}: \${text}\`);

      // Auto-reply
      await sock.sendMessage(remoteJid, {
        text: "👋 Olá! Sou o FlowCloser (Startup Mode).\\n\\nRecebi: " + text
      });
    }
  });
}

connectToWhatsApp();
EOF

# 3. Atualizar package.json com script de start
# (Para não usar ferramentas complexas de JSON no bash, vou instruir o usuário a rodar manualmente se precisar, ou usar o ts-node direto)

echo "✅ Instalação concluída!"
echo "🚀 Para testar, execute: cd $TARGET_DIR && npx ts-node src/whatsapp-server.ts"
