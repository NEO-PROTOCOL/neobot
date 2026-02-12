import { env } from 'process';

const NOTION_KEY = env.NOTION_API_KEY;
const NOTION_VERSION = "2022-06-28";
const headers = {
    "Authorization": `Bearer ${NOTION_KEY}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
};

async function listAll() {
    console.log("🛡️ NOTION GUARDIAN :: Listando estrutura visível...");

    if (!NOTION_KEY) {
        console.error("❌ Erro: NOTION_API_KEY não encontrada no ambiente.");
        return;
    }

    const res = await fetch("https://api.notion.com/v1/search", {
        method: "POST",
        headers,
        body: JSON.stringify({
            sort: {
                direction: "descending",
                timestamp: "last_edited_time"
            }
        })
    });

    const data = await res.json();

    if (data.results) {
        console.log(`✅ Foram encontrados ${data.results.length} itens.\n`);
        data.results.forEach(item => {
            const type = item.object;
            const id = item.id;
            const parentType = item.parent?.type;
            const parentId = item.parent?.[parentType];

            let title = "Sem título";
            if (type === 'page') {
                title = item.properties?.title?.title?.[0]?.plain_text ||
                    item.properties?.Name?.title?.[0]?.plain_text ||
                    "Página";
            } else if (type === 'database' || type === 'data_source') {
                title = item.title?.[0]?.plain_text || "Database";
            }

            // 🚫 PROTOCOLO SWORDFISH: Segurança Máxima
            if (title.toLowerCase().includes("swordfish")) {
                console.log(`- [${type.toUpperCase()}] [REDACTED] (SWORDFISH PROTECTED)`);
                return; // Ignora o resto do processamento para este item
            }

            console.log(`- [${type.toUpperCase()}] ${title}`);
            console.log(`  ID: ${id}`);
            console.log(`  PAI: ${parentType} (${parentId || 'Raiz/Workspace'})\n`);
        });
    } else {
        console.log("❌ Nada encontrado ou erro na resposta:", JSON.stringify(data));
    }
}

listAll();
