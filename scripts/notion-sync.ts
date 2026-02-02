import { env } from 'process';

const NOTION_KEY = env.NOTION_API_KEY;
const NOTION_VERSION = "2022-06-28"; // Stable version

if (!NOTION_KEY) {
    console.error("❌ Erro: NOTION_API_KEY não encontrada no ambiente.");
    console.error("   Export a chave: export NOTION_API_KEY='ntn_...'");
    console.error("   Ou adicione no .env");
    process.exit(1);
}

const headers = {
    "Authorization": `Bearer ${NOTION_KEY}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
};

async function searchDatabase(query: string) {
    console.log(`🔍 Buscando database: "${query}"...`);
    const res = await fetch("https://api.notion.com/v1/search", {
        method: "POST",
        headers,
        body: JSON.stringify({
            query,
            filter: { value: "database", property: "object" }
        })
    });

    const data = await res.json() as any;
    if (!res.ok) {
        throw new Error(`Notion API Error: ${JSON.stringify(data)}`);
    }

    // Find exact match or first result
    const db = data.results[0];
    if (!db) {
        throw new Error(`Database "${query}" não encontrada.`);
    }

    console.log(`✅ Database encontrada: ${db.title?.[0]?.plain_text || "Sem titulo"} (${db.id})`);
    return db.id;
}

async function createPage(dbId: string, project: any) {
    console.log(`🚀 Criando projeto: ${project.name}...`);

    const properties: any = {
        "Nome": { "title": [{ "text": { "content": project.name } }] },
        "Status": { "select": { "name": project.status } },
        "Descrição": { "rich_text": [{ "text": { "content": project.description } }] }
    };

    if (project.url) {
        if (project.url.includes("github.com")) {
            properties["GitHub"] = { "url": project.url };
        } else {
            // If not GitHub, append to description or ignore (Notion schema doesn't have URL field)
            properties["Descrição"].rich_text.push({ "text": { "content": "\nURL: " + project.url } });
        }
    }

    const res = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers,
        body: JSON.stringify({
            parent: { database_id: dbId },
            properties
        })
    });

    const data = await res.json();
    if (!res.ok) {
        console.error(`❌ Falha ao criar ${project.name}:`, JSON.stringify(data));
    } else {
        console.log(`✅ Criado com sucesso! ID: ${data.id}`);
    }
}

const PROJECTS = [
    {
        name: "NEØ FlowOFF (Agência)",
        status: "Ativo",
        description: "Site oficial da agência de marketing digital e blockchain. Traz clientes.",
        url: "https://www.flowoff.xyz/"
    },
    {
        name: "FlowCloser Agent",
        status: "Produção",
        description: "Lead qualification agent com Instagram DM automation. 100% operacional no Railway.",
        url: "https://flowcloser-agent-production.up.railway.app"
    },
    {
        name: "NEØ:One (ASI1 Agent)",
        status: "Em desenvolvimento",
        description: "Agente ASI1 autônomo com Model Context Protocol para orquestração multi-intents.",
        url: "https://github.com/neomello/neo-one"
    },
    {
        name: "NodeMello.run",
        status: "Avaliação",
        description: "Node runner infrastructure. Precisa auditoria.",
        url: "https://github.com/nodeneoprotocol-bot"
    }
];

const WOD_PROJECT = {
    name: "WOD [X] PRO",
    status: "Ativo", // Assuming active based on "updates made"
    description: "Fitness + Blockchain. Deployed on Base Mainnet. Updates JAN 31.",
    url: "https://github.com/wodxpro/wod-x-pro" // Guessing based on folder structure
};

// Check WOD and Create if Missing
async function ensureWodProject(dbId: string) {
    console.log(`🔍 Checking "WOD [X] PRO" in DB ${dbId}...`);

    const res = await fetch("https://api.notion.com/v1/search", {
        method: "POST",
        headers,
        body: JSON.stringify({
            query: "WOD",
            filter: { value: "page", property: "object" }
        })
    });

    const data = await res.json() as any;
    const project = data.results.find((p: any) =>
        p.parent.database_id === dbId &&
        (p.properties["Nome"].title[0]?.plain_text.includes("WOD") || p.properties["Nome"].title[0]?.plain_text.includes("PRO"))
    );

    if (project) {
        console.log(`✅ FOUND: ${project.properties["Nome"].title[0].plain_text} (ID: ${project.id})`);
    } else {
        console.log("❌ NOT FOUND: WOD [X] PRO. Creating...");
        await createPage(dbId, WOD_PROJECT);
    }
}

async function main() {
    try {
        const dbId = "29fb6f21-b534-41c0-8a2a-88dbefedc498";

        // Check WOD
        await ensureWodProject(dbId);

        // Optional: Sync other projects if needed
        /*
        for (const proj of PROJECTS) {
             await createPage(dbId, proj);
        }
        */

    } catch (e) {
        console.error(e);
    }
}

main();
