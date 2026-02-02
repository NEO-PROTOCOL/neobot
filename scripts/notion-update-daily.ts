import { env } from 'process';

const NOTION_KEY = env.NOTION_API_KEY;
const NOTION_VERSION = "2022-06-28";
// Use the exact IDs to ensure we are updating the right places
const PAGE_ID = "2f78c6e8-3be0-81af-880e-dd88440a4642";
const WORKLOG_DB_ID = "93f062cd-fb28-4c48-a370-d67579b9c902";
const PROJECTS_DB_ID = "29fb6f21-b534-41c0-8a2a-88dbefedc498";
const BLOCK_ID = "217740d2-8f2d-48d8-909f-7243d43dc2c7"; // Section to update

const headers = {
    "Authorization": `Bearer ${NOTION_KEY}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
};

// --- DATA TO LOG ---

const WORK_LOGS = [
    {
        title: "Update: WOD [X] PRO Found",
        details: "Detected active updates (Feb 01): Roadmap, Investor Pitch, Tokenomics, Architecture, and Whitepaper drafts.",
        project: "WOD [X] PRO" // This won't link automatically because it's not in the main Project DB, but we log it.
    },
    {
        title: "Sync: WOD Sub-pages",
        details: "Found 15+ sub-pages including: Email Auth, IPFS Setup, Gas Manager, Branding, and Swordfish contract.",
        project: "WOD [X] PRO"
    }
];

const HUB_UPDATE_TEXT = `
**Atualização (WOD [X] PRO):**

1. **Atividade Recente (01/Fev)**:
   - Sincronização detectou atualizações em "WOD [X] PRO".
   - **Novos Documentos**: Roadmap, Pitch Deck (v1/v2), Tokenomics, Whitepaper.
   - **Técnico**: Arquitetura de Treinos, Auth Setup, IPFS, Gas Manager.
   - **Branding & MKT**: Diretrizes de marca e planejamento.

2. **Status**:
   - Projeto está VIVO e em documentação acelerada.
   - Necessário integrar repositórios de código com essas definições.
`;

// --- FUNCTIONS ---

async function getProjectId(name: string) {
    const res = await fetch("https://api.notion.com/v1/search", {
        method: "POST",
        headers,
        body: JSON.stringify({
            query: name,
            filter: { value: "page", property: "object" }
        })
    });
    const data = await res.json() as any;
    // Filter for pages that are in the PROJECTS_DB
    const page = data.results.find((r: any) => r.parent.database_id === PROJECTS_DB_ID);
    return page ? page.id : null;
}

async function createWorkLog(log: any) {
    console.log(`📝 Logging: ${log.title}...`);

    const properties: any = {
        "Registro": { "title": [{ "text": { "content": log.title } }] },
        "Detalhes": { "rich_text": [{ "text": { "content": log.details } }] }
    };

    // Link to Project if found
    const projectId = await getProjectId(log.project);
    if (projectId) {
        properties["Projeto"] = { "relation": [{ "id": projectId }] };
    } else {
        console.warn(`⚠️ Project not found for linking: ${log.project}`);
    }

    const res = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers,
        body: JSON.stringify({
            parent: { database_id: WORKLOG_DB_ID },
            properties
        })
    });

    if (!res.ok) {
        console.error("Failed to log:", await res.json());
    } else {
        console.log("✅ Logged.");
    }
}

async function updateHubPage() {
    console.log(`✨ Updating Hub Section: ${BLOCK_ID}...`);

    // We append children to the page or update a specific block?
    // The user asked to update a specific SECTION/BLOCK.
    // Usually we append blocks to the block ID (toggle or page).

    const res = await fetch(`https://api.notion.com/v1/blocks/${BLOCK_ID}/children`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
            children: [
                {
                    object: "block",
                    type: "paragraph",
                    paragraph: {
                        rich_text: [
                            {
                                text: { content: HUB_UPDATE_TEXT }
                            }
                        ]
                    }
                }
            ]
        })
    });

    if (!res.ok) {
        const err = await res.json() as any;
        console.error("Failed to update Hub:", JSON.stringify(err));
        // Fallback: Append to Page if block not found or not a container
        if (err.code === "object_not_found" || err.message.includes("does not support")) {
            console.log("Fallback: Appending to Page ID instead.");
            await fetch(`https://api.notion.com/v1/blocks/${PAGE_ID}/children`, {
                method: "PATCH",
                headers,
                body: JSON.stringify({
                    children: [
                        {
                            object: "block",
                            type: "heading_2",
                            heading_2: { rich_text: [{ text: { content: "Log de Atualização (Fallback)" } }] }
                        },
                        {
                            object: "block",
                            type: "paragraph",
                            paragraph: { rich_text: [{ text: { content: HUB_UPDATE_TEXT } }] }
                        }
                    ]
                })
            });
        }
    } else {
        console.log("✅ Hub Updated.");
    }
}

async function main() {
    // 1. Log Entries
    for (const log of WORK_LOGS) {
        await createWorkLog(log);
    }

    // 2. Update Hub
    await updateHubPage();
}

main();
