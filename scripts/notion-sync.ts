import 'dotenv/config';
import { env } from 'process';

// === CONFIG ===
// Obtido via Debug: "📁 Projetos NEØ"
const DB_ID_PROJETOS = "29fb6f21-b534-41c0-8a2a-88dbefedc498";
const NOTION_KEY = env.NOTION_API_KEY;
const NOTION_VERSION = "2022-06-28";

if (!NOTION_KEY) {
    console.error("❌ Erro: NOTION_API_KEY não encontrada.");
    console.error("   Execute: export NOTION_API_KEY='ntn_...'");
    process.exit(1);
}

const headers = {
    "Authorization": `Bearer ${NOTION_KEY}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
};

// === HELPER FUNCTIONS ===

async function findPageInDatabase(dbId: string, titleParams: { key: string, value: string }) {
    // Tenta encontrar pelo título exato para evitar duplicatas
    const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
        method: "POST", headers,
        body: JSON.stringify({
            filter: {
                property: titleParams.key,
                title: { equals: titleParams.value }
            }
        })
    });

    if (!res.ok) {
        // Se falhar (ex: 404), retorna null silenciosamente ou loga erro
        const err = await res.text();
        console.error(`⚠️ Erro ao buscar no DB ${dbId}: ${err}`);
        return null;
    }

    const data = await res.json() as any;
    return data.results?.[0] || null;
}

async function upsertProject(dbId: string, project: any) {
    // 1. Verificar se já existe
    const existing = await findPageInDatabase(dbId, { key: "Nome", value: project.name });

    // 2. Preparar payload (Propriedades padrão)
    // Nota: Os nomes das propriedades ("Status", "Nome") devem bater EXATAMENTE com as colunas do seu Notion.
    const properties: any = {
        "Nome": { "title": [{ "text": { "content": project.name } }] },
        // "Status": { "select": { "name": project.status } }, // Comentado pois se a opção não existir no select, a API dá erro.
        "Descrição": { "rich_text": [{ "text": { "content": project.description } }] }
    };

    // Tenta adicionar Status se soubermos que é seguro (ou envia como texto na descrição)
    // Para segurança, vou concatenar o status na descrição:
    properties["Descrição"].rich_text.push({ "text": { "content": `\n\n📌 Status: ${project.status}` } });

    if (project.url) {
        properties["Descrição"].rich_text.push({ "text": { "content": `\n🔗 Link: ${project.url}` } });
        // Se tivermos certeza que existe uma coluna URL:
        // properties["URL"] = { "url": project.url }; 
    }

    if (existing) {
        console.log(`🔄 Atualizando: ${project.name} (${existing.id})...`);
        const res = await fetch(`https://api.notion.com/v1/pages/${existing.id}`, {
            method: "PATCH", headers,
            body: JSON.stringify({ properties })
        });
        if (res.ok) console.log(`✅ Atualizado!`);
        else console.error(`❌ Erro update:`, await res.text());
    } else {
        console.log(`✨ Criando novo: ${project.name}...`);
        const res = await fetch("https://api.notion.com/v1/pages", {
            method: "POST", headers,
            body: JSON.stringify({
                parent: { database_id: dbId },
                properties
            })
        });
        if (res.ok) console.log(`✅ Criado!`);
        else console.error(`❌ Erro create:`, await res.text());
    }
}

// === MAIN ===

async function main() {
    try {
        console.log(`🎯 Iniciando Sync para Database: Projetos NEØ (${DB_ID_PROJETOS})`);
        console.log(`   (Certifique-se que o Bot tem acesso e que as colunas 'Nome' e 'Descrição' existem)\n`);

        const CURRENT_STATUS = [
            {
                name: "FlowCloser Agent",
                status: "Em andamento",
                description: "Agente de Vendas WhatsApp. Versão Lean (No Slack/Discord). Admin: +5562983231110.",
                url: "https://flowcloser-agent-production.up.railway.app"
            },
            {
                name: "FlowPay Sovereign",
                status: "Em andamento",
                description: "Gateway de Pagamentos + Smart Factory Bridge. Webhook Idempotency OK.",
                url: "https://pay.neoflowoff.agency"
            },
            {
                name: "WOD [X] PRO",
                status: "Concluido",
                description: "Fitness DApp on Base. 100% Operational.",
                url: "https://wod-x-pro.vercel.app"
            }
        ];

        for (const proj of CURRENT_STATUS) {
            await upsertProject(DB_ID_PROJETOS, proj);
        }

        console.log("\n✅ Sync Finalizado.");

    } catch (e) {
        console.error(e);
    }
}

main();
