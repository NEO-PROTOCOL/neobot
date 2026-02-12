#!/usr/bin/env node --import tsx
/**
 * Test Lighthouse IPFS Integration
 */

import { config } from "dotenv";
import {
  pinToLighthouse,
  isLighthouseConfigured,
  getAllGatewayUrls,
} from "../src/neo/registry/lighthouse.js";

config();

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     NEO PROTOCOL - TEST LIGHTHOUSE IPFS                    ║
╚════════════════════════════════════════════════════════════╝
`);

  // Verifica configuração
  if (!isLighthouseConfigured()) {
    console.error("❌ Lighthouse API key not found in .env");
    console.error("   Add: LIGHTHOUSE_API_KEY=your_key");
    process.exit(1);
  }

  console.log("✅ Lighthouse API key found");
  console.log("");

  // Testa com um CID existente do registry
  const testCID = process.env.NEO_INDEX_CID || "QmVvgVngxydhYAAv3F2WpiA4YD5P5rcxCX5Vsv1C2KR2vh";
  
  console.log(`📌 Testing pin by CID: ${testCID}`);
  console.log("");

  const success = await pinToLighthouse(testCID, "neo-skills-index-test.json");

  if (success) {
    console.log("");
    console.log("=".repeat(64));
    console.log("✅ Lighthouse pin successful!");
    console.log("=".repeat(64));
    console.log("");
    console.log("📋 Gateway URLs:");
    const gateways = getAllGatewayUrls(testCID);
    gateways.forEach((gw) => {
      console.log(`   - ${gw.name}: ${gw.url}`);
    });
    console.log("");
    console.log("💡 Lighthouse supports pin by CID on free plan!");
    console.log("   This is better than Pinata for Web3 decentralized storage.");
  } else {
    console.log("");
    console.log("=".repeat(64));
    console.log("❌ Lighthouse pin failed");
    console.log("=".repeat(64));
    console.log("");
    console.log("💡 Check:");
    console.log("   1. API key is valid");
    console.log("   2. CID exists in IPFS network");
    console.log("   3. Network connectivity");
  }
}

main().catch(console.error);
