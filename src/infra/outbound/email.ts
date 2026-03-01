/**
 * Email Outbound Service
 * NEØ Protocol - Sovereign Notification Layer
 */

import { loadConfig } from "../../config/config.js";
import type { EmailOptions } from "../../config/types.email.js";

export async function sendEmail(
  opts: EmailOptions,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = loadConfig();
  const emailConfig = config.email;

  if (!emailConfig) {
    return { success: false, error: "Email not configured in openclaw.json" };
  }

  const resendApiKey = process.env.RESEND_API_KEY || emailConfig.resend?.apiKey;

  // Prefer Resend if configured
  if (resendApiKey) {
    return sendViaResend(opts, { ...emailConfig.resend, apiKey: resendApiKey });
  }

  // Fallback to Gmail if configured
  if (emailConfig.gmail?.account) {
    return sendViaGmail(opts, emailConfig.gmail);
  }

  return {
    success: false,
    error: "No active email provider found (check resend.apiKey or gmail.account)",
  };
}

async function sendViaResend(
  opts: EmailOptions,
  config: Record<string, unknown>,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Ordem de resolução do 'from':
    // 1. Forçado no parâmetro 'opts.from'
    // 2. Mapeado via 'skillId' (ex: flowpay:unlock)
    // 3. Mapeado via 'nodeId' (ex: flowpay)
    // 4. Default do Resend config no openclaw.json
    // 5. Hardcoded fallback

    let from = opts.from;

    const configRecord = config as Record<string, Record<string, unknown>>;
    if (!from && opts.skillId && configRecord.skills?.[opts.skillId]) {
      from = configRecord.skills[opts.skillId] as string;
    }

    if (!from && opts.nodeId && configRecord.nodes?.[opts.nodeId]) {
      from = configRecord.nodes[opts.nodeId] as string;
    }

    if (!from) {
      from = (config.from as string | undefined) || "Neobot <notifications@notifications.neoprotocol.space>";
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey as string}`,
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
      }),
    });

    const data = (await response.json()) as Record<string, unknown>;

    if (!response.ok) {
      return { success: false, error: (data.message as string | undefined) || "Resend API error" };
    }

    return { success: true, messageId: data.id as string | undefined };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function sendViaGmail(
  opts: EmailOptions,
  _config: unknown,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Placeholder for Gmail sending via 'gog' or direct API
  // For now, we log it. In production, we'd spawn 'gog gmail send'
  const to = Array.isArray(opts.to) ? opts.to.join(",") : opts.to;
  console.log(`[Email] Gmail fallback: ${opts.subject} to ${to}`);
  return { success: false, error: "Gmail sending not yet implemented (use Resend for MVP)" };
}
