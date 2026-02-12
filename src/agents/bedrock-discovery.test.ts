import { describe, it, expect } from "vitest";

describe("bedrock discovery (stubbed)", () => {
  it("returns empty list", async () => {
    const { discoverBedrockModels } = await import("./bedrock-discovery.js");
    const models = await discoverBedrockModels({ region: "us-east-1" });
    expect(models).toEqual([]);
  });
});
