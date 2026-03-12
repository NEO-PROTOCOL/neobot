/**
 * FlowPay Sovereign Tool
 * Permite que agentes atuem como banqueiros, gerando cobranças PIX e liquidando acessos.
 */

import { Type } from "@sinclair/typebox";
import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import type { OpenClawConfig } from "../../config/config.js";
import type { AnyAgentTool } from "./common.js";
import { jsonResult, readStringParam, readNumberParam } from "./common.js";

const FlowPayToolSchema = Type.Object({
  action: Type.Union(
    [Type.Literal("create_charge"), Type.Literal("check_status"), Type.Literal("unlock_access")],
    {
      description:
        "Financial Action: create_charge (collect money), check_status (audit), unlock_access (grant token)",
    },
  ),
  amount: Type.Optional(
    Type.Number({
      description: "Amount in BRL (required for create_charge)",
      minimum: 0.01,
    }),
  ),
  product_id: Type.Optional(
    Type.String({
      description: "Product Ref (e.g., smart-factory-basic, flowoff-start)",
    }),
  ),
  customer_id: Type.Optional(
    Type.String({
      description: "Customer Identity (phone/email/did)",
    }),
  ),
  wallet_address: Type.Optional(
    Type.String({
      description: "Destination EVM Wallet for Settlement (if known)",
    }),
  ),
  charge_id: Type.Optional(
    Type.String({
      description: "Correlation ID for status check or unlock",
    }),
  ),
});

export function createFlowPayTool(_options?: { config?: OpenClawConfig }): AnyAgentTool {
  return {
    label: "FlowPay Sovereign",
    name: "flowpay",
    description:
      "Gateway Financeiro Soberano. Use para cobrar em PIX (BRL), verificar pagamentos liquidar tokens de acesso on-chain. O agente atua como interface bancária.",
    parameters: FlowPayToolSchema,
    execute: async (_toolCallId, args, signal) => {
      if (signal?.aborted) {
        throw new Error("FlowPay operation aborted");
      }

      const params = args as Record<string, unknown>;
      const action = readStringParam(params, "action", { required: true });

      // FlowPay Sovereign Node URL (canonical edge gateway)
      const flowpayUrl =
        process.env.FLOWPAY_API_URL || "https://api.flowpay.cash";

      switch (action) {
        case "create_charge":
          return await handleCreateCharge(params, flowpayUrl);
        case "check_status":
          return await handleCheckStatus(params, flowpayUrl);
        case "unlock_access":
          return jsonResult({
            success: false,
            error: "Manual unlock requires Admin Signature (Implementation Pending)",
          });
        default:
          throw new Error(`Unsupported FlowPay action: ${action}`);
      }
    },
  };
}

async function handleCreateCharge(
  params: Record<string, unknown>,
  flowpayUrl: string,
): Promise<AgentToolResult<unknown>> {
  const amount = readNumberParam(params, "amount", { required: true });
  const productId = readStringParam(params, "product_id") || "flowoff-service";
  const customerId = readStringParam(params, "customer_id") || "whatsapp-customer";
  // Default to zero address acts as "burn" or "treasury" if not specified
  const walletAddress =
    readStringParam(params, "wallet_address") || "0x0000000000000000000000000000000000000000";

  if (!amount || amount < 0.01) {
    return jsonResult({ success: false, error: "Amount must be > R$ 0.01" });
  }

  // Generate unique correlation ID
  const correlationId = `${productId}-${Date.now().toString(36)}`;

  try {
    // Canonical endpoint on api.flowpay.cash (Cloudflare Worker)
    const apiKey = process.env.FLOWPAY_INTERNAL_API_KEY;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    const response = await fetch(`${flowpayUrl}/api/create-charge`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        wallet: walletAddress,
        valor: amount,
        moeda: "BRL",
        id_transacao: correlationId,
        product_id: productId,
        customer_name: customerId,
      }),
    });

    const data = await response.json() as Record<string, unknown>;

    if (!response.ok || !data.success) {
      return jsonResult({
        success: false,
        error: data.error || "Failed to create Charge",
        details: data,
      });
    }

    const pixData = data.pix_data as Record<string, unknown> | undefined;
    const charge = data.charge as Record<string, unknown> | undefined;

    return jsonResult({
      success: true,
      mode: "sovereign",
      message: `PIX cobranca gerada R$ ${amount.toFixed(2)}`,
      charge_id: charge?.correlationID || String(data.correlation_id || correlationId),
      pix_code: pixData?.br_code || charge?.brCode,
      qr_code_url: pixData?.payment_link || charge?.qrCodeImage,
      instructions: [
        `Valor: R$ ${amount.toFixed(2)}`,
        `Ref: ${productId}`,
        `PIX Copia e Cola gerado.`,
        `Aguardando confirmacao para Unlock.`,
      ].join("\n"),
    });
  } catch (error: unknown) {
    return jsonResult({
      success: false,
      error: `FlowPay Link Error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

async function handleCheckStatus(
  params: Record<string, unknown>,
  flowpayUrl: string,
): Promise<AgentToolResult<unknown>> {
  const chargeId = readStringParam(params, "charge_id", { required: true });

  try {
    const response = await fetch(
      `${flowpayUrl}/api/charge-status?charge_id=${encodeURIComponent(chargeId)}`,
    );

    if (!response.ok) {
      return jsonResult({ success: false, error: "Status check failed" });
    }

    const data = await response.json();
    const status = data.status || "unknown";

    return jsonResult({
      success: true,
      charge_id: chargeId,
      status: status,
      paid: ["completed", "paid", "ACTIVE"].includes(status),
      message: status === "completed" ? "✅ PAGO & LIBERADO" : `Status: ${status}`,
    });
  } catch (error: unknown) {
    return jsonResult({ success: false, error: error instanceof Error ? error.message : String(error) });
  }
}
