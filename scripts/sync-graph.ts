import fs from 'fs';
import path from 'path';

// Paths
const ECOSYSTEM_PATH = path.resolve(process.cwd(), 'config/ecosystem.json');
const DASHBOARD_GRAPH_PATH = path.resolve(process.cwd(), '../neo-dashboard-deploy/ecosystem-graph.json');

// Color and Weight Mapping
const ORG_CONFIG: Record<string, { color: string, val: number }> = {
    "NEO Protocol": { color: "#ff4444", val: 10 },
    "Neo Smart Factory": { color: "#00ccff", val: 8 },
    "FlowPay": { color: "#00ffcc", val: 8 },
    "Fluxx Dao": { color: "#4488ff", val: 7 },
    "FlowOFF Agency": { color: "#ff00ff", val: 5 },
    "WOD Game": { color: "#ffcc00", val: 6 },
    "Neo Tooling": { color: "#aaaaaa", val: 3 }
};

function syncGraph() {
    if (!fs.existsSync(ECOSYSTEM_PATH)) {
        console.error("❌ Source ecosystem.json not found!");
        return;
    }

    const ecosystem = JSON.parse(fs.readFileSync(ECOSYSTEM_PATH, 'utf-8'));

    const nodes = ecosystem.map((p: any) => ({
        id: p.id,
        name: p.name,
        group: p.org || "Uncategorized",
        val: ORG_CONFIG[p.org]?.val || 3
    }));

    // Simple heuristic for links based on project descriptions and roles
    const links: any[] = [];

    ecosystem.forEach((p: any) => {
        // Link everything in Factory to the Hub
        if (p.org === "Neo Smart Factory" && p.id !== "neo-smart-factory") {
            links.push({ source: p.id, target: "neo-smart-factory", label: "internal" });
        }

        // Link Core to main Org Hubs
        if (p.id === "flowcloser-agent") {
            const hubs = ["neo-smart-factory", "flowpay", "mio-system", "agent-neo-flowoff", "fluxx-contracts"];
            hubs.forEach(hub => {
                if (ecosystem.some((e: any) => e.id === hub)) {
                    links.push({ source: p.id, target: hub, label: "orchestration" });
                }
            });
        }

        // Link Apps to their respective layers
        if (p.role?.includes("DApp") || p.role?.includes("App")) {
            if (p.org === "WOD Game" && p.id !== "wod-eth") {
                links.push({ source: p.id, target: "wod-eth", label: "contract" });
            }
        }
    });

    const graphData = { nodes, links };

    fs.writeFileSync(DASHBOARD_GRAPH_PATH, JSON.stringify(graphData, null, 2));
    console.log(`✅ Graph synced to: ${DASHBOARD_GRAPH_PATH}`);
}

console.log("🔄 Syncing Ecosystem Graph...");
syncGraph();
