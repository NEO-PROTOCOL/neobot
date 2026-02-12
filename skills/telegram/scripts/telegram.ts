import { sendMessageTelegram } from "../../../src/telegram/send.js";
import { loadDotEnv } from "../../../src/infra/dotenv.js";

loadDotEnv();

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

    console.log(`📡 Enviando mensagem para ${to}...`);

    try {
        const result = await sendMessageTelegram(to, message);
        console.log(`✅ Mensagem enviada! ID: ${result.messageId}`);
        process.exit(0);
    } catch (err) {
        console.error(`❌ Falha ao enviar: ${err}`);
        process.exit(1);
    }
}

main();
