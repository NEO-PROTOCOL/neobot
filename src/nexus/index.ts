
import EventEmitter from "events";
import { loadRules, loadSafeMode } from "./config.js";
import { runSafeHandler, CircuitBreaker, applyTemplate } from "./middleware.js";

/**
 * ============================================================================
 *                       PROTOCOL NEXUS - EVENT BUS
 * ============================================================================
 * The central nervous system of the NEØ Protocol.
 * routes events between Sovereign Nodes (FlowPay, Factory, Fluxx, MIO).
 */

// --- 1. Event Definitions ---

export enum ProtocolEvent {
    // FlowPay Events
    PAYMENT_RECEIVED = "FLOWPAY:PAYMENT_RECEIVED",
    PAYMENT_FAILED = "FLOWPAY:PAYMENT_FAILED",

    // Smart Factory Events
    MINT_REQUESTED = "FACTORY:MINT_REQUESTED",
    MINT_CONFIRMED = "FACTORY:MINT_CONFIRMED", // On-Chain Success
    MINT_FAILED = "FACTORY:MINT_FAILED",       // On-Chain Failure
    CONTRACT_DEPLOYED = "FACTORY:CONTRACT_DEPLOYED",

    // Fluxx Governance Events
    PROPOSAL_CREATED = "FLUXX:PROPOSAL_CREATED",
    VOTE_CAST = "FLUXX:VOTE_CAST",

    // MIO Identity Events
    IDENTITY_VERIFIED = "MIO:IDENTITY_VERIFIED",

    // System Events
    NEXUS_START = "NEXUS:START",
}

// --- 2. Payload Types ---

export interface PaymentPayload {
    orderId: string;
    amount: number;
    currency: "BRL" | "USDC" | "NEOFLW";
    payerId: string; // MIO ID
    metadata: Record<string, any>;
}

export interface MintPayload {
    targetAddress: string;
    tokenId: string;
    amount: string;
    reason: "purchase" | "reward" | "genesis";
    refTransactionId?: string; // Link to FlowPay
}

export interface GovernancePayload {
    proposalId: string;
    voterId: string;
    decision: "for" | "against";
}

// --- 3. The Nexus Class ---

class ProtocolNexus extends EventEmitter {
    private static instance: ProtocolNexus;

    private constructor() {
        super();
        this.setupLogger();
    }

    public static getInstance(): ProtocolNexus {
        if (!ProtocolNexus.instance) {
            ProtocolNexus.instance = new ProtocolNexus();
        }
        return ProtocolNexus.instance;
    }

    private setupLogger() {
        this.on("newListener", (event) => {
            // console.log(`[NEXUS] Listener attached for: ${event}`);
        });
    }

    /**
     * Dispatch an event to the ecosystem.
     * @param event The ProtocolEvent type
     * @param payload Data associated with the event
     */
    public dispatch(event: ProtocolEvent, payload: any) {
        // 1. Safe Mode Check
        try {
            const safeMode = loadSafeMode();
            if (safeMode.blocklist.includes(event)) {
                 console.warn(`[NEXUS] 🛡️ Event Blocked (Blocklist): ${event}`);
                 return;
            }
            if (!safeMode.allowlist.includes("*") && !safeMode.allowlist.includes(event)) {
                 console.warn(`[NEXUS] 🛡️ Event Blocked (Allowlist): ${event}`);
                 return;
            }
        } catch (e) {
            console.error("[NEXUS] Safe Mode Load Error", e);
        }

        // 2. Circuit Breaker (Anti-loop)
        // Ensure payload is an object to attach metadata
        if (typeof payload === 'object' && payload !== null) {
             if (!CircuitBreaker.check(payload, event)) {
                 return; // Blocked by Circuit Breaker
             }
        }

        console.log(`[NEXUS] ⚡ Dispatching ${event}`, JSON.stringify(payload, null, 0));
        this.emit(event, payload);
    }

    /**
     * Register a reactor (handler) for a specific event.
     */
    public onEvent(event: ProtocolEvent | string, handler: (payload: any) => void) {
        this.on(event, handler);
    }
}

// Export Singleton
export const Nexus = ProtocolNexus.getInstance();

// --- 4. The Reactor (Logic Wiring) ---
// This is where we define the "If This Then That" logic of the protocol.

export function setupNexusReactors() {
    console.log("[NEXUS] 🔗 Wiring Protocol Reactors...");

    // 1. Load Dynamic Rules (JSON)
    const rules = loadRules();
    console.log(`[NEXUS] 📜 Loaded ${rules.length} dynamic rules.`);

    rules.forEach(rule => {
        Nexus.onEvent(rule.on, async (payload: any) => {
            await runSafeHandler(rule, payload, async (r, p) => {
                // Dispatch Logic
                if (r.dispatch) {
                    const newPayload = r.transform ? applyTemplate(r.transform, p) : p;
                    Nexus.dispatch(r.dispatch as ProtocolEvent, newPayload);
                }
                
                // Action Logic
                if (r.action) {
                     if (r.action === 'notify_user') {
                         const message = r.params?.message ? applyTemplate({ msg: r.params.message }, p).msg : 'No message';
                         console.log(`[ACTION] 🔔 NOTIFY (via neo-agent-full): ${message}`, p);
                     }
                }
            });
        });
    });

    // 2. Hardcoded Critical Reactors (Fallback / Core Logic)
    
    // REACTOR: Payment -> Mint (Legacy/Core)
    // MOVED TO DYNAMIC RULES (nexus-reactors.json)
    /* 
    Nexus.onEvent(ProtocolEvent.PAYMENT_RECEIVED, (payload: PaymentPayload) => {
        // Legacy handler removed to prevent duplicate minting.
        // Logic is now in config/nexus-reactors.json rule "rule-dynamic-mint"
    });
    */

    // REACTOR: Mint -> Notification
    Nexus.onEvent(ProtocolEvent.MINT_CONFIRMED, (payload: any) => {
        console.log(`[REACTOR] ✅ Mint Confirmed! Triggering neo-agent-full notification...`);
        // Here we would call the WhatsApp/Telegram sender
    });

    Nexus.dispatch(ProtocolEvent.NEXUS_START, { timestamp: Date.now() });
}
