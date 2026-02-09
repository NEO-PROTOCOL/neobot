import { getChannelPlugin } from "../../channels/plugins/index.js";
import type { ChannelId } from "../../channels/plugins/types.js";
import type { MoltbotConfig } from "../../config/config.js";
import { recordSessionMetaFromInbound, resolveStorePath } from "../../config/sessions.js";
import {
  buildAgentSessionKey,
  type RoutePeer,
  type RoutePeerKind,
} from "../../routing/resolve-route.js";

import { isWhatsAppGroupJid, normalizeWhatsAppTarget } from "../../whatsapp/normalize.js";
import type { ResolvedMessagingTarget } from "./target-resolver.js";

export type OutboundSessionRoute = {
  sessionKey: string;
  baseSessionKey: string;
  peer: RoutePeer;
  chatType: "direct" | "group" | "channel";
  from: string;
  to: string;
  threadId?: string | number;
};

export type ResolveOutboundSessionRouteParams = {
  cfg: MoltbotConfig;
  channel: ChannelId;
  agentId: string;
  accountId?: string | null;
  target: string;
  resolvedTarget?: ResolvedMessagingTarget;
  replyToId?: string | null;
  threadId?: string | number | null;
};

function normalizeThreadId(value?: string | number | null): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return undefined;
    return String(Math.trunc(value));
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function stripProviderPrefix(raw: string, channel: string): string {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  const prefix = `${channel.toLowerCase()}:`;
  if (lower.startsWith(prefix)) return trimmed.slice(prefix.length).trim();
  return trimmed;
}

function stripKindPrefix(raw: string): string {
  return raw.replace(/^(user|channel|group|conversation|room|dm):/i, "").trim();
}

function inferPeerKind(params: {
  channel: ChannelId;
  resolvedTarget?: ResolvedMessagingTarget;
}): RoutePeerKind {
  const resolvedKind = params.resolvedTarget?.kind;
  if (resolvedKind === "user") return "dm";
  if (resolvedKind === "channel") return "channel";
  if (resolvedKind === "group") {
    const plugin = getChannelPlugin(params.channel);
    const chatTypes = plugin?.capabilities?.chatTypes ?? [];
    const supportsChannel = chatTypes.includes("channel");
    const supportsGroup = chatTypes.includes("group");
    if (supportsChannel && !supportsGroup) return "channel";
    return "group";
  }
  return "dm";
}

function buildBaseSessionKey(params: {
  cfg: MoltbotConfig;
  agentId: string;
  channel: ChannelId;
  peer: RoutePeer;
}): string {
  return buildAgentSessionKey({
    agentId: params.agentId,
    channel: params.channel,
    peer: params.peer,
    dmScope: params.cfg.session?.dmScope ?? "main",
    identityLinks: params.cfg.session?.identityLinks,
  });
}



function resolveWhatsAppSession(
  params: ResolveOutboundSessionRouteParams,
): OutboundSessionRoute | null {
  const normalized = normalizeWhatsAppTarget(params.target);
  if (!normalized) return null;
  const isGroup = isWhatsAppGroupJid(normalized);
  const peer: RoutePeer = {
    kind: isGroup ? "group" : "dm",
    id: normalized,
  };
  const baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "whatsapp",
    peer,
  });
  return {
    sessionKey: baseSessionKey,
    baseSessionKey,
    peer,
    chatType: isGroup ? "group" : "direct",
    from: normalized,
    to: normalized,
  };
}

function resolveFallbackSession(
  params: ResolveOutboundSessionRouteParams,
): OutboundSessionRoute | null {
  const trimmed = stripProviderPrefix(params.target, params.channel).trim();
  if (!trimmed) return null;
  const peerKind = inferPeerKind({
    channel: params.channel,
    resolvedTarget: params.resolvedTarget,
  });
  const peerId = stripKindPrefix(trimmed);
  if (!peerId) return null;
  const peer: RoutePeer = { kind: peerKind, id: peerId };
  const baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: params.channel,
    peer,
  });
  const chatType = peerKind === "dm" ? "direct" : peerKind === "channel" ? "channel" : "group";
  const from =
    peerKind === "dm" ? `${params.channel}:${peerId}` : `${params.channel}:${peerKind}:${peerId}`;
  const toPrefix = peerKind === "dm" ? "user" : "channel";
  return {
    sessionKey: baseSessionKey,
    baseSessionKey,
    peer,
    chatType,
    from,
    to: `${toPrefix}:${peerId}`,
  };
}

export async function resolveOutboundSessionRoute(
  params: ResolveOutboundSessionRouteParams,
): Promise<OutboundSessionRoute | null> {
  const target = params.target.trim();
  if (!target) return null;
  switch (params.channel) {

    case "whatsapp":
      return resolveWhatsAppSession({ ...params, target });
    default:
      return resolveFallbackSession({ ...params, target });
  }
}

export async function ensureOutboundSessionEntry(params: {
  cfg: MoltbotConfig;
  agentId: string;
  channel: ChannelId;
  accountId?: string | null;
  route: OutboundSessionRoute;
}) {
  const { agentId, channel, accountId, route } = params;
  await recordSessionMetaFromInbound({
    storePath: resolveStorePath(),
    sessionKey: route.sessionKey,
    ctx: {
      agentId,
      channel: channel as string,
      accountId: accountId ?? undefined,
      peer: route.peer,
      chatType: route.chatType,
      from: route.from,
      to: route.to,
      threadId: route.threadId,
    } as any,
  });
}
