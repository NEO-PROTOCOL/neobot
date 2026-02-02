import { env } from 'process';

const NOTION_KEY = env.NOTION_API_KEY;
const NOTION_VERSION = "2022-06-28";
const headers = {
    "Authorization": `Bearer ${NOTION_KEY}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
};

async function checkCRMItems() {
    const CRM_DB_ID = "2fb8c6e8-3be0-81ff-ac81-c853ae0cefc7";
    console.log(`\n🔍 Checking CRM Items in ${CRM_DB_ID}...`);

    const res = await fetch(`https://api.notion.com/v1/databases/${CRM_DB_ID}/query`, {
        method: "POST",
        headers
    });

    const data = await res.json() as any;
    console.log(`📦 Found ${data.results.length} leads.`);

    data.results.slice(0, 10).forEach((p: any) => {
        const name = p.properties["Name"]?.title?.[0]?.plain_text || "No Name";
        const status = p.properties["Status"]?.select?.name || "No Status";
        console.log(`   - 👤 ${name} [${status}]`);
    });
}

checkCRMItems();
