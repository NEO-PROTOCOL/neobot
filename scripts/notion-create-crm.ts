import { env } from 'process';

const NOTION_KEY = env.NOTION_API_KEY;
const PARENT_PAGE_ID = "2d78c6e8-3be0-8035-b412-c2fa4cc20ad6"; // NΞØ PRODUCT STACK Page

const headers = {
    "Authorization": `Bearer ${NOTION_KEY}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
};

async function createCRM() {
    console.log("🏗 Creating CRM Database...");

    const res = await fetch("https://api.notion.com/v1/databases", {
        method: "POST",
        headers,
        body: JSON.stringify({
            parent: { page_id: PARENT_PAGE_ID },
            title: [{ type: "text", text: { content: "CRM LEADS (FlowCloser)" } }],
            properties: {
                "Name": { "title": {} },
                "Company": { "rich_text": {} },
                "Status": {
                    "select": {
                        "options": [
                            { "name": "New", "color": "blue" },
                            { "name": "Qualified", "color": "green" },
                            { "name": "Contacted", "color": "yellow" },
                            { "name": "Closed", "color": "red" }
                        ]
                    }
                },
                "Score": { "number": { "format": "number" } },
                "Platform": {
                    "select": {
                        "options": [
                            { "name": "Instagram", "color": "purple" },
                            { "name": "WhatsApp", "color": "green" }
                        ]
                    }
                },
                "Phone/ID": { "rich_text": {} },
                "Last Interaction": { "date": {} }
            }
        })
    });

    const data = await res.json() as any;
    if (res.ok) {
        console.log(`✅ CRM Created! ID: ${data.id}`);
        console.log(`   URL: ${data.url}`);
    } else {
        console.error("❌ Failed:", JSON.stringify(data));
    }
}

createCRM();
