import { identityLoader } from "./loader.js";
import { logAudit } from "../../infra/flowpay/db.js";

/**
 * SovereignAudit - Wrapper para logs auditáveis assinados criptograficamente
 */
export class SovereignAudit {
    /**
     * Registra um evento de auditoria com assinatura soberana
     */
    public static async log(params: {
        eventType: string;
        actor: string;
        action: string;
        details?: any;
        orderId?: number;
        identityId?: "mio-warrior" | "mio-flowpay" | "mio-core";
    }): Promise<void> {
        const idToUse = params.identityId || "mio-warrior";
        const loadedIdentity = identityLoader.getIdentity(idToUse);

        let signature: string | undefined;
        let mioId: string | undefined;

        if (loadedIdentity) {
            // Criar payload para assinatura
            const payload = {
                type: params.eventType,
                actor: params.actor,
                action: params.action,
                details: params.details,
                orderId: params.orderId,
                timestamp: new Date().toISOString()
            };

            try {
                signature = await loadedIdentity.manager.signMessage(JSON.stringify(payload));
                mioId = loadedIdentity.identity.id;
            } catch (error) {
                console.error(`[SovereignAudit] Failed to sign log with ${idToUse}:`, error);
            }
        }

        // Gravar no banco SQLite local
        logAudit(
            params.eventType,
            params.actor,
            params.action,
            params.details,
            params.orderId,
            signature,
            mioId
        );
    }
}
