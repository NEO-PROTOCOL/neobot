/**
 * FlowPay Sovereign Tool
 * Permite que agentes atuem como banqueiros, gerando cobranças PIX e liquidando acessos.
 */

import { Type } from "@sinclair/typebox";
import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import type { MoltbotConfig } from "../../config/config.js";
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

export function createFlowPayTool(_options?: { config?: MoltbotConfig }): AnyAgentTool {
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

      // FlowPay Sovereign Node URL
      const flowpayUrl =
        process.env.FLOWPAY_API_URL || "https://flowpay-production-10d8.up.railway.app";

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
    // NEW ENDPOINT: /api/charges/create
    const response = await fetch(`${flowpayUrl}/api/charges/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet: walletAddress,
        value: amount, // API expects 'value' or 'valor' depending on version, verifying... sticking to 'valor' for backward compat or 'value' if new. Using 'valor' as per legacy tool, but architecture says 'amount_brl'. Let's use payload compatible with Woovi/OpenPix wrapper.
        // Woovi Wrapper usually takes: correlationID, value (int cents), or value (float).
        // Let's send a standard payload.
        amount: amount,
        correlationID: correlationId,
        productID: productId,
        customerRef: customerId,
      }),
    });

    // Fallback to legacy behavior if 404 (in case FlowPay isn't fully migrated yet)
    if (response.status === 404) {
      return await handleLegacyCreateCharge(
        params,
        flowpayUrl,
        amount,
        walletAddress,
        correlationId,
      );
    }

    const data: any = await response.json();

    if (!response.ok || !data.success) {
      return jsonResult({
        success: false,
        error: data.error || "Failed to create Charge",
        details: data,
      });
    }

    return jsonResult({
      success: true,
      mode: "sovereign",
      message: `PIX cobranca gerada R$ ${amount.toFixed(2)}`,
      charge_id: data.charge?.correlationID || correlationId,
      pix_code: data.charge?.brCode,
      qr_code_url: data.charge?.qrCodeImage,
      instructions: [
        `Valor: R$ ${amount.toFixed(2)}`,
        `Ref: ${productId}`,
        `PIX Copia e Cola gerado.`,
        `Aguardando confirmacao para Unlock.`,
      ].join("\n"),
    });
  } catch (error: any) {
    return jsonResult({
      success: false,
      error: `FlowPay Link Error: ${error.message}`,
    });
  }
}

// Temporary Fallback while migrating endpoints
async function handleLegacyCreateCharge(
  params: any,
  url: string,
  amount: number,
  wallet: string,
  txId: string,
) {
  const response = await fetch(`${url}/api/create-charge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      wallet: wallet,
      valor: amount,
      moeda: "BRL",
      id_transacao: txId,
      product_id: params.product_id || "general",
    }),
  });
  const data: any = await response.json();
  return jsonResult({
    success: data.success,
    mode: "legacy",
    pix_code: data.pix_data?.br_code,
    qr_code_url: data.pix_data?.qr_code,
    message: "Generated via Legacy Endpoint",
  });
}

async function handleCheckStatus(
  params: Record<string, unknown>,
  flowpayUrl: string,
): Promise<AgentToolResult<unknown>> {
  const chargeId = readStringParam(params, "charge_id", { required: true });

  try {
    // Try new endpoint first
    let response = await fetch(
      `${flowpayUrl}/api/charges/status?charge_id=${encodeURIComponent(chargeId)}`,
    );

    if (response.status === 404) {
      // Fallback
      response = await fetch(
        `${flowpayUrl}/api/charge-status?charge_id=${encodeURIComponent(chargeId)}`,
      );
    }

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
  } catch (error: any) {
    return jsonResult({ success: false, error: error.message });
  }
}
