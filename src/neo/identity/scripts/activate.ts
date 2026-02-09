#!/usr/bin/env node --import tsx
/**
 * NEO Protocol - Activate mio-system Identities
 * 
 * Loads private keys from .neo-identities/.env and creates active identity instances
 * based on the official registry.
 */

import { config } from "dotenv";
import { createMioIdentityManager } from "../mio-system.js";
import { NEO_IDENTITY_TEMPLATES } from "../registry.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import chalk from "chalk";

// Load project .env
config();

// Load identities .env
const identitiesEnvPath = path.join(process.cwd(), ".neo-identities", ".env");
try {
    const identitiesEnv = await fs.readFile(identitiesEnvPath, "utf-8");
    for (const line of identitiesEnv.split("\n")) {
        if (line.trim() && !line.startsWith("#")) {
            const [key, ...valueParts] = line.split("=");
            if (key && valueParts.length > 0) {
                process.env[key.trim()] = valueParts.join("=").trim();
            }
        }
    }
} catch (error) {
    console.error(chalk.red(`❌ Failed to load .neo-identities/.env: ${String(error)}`));
    process.exit(1);
}

async function main() {
    console.log(chalk.cyan(`
╔════════════════════════════════════════════════════════════╗
║     NEO PROTOCOL - ACTIVATING MIO-SYSTEM IDENTITIES       ║
╚════════════════════════════════════════════════════════════╝
`));

    const activated: Array<{ id: string; name: string; publicKey: string }> = [];
    const failed: Array<{ id: string; error: string }> = [];

    for (const template of NEO_IDENTITY_TEMPLATES) {
        // Map template ID to ENV key naming convention: mio-core -> NEO_CORE_PRIVATE_KEY
        const envKey = `NEO_${template.id.replace("mio-", "").toUpperCase()}_PRIVATE_KEY`;
        const privateKey = process.env[envKey];

        if (!privateKey) {
            failed.push({ id: template.id, error: `Private key ${envKey} not found` });
            continue;
        }

        try {
            const manager = createMioIdentityManager(privateKey);
            const identity = await manager.createIdentity(
                template.metadata,
                {
                    roles: [template.role as string],
                    permissions: {
                        channels: [...template.permissions.channels],
                        skills: [...template.permissions.skills],
                        tools: [...template.permissions.tools]
                    }
                }
            );

            const isValid = await manager.verifyIdentity(identity);

            if (!isValid) {
                failed.push({ id: template.id, error: "Verification failed" });
                continue;
            }

            activated.push({
                id: identity.id,
                name: identity.metadata.name,
                publicKey: identity.publicKey,
            });

            console.log(chalk.green(`✅ ${template.metadata.name}`));
            console.log(chalk.gray(`   mio-ID: ${identity.id}`));
            console.log(chalk.gray(`   Public Key: ${identity.publicKey}`));
            console.log("");
        } catch (error: any) {
            failed.push({ id: template.id, error: error.message });
        }
    }

    console.log("=".repeat(64));
    console.log(chalk.bold(`✅ Activated: ${activated.length}/${NEO_IDENTITY_TEMPLATES.length}`));
    console.log(chalk.bold(`❌ Failed:    ${failed.length}/${NEO_IDENTITY_TEMPLATES.length}`));
    console.log("=".repeat(64));

    if (failed.length > 0) {
        console.log(chalk.yellow("\n⚠️  Failures:"));
        failed.forEach((f) => console.log(chalk.red(`   ${f.id}: ${f.error}`)));
    }

    if (activated.length === NEO_IDENTITY_TEMPLATES.length) {
        console.log(chalk.magenta("\n🎉 All identities activated successfully! Sovereign core is ready. Ø"));
    }
}

main().catch(console.error);
