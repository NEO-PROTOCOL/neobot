import os from "node:os";

import { logDebug, logWarn } from "../logger.js";
import { getLogger } from "../logging.js";
import { ignoreCiaoCancellationRejection } from "./bonjour-ciao.js";
import { formatBonjourError } from "./bonjour-errors.js";
import { isTruthyEnvValue } from "./env.js";
import { registerUnhandledRejectionHandler } from "./unhandled-rejections.js";

export type GatewayBonjourAdvertiser = {
  stop: () => Promise<void>;
};

export type GatewayBonjourAdvertiseOpts = {
  instanceName?: string;
  gatewayPort: number;
  sshPort?: number;
  gatewayTlsEnabled?: boolean;
  gatewayTlsFingerprintSha256?: string;
  canvasPort?: number;
  tailnetDns?: string;
  cliPath?: string;
  /**
   * Minimal mode - omit sensitive fields (cliPath, sshPort) from TXT records.
   * Reduces information disclosure for better operational security.
   */
  minimal?: boolean;
};

function isDisabledByEnv() {
  if (isTruthyEnvValue(process.env.CLAWDBOT_DISABLE_BONJOUR)) return true;
  if (process.env.NODE_ENV === "test") return true;
  if (process.env.VITEST) return true;
  return false;
}

function safeServiceName(name: string) {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : "Moltbot";
}

function prettifyInstanceName(name: string) {
  const normalized = name.trim().replace(/\s+/g, " ");
  return normalized.replace(/\s+\(Moltbot\)\s*$/i, "").trim() || normalized;
}

type BonjourService = {
  advertise: () => Promise<void>;
  destroy: () => Promise<void>;
  getFQDN: () => string;
  getHostname: () => string;
  getPort: () => number;
  on: (event: string, listener: (...args: unknown[]) => void) => unknown;
  serviceState: string;
};

function serviceSummary(label: string, svc: BonjourService): string {
  let fqdn = "unknown";
  let hostname = "unknown";
  let port = -1;
  try {
    fqdn = svc.getFQDN();
  } catch {
    // ignore
  }
  try {
    hostname = svc.getHostname();
  } catch {
    // ignore
  }
  try {
    port = svc.getPort();
  } catch {
    // ignore
  }
  const state = typeof svc.serviceState === "string" ? svc.serviceState : "unknown";
  return `${label} fqdn=${fqdn} host=${hostname} port=${port} state=${state}`;
}

export async function startGatewayBonjourAdvertiser(
  _opts: GatewayBonjourAdvertiseOpts,
): Promise<GatewayBonjourAdvertiser> {
  // mDNS (Bonjour) is currently disabled/unused in this environment.
  // Returning a no-op controller.
  return {
    stop: async () => { },
  };
}
