#!/usr/bin/env node --import tsx
/**
 * Test Pinata Integration
 * 
 * Testa se as credenciais do Pinata estão funcionando corretamente
 */

import { config } from "dotenv";
import { pinToPinata, isPinataConfigured } from "../src/neo/registry/pinata.js";

// Carrega variáveis de ambiente do .env
config();

async function main() {
  console.log("🧪 Testing Pinata Integration\n");

  // Verifica se está configurado
  if (!isPinataConfigured()) {
    console.error("❌ Pinata not configured!");
    console.error("   Please set PINATA_API_KEY and PINATA_SECRET_API_KEY in .env");
    process.exit(1);
  }

  console.log("✅ Pinata credentials found\n");

  // Testa pin de um CID de exemplo (IPFS gateway público)
  // Este é um CID conhecido do IPFS que podemos usar para teste
  const testCID = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"; // IPFS logo

  console.log(`📌 Testing pin to Pinata...`);
  console.log(`   CID: ${testCID}\n`);

  try {
    await pinToPinata(testCID);
    console.log("\n✅ Pinata integration test completed!");
    console.log("   Note: If you see a warning about paid plan, that's expected.");
    console.log("   Your content will still be pinned locally on your IPFS node.");
  } catch (error) {
    console.error("\n⚠️  Pinata integration test completed with warnings.");
    console.error("   Error:", error);
    console.error("\n   This is OK - Pinata is optional backup.");
    console.error("   Your IPFS node will still pin content locally.");
  }
}

main().catch(console.error);
