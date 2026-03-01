import { describe, expect, it, vi } from "vitest";

const { ProxyAgent, undiciFetch, proxyAgentSpy, getLastAgent } = vi.hoisted(() => {
  const hoistedUndiciFetch = vi.fn();
  const hoistedProxyAgentSpy = vi.fn();
  class HoistedProxyAgent {
    static lastCreated: HoistedProxyAgent | undefined;
    proxyUrl: string;
    constructor(proxyUrl: string) {
      this.proxyUrl = proxyUrl;
      HoistedProxyAgent.lastCreated = this;
      hoistedProxyAgentSpy(proxyUrl);
    }
  }

  return {
    ProxyAgent: HoistedProxyAgent,
    undiciFetch: hoistedUndiciFetch,
    proxyAgentSpy: hoistedProxyAgentSpy,
    getLastAgent: () => HoistedProxyAgent.lastCreated,
  };
});

vi.mock("undici", () => ({
  ProxyAgent,
  fetch: undiciFetch,
}));

import { makeProxyFetch } from "./proxy.js";

describe("makeProxyFetch", () => {
  it("uses undici fetch with ProxyAgent dispatcher", async () => {
    const proxyUrl = "http://proxy.test:8080";
    undiciFetch.mockResolvedValue({ ok: true });

    const proxyFetch = makeProxyFetch(proxyUrl);
    await proxyFetch("https://api.telegram.org/bot123/getMe");

    expect(proxyAgentSpy).toHaveBeenCalledWith(proxyUrl);
    expect(undiciFetch).toHaveBeenCalledWith(
      "https://api.telegram.org/bot123/getMe",
      expect.objectContaining({ dispatcher: getLastAgent() }),
    );
  });
});
