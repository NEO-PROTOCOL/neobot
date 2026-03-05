
import type { IncomingMessage, ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readJsonBodyOrError, sendJson, sendUnauthorized } from "./http-common.js";
import { Nexus, ProtocolEvent } from "../nexus/index.js";
import { createSubsystemLogger } from "../logging/subsystem.js";

const log = createSubsystemLogger("nexus-webhook");

type SecretSlot = "new" | "old" | "legacy";

type SecretCandidate = {
    slot: SecretSlot;
    value: string;
};

function configuredNexusSecrets(): SecretCandidate[] {
    const ordered: Array<{ slot: SecretSlot; raw?: string }> = [
        { slot: "new", raw: process.env.NEXUS_SECRET_NEW },
        { slot: "old", raw: process.env.NEXUS_SECRET_OLD },
        { slot: "legacy", raw: process.env.NEXUS_SECRET },
    ];

    const seen = new Set<string>();
    const out: SecretCandidate[] = [];
    for (const item of ordered) {
        const value = (item.raw || "").trim();
        if (!value || seen.has(value)) {
            continue;
        }
        seen.add(value);
        out.push({ slot: item.slot, value });
    }
    return out;
}

/**
 * ============================================================================
 *                    NEOBOT — Nexus Webhook Receiver
 * ============================================================================
 * Handles events from Neo-Nexus (central hub).
 */

export async function handleNexusWebhookHttpRequest(
    req: IncomingMessage,
    res: ServerResponse
): Promise<boolean> {
    const url = req.url ?? "/";
    if (url !== "/api/webhook/nexus") {return false;}

    if (req.method !== "POST") {
        res.statusCode = 405;
        res.end("Method Not Allowed");
        return true;
    }

    // 1. Validate Signature
    const signature = req.headers["x-nexus-signature"] as string;
    const secrets = configuredNexusSecrets();

    if (!signature || secrets.length === 0) {
        log.warn("Missing signature or NEXUS secrets");
        sendUnauthorized(res);
        return true;
    }

    // Read body to validate HMAC
    const body = await readJsonBodyOrError(req, res, 1024 * 1024);
    if (body === undefined) {return true;}

    const serializedBody = JSON.stringify(body);
    const provided = Buffer.from(signature);
    let matchedSlot: SecretSlot | null = null;

    for (const candidate of secrets) {
        const expected = createHmac("sha256", candidate.value).update(serializedBody).digest("hex");
        const expectedBuffer = Buffer.from(expected);
        if (provided.length !== expectedBuffer.length) {
            continue;
        }
        if (timingSafeEqual(provided, expectedBuffer)) {
            matchedSlot = candidate.slot;
            break;
        }
    }

    if (!matchedSlot) {
        log.error("Invalid HMAC signature from Nexus");
        sendUnauthorized(res);
        return true;
    }

    log.info(`Nexus signature accepted (slot: ${matchedSlot})`);

    // 2. Process Event
    const { event, payload } = body as { event: string; payload: unknown };
    log.info(`Received event from Nexus: ${event}`);

    // Dispatch to internal Nexus bus
    if (Object.values(ProtocolEvent).includes(event as ProtocolEvent)) {
        Nexus.dispatch(event as ProtocolEvent, payload);

        // Custom logic for Neobot specific actions
        if ((event as ProtocolEvent) === ProtocolEvent.MINT_CONFIRMED) {
            // Trigger WhatsApp notification logic here or via a dedicated reactor listener
            log.info(`MINT_CONFIRMED for ${payload.orderId}. WhatsApp dispatcher should take over.`);
        }
    } else {
        log.warn(`Unknown protocol event type: ${event}`);
    }

    sendJson(res, 200, { ok: true, received: event });
    return true;
}
