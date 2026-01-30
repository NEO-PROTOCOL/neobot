/**
 * FlowPay Payment Tool
 * Permite que agentes gerem cobranças PIX durante conversas
 */

import { Type } from "@sinclair/typebox";
import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import type { MoltbotConfig } from "../../config/config.js";
import type { AnyAgentTool } from "./common.js";
import { jsonResult, readStringParam, readNumberParam } from "./common.js";

interface FlowPayChargeResponse {
  success: boolean;
  pix_data?: {
    qr_code: string;
    br_code: string;
    correlation_id: string;
    value: number;
    expires_at: string;
    status: string;
  };
  wallet?: string;
  moeda?: string;
  id_transacao?: string;
  error?: string;
  type?: string;
}

const FlowPayToolSchema = Type.Object({
  action: Type.Union([Type.Literal("create_charge"), Type.Literal("check_status")], {
    description: "Action to perform: create_charge or check_status",
  }),
  amount: Type.Optional(
    Type.Number({
      description: "Amount in BRL (required for create_charge)",
      minimum: 0.01,
    }),
  ),
  product_id: Type.Optional(
    Type.String({
      description: "Product/service reference (e.g., smart-factory-basic, flowoff-start)",
    }),
  ),
  customer_id: Type.Optional(
    Type.String({
      description: "Customer reference (phone, email, or name)",
    }),
  ),
  wallet_address: Type.Optional(
    Type.String({
      description: "Optional Ethereum wallet address for future token",
    }),
  ),
  charge_id: Type.Optional(
    Type.String({
      description: "Charge ID to check status (required for check_status)",
    }),
  ),
});

export function createFlowPayTool(options?: { config?: MoltbotConfig }): AnyAgentTool {
  return {
    label: "FlowPay",
    name: "flowpay",
    description:
      "Generate PIX payments during sales conversations. Use create_charge to generate payment QR code, or check_status to verify if payment was completed.",
    parameters: FlowPayToolSchema,
    execute: async (_toolCallId, args, signal) => {
      if (signal?.aborted) {
        const err = new Error("FlowPay operation aborted");
        err.name = "AbortError";
        throw err;
      }

      const params = args as Record<string, unknown>;
      const action = readStringParam(params, "action", { required: true });

      // Get FlowPay URL from environment or use Railway production
      const flowpayUrl =
        process.env.FLOWPAY_API_URL || "https://flowpay-production-10d8.up.railway.app";

      if (action === "create_charge") {
        return await handleCreateCharge(params, flowpayUrl);
      }

      if (action === "check_status") {
        return await handleCheckStatus(params, flowpayUrl);
      }

      throw new Error(`Unsupported FlowPay action: ${action}`);
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
  const walletAddress =
    readStringParam(params, "wallet_address") || "0x0000000000000000000000000000000000000000";

  if (!amount || amount < 0.01) {
    return jsonResult({
      success: false,
      error: "Amount must be at least R$ 0.01",
    });
  }

  // Generate unique transaction ID
  const transactionId = `${productId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  try {
    const response = await fetch(`${flowpayUrl}/api/create-charge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet: walletAddress,
        valor: amount,
        moeda: "BRL",
        id_transacao: transactionId,
        product_id: productId,
      }),
    });

    const data: FlowPayChargeResponse = await response.json();

    if (!response.ok || !data.success) {
      return jsonResult({
        success: false,
        error: data.error || "Failed to create PIX charge",
        details: data.type || "UNKNOWN_ERROR",
      });
    }

    // Return formatted response for the agent
    return jsonResult({
      success: true,
      message: `PIX charge created successfully for R$ ${amount.toFixed(2)}`,
      charge_id: data.id_transacao,
      pix_code: data.pix_data?.br_code,
      qr_code_url: data.pix_data?.qr_code,
      expires_at: data.pix_data?.expires_at,
      instructions: [
        `Amount: R$ ${amount.toFixed(2)}`,
        `Product: ${productId}`,
        `Customer: ${customerId}`,
        `Transaction ID: ${transactionId}`,
        "",
        "PIX Payment Instructions:",
        "1. Open your banking app",
        "2. Select 'PIX'",
        "3. Choose 'Pay with QR Code' or 'Copy and Paste'",
        "4. Scan the QR code or paste the PIX code",
        "5. Confirm the payment",
        "",
        `Expires at: ${data.pix_data?.expires_at || "24 hours"}`,
      ].join("\n"),
    });
  } catch (error: any) {
    return jsonResult({
      success: false,
      error: `FlowPay API error: ${error.message}`,
      suggestion: "Check if FlowPay Railway service is running and WOOVI_API_KEY is configured",
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
      return jsonResult({
        success: false,
        error: `Failed to check status: ${response.statusText}`,
      });
    }

    const data = await response.json();

    return jsonResult({
      success: true,
      charge_id: chargeId,
      status: data.status || "unknown",
      paid: data.status === "completed" || data.status === "paid",
      message:
        data.status === "completed"
          ? "✅ Payment confirmed!"
          : data.status === "pending"
            ? "⏳ Awaiting payment..."
            : `Status: ${data.status}`,
    });
  } catch (error: any) {
    return jsonResult({
      success: false,
      error: `Failed to check payment status: ${error.message}`,
    });
  }
}
