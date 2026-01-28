import { TelegramChannel } from "../../../src/channels/plugins/outbound/telegram.js";
import { loadConfig } from "../../../src/config/config.js";

async function main() {
    const args = process.argv.slice(2);
    const toIndex = args.indexOf("--to");
    const msgIndex = args.indexOf("--message");

    if (toIndex === -1 || msgIndex === -1) {
        console.error("❌ Mínimo necessário: --to @contato --message 'mensagem'");
        process.exit(1);
    }

    const to = args[toIndex + 1];
    const message = args[msgIndex + 1];

    const cfg = loadConfig();
    const channel = new TelegramChannel({ config: cfg });

    console.log(`📡 Enviando mensagem para ${to}...`);

    try {
        // Note: We might need to resolve @username to a chat ID if the channel doesn't support it directly.
        // However, looking at the code, it probably needs a chat ID or uses the telegram API.
        await channel.send({
            to,
            payloads: [{ text: message }]
        });
        console.log("✅ Mensagem enviada!");
        process.exit(0);
    } catch (err) {
        console.error(`❌ Falha ao enviar: ${err}`);
        process.exit(1);
    }
}

main();
