import { env } from 'process';

const NOTION_KEY = env.NOTION_API_KEY;
const NOTION_VERSION = "2022-06-28";
const HEADERS = {
    "Authorization": `Bearer ${NOTION_KEY}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
};

const SOURCE_ID = "2d78c6e8-3be0-8059-a05c-c3c492cf7c08";
const DEST_ID = "2d78c6e8-3be0-8035-b412-c2fa4cc20ad6";
const FRAGMENT_ID_CLEAN = "2f88c6e83be080b9b1dde1821079e9e4"; // No dashes for comparison

async function migrate() {
    console.log(`\n🚀 Starting Migration...`);

    // 1. Get Blocks to Move
    const res = await fetch(`https://api.notion.com/v1/blocks/${SOURCE_ID}/children?page_size=100`, { headers: HEADERS });
    const data = await res.json() as any;

    const blocksToMove: any[] = [];
    let found = false;

    for (const block of data.results) {
        if (block.id.replaceAll("-", "") === FRAGMENT_ID_CLEAN) {
            found = true;
            console.log(`📍 Found Starting Heading: ${block.type}`);
            continue;
        }

        if (found) {
            if (block.type === 'heading_1') break; // Stop at next section
            blocksToMove.push(block);
        }
    }

    console.log(`📦 Found ${blocksToMove.length} blocks to migrate.`);
    if (blocksToMove.length === 0) return;

    // 2. Prepare Blocks for Destination
    const newBlocks: any[] = [];

    for (const b of blocksToMove) {
        if (b.type === "child_page") {
            // Cannot move child_page. Create a Link/Mention instead.
            console.log(`   Detailed: Page "${b.child_page.title}" (ID: ${b.id}) - Creating Link.`);
            newBlocks.push({
                object: "block",
                type: "link_to_page",
                link_to_page: {
                    page_id: b.id
                }
            });
        } else if (b.type === "code") {
            console.log(`   Detailed: Code Block`);
            newBlocks.push({
                object: "block",
                type: "code",
                code: {
                    rich_text: b.code.rich_text,
                    language: b.code.language
                }
            });
        } else if (b.type === "paragraph") {
            if (b.paragraph.rich_text.length === 0) continue; // Skip empty
            console.log(`   Detailed: Paragraph`);
            newBlocks.push({
                object: "block",
                type: "paragraph",
                paragraph: {
                    rich_text: b.paragraph.rich_text
                }
            });
        } else {
            console.log(`   ⚠️ Skipping unsupported type: ${b.type}`);
        }
    }

    // 3. Append to Destination
    if (newBlocks.length > 0) {
        console.log(`\n📝 Appending to Destination Page ${DEST_ID}...`);
        const appendRes = await fetch(`https://api.notion.com/v1/blocks/${DEST_ID}/children`, {
            method: "PATCH",
            headers: HEADERS,
            body: JSON.stringify({ children: newBlocks })
        });

        if (!appendRes.ok) {
            console.error("❌ Failed to append:", await appendRes.json());
        } else {
            console.log("✅ Successfully migrated blocks (as copies/links)!");
        }
    } else {
        console.log("No valid blocks content to migrate.");
    }
}

migrate();
