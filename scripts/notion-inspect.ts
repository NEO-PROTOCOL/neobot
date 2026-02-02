import { env } from 'process';

const NOTION_KEY = env.NOTION_API_KEY;
const NOTION_VERSION = "2022-06-28";

const headers = {
    "Authorization": `Bearer ${NOTION_KEY}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
};

async function inspectFragmentChildren() {
    const SOURCE_ID = "2d78c6e8-3be0-8059-a05c-c3c492cf7c08";
    const FRAGMENT_ID = "2f88c6e8-3be0-80b9-b1dd-e1821079e9e4";

    console.log(`\n🔍 reading children of Page ${SOURCE_ID}...`);

    const res = await fetch(`https://api.notion.com/v1/blocks/${SOURCE_ID}/children?page_size=100`, { headers });
    const data = await res.json() as any;

    let found = false;
    let count = 0;

    console.log("--- BLOCKS FOUND ---");
    for (const block of data.results) {
        if (block.id.replaceAll("-", "") === FRAGMENT_ID.replaceAll("-", "")) {
            found = true;
            console.log(`📍 TARGET HEADING FOUND: [${block.type}] ${block[block.type].rich_text[0]?.plain_text}`);
            continue;
        }

        if (found) {
            // Stop if we hit another main heading (h1)
            if (block.type === 'heading_1') {
                console.log(`🛑 Stopping at next Heading 1: ${block.heading_1.rich_text[0]?.plain_text}`);
                break;
            }

            // Log the content
            const typeObj = block[block.type];
            let text = "n/a";
            if (typeObj && typeObj.rich_text && typeObj.rich_text.length > 0) {
                text = typeObj.rich_text[0].plain_text;
            } else if (block.type === "child_page") {
                text = `PAGE: ${block.child_page.title}`;
            }

            console.log(`   - [${block.type}] ${text} (ID: ${block.id})`);
            count++;
        }
    }
    console.log(`--- Total blocks to move: ${count} ---`);
}

inspectFragmentChildren();
