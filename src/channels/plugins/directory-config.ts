import type { OpenClawConfig } from "../../config/types.js";
import type { ChannelDirectoryEntry } from "./types.js";
import { resolveWhatsAppAccount } from "../../web/accounts.js";
import { isWhatsAppGroupJid, normalizeWhatsAppTarget } from "../../whatsapp/normalize.js";

export type DirectoryConfigParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  query?: string | null;
  limit?: number | null;
};


export async function listWhatsAppDirectoryPeersFromConfig(
  params: DirectoryConfigParams,
): Promise<ChannelDirectoryEntry[]> {
  const account = resolveWhatsAppAccount({ cfg: params.cfg, accountId: params.accountId });
  const q = params.query?.trim().toLowerCase() || "";
  return (account.allowFrom ?? [])
    .map((entry) => String(entry).trim())
    .filter((entry) => Boolean(entry) && entry !== "*")
    .map((entry) => normalizeWhatsAppTarget(entry) ?? "")
    .filter(Boolean)
    .filter((id) => !isWhatsAppGroupJid(id))
    .filter((id) => (q ? id.toLowerCase().includes(q) : true))
    .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
    .map((id) => ({ kind: "user", id }) as const);
}

export async function listWhatsAppDirectoryGroupsFromConfig(
  params: DirectoryConfigParams,
): Promise<ChannelDirectoryEntry[]> {
  const account = resolveWhatsAppAccount({ cfg: params.cfg, accountId: params.accountId });
  const q = params.query?.trim().toLowerCase() || "";
  return Object.keys(account.groups ?? {})
    .map((id) => id.trim())
    .filter((id) => Boolean(id) && id !== "*")
    .filter((id) => (q ? id.toLowerCase().includes(q) : true))
    .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
    .map((id) => ({ kind: "group", id }) as const);
}
