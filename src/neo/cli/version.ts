/**
 * NEO CLI: neo:version command
 */

import { NEO_PROTOCOL_VERSION } from "../sdk/index.js";

export async function neoVersionCommand(): Promise<void> {
  console.log(`NEO Protocol v${NEO_PROTOCOL_VERSION}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  neoVersionCommand().catch(console.error);
}
