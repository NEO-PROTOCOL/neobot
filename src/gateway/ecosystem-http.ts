
import type { IncomingMessage, ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { sendJson } from "./http-common.js";

/**
 * Handle GET /api/ecosystem
 * Exposes the ecosystem.json as a mini-api for other projects.
 */
export async function handleEcosystemHttpRequest(
    req: IncomingMessage,
    res: ServerResponse
): Promise<boolean> {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    // We match /api/ecosystem (legacy) and /v1/ecosystem (modern)
    if (url.pathname !== "/api/ecosystem" && url.pathname !== "/v1/ecosystem") {
        return false;
    }

    if (req.method !== "GET") {
        res.statusCode = 405;
        res.setHeader("Allow", "GET");
        res.end("Method Not Allowed");
        return true;
    }

    try {
        const configPath = join(process.cwd(), "config", "ecosystem.json");
        const content = await readFile(configPath, "utf-8");
        const ecosystem = JSON.parse(content);

        const id = url.searchParams.get("id");
        if (id) {
            const node = ecosystem.find((item: any) => item.id === id);
            if (!node) {
                sendJson(res, 404, { ok: false, error: "Node not found" });
                return true;
            }
            sendJson(res, 200, { ok: true, node });
            return true;
        }

        sendJson(res, 200, { ok: true, ecosystem });
        return true;

    } catch (error) {
        console.error('[GATEWAY] ❌ Ecosystem API Error:', error);
        sendJson(res, 500, { ok: false, error: "Internal Server Error" });
        return true;
    }
}
