
import type { IncomingMessage, ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readJsonBodyOrError, sendJson, sendUnauthorized } from "./http-common.js";
import { Nexus, ProtocolEvent } from "../nexus/index.js";
import { createSubsystemLogger } from "../logging/subsystem.js";

const log = createSubsystemLogger("nexus-webhook");

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
    if (url !== "/api/webhook/nexus") return false;

    if (req.method !== "POST") {
        res.statusCode = 405;
        res.end("Method Not Allowed");
        return true;
    }

    // 1. Validate Signature
    const signature = req.headers["x-nexus-signature"] as string;
    const secret = process.env.NEXUS_SECRET;

    if (!signature || !secret) {
        log.warn("Missing signature or NEXUS_SECRET");
        sendUnauthorized(res);
        return true;
    }

    // Read body to validate HMAC
    const body = await readJsonBodyOrError(req, res, 1024 * 1024);
    if (body === undefined) return true;

    const expectedSignature = createHmac("sha256", secret)
        .update(JSON.stringify(body))
        .digest("hex");

    try {
        const isValid = timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );

        if (!isValid) {
            log.error("Invalid HMAC signature from Nexus");
            sendUnauthorized(res);
            return true;
        }
    } catch (err) {
        sendUnauthorized(res);
        return true;
    }

    // 2. Process Event
    const { event, payload } = body as { event: string; payload: any };
    log.info(`Received event from Nexus: ${event}`);

    // Dispatch to internal Nexus bus
    if (Object.values(ProtocolEvent).includes(event as ProtocolEvent)) {
        Nexus.dispatch(event as ProtocolEvent, payload);

        // Custom logic for Neobot specific actions
        if (event === ProtocolEvent.MINT_CONFIRMED) {
            // Trigger WhatsApp notification logic here or via a dedicated reactor listener
            log.info(`MINT_CONFIRMED for ${payload.orderId}. WhatsApp dispatcher should take over.`);
        }
    } else {
        log.warn(`Unknown protocol event type: ${event}`);
    }

    sendJson(res, 200, { ok: true, received: event });
    return true;
}
