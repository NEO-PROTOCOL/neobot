import { identityLoader } from "./dist/neo/identity/loader.js";
import { SovereignAudit } from "./dist/neo/identity/audit.js";
import { getDatabase, closeDatabase } from "./dist/infra/flowpay/db.js";
import chalk from "chalk";

async function main() {
    console.log(chalk.bold.cyan("\n⚔️  MIO WARRIOR INTEGRATION TEST ⚔️\n"));

    // 1. Load Identities
    console.log("1. Loading Sovereign Identities...");
    const count = await identityLoader.loadAll();

    if (count === 0) {
        console.log(chalk.red("❌ No identities loaded. Check .neo-identities/.env"));
        // Don't exit, try to continue if we can mock or if env vars are passed differently
    }

    const warrior = identityLoader.getWarrior();
    if (!warrior) {
        console.log(chalk.yellow("⚠️ Warrior identity not found in loader. Checking env vars directly..."));
        // Check if env var exists but loader failed
        if (process.env.NEO_WARRIOR_PRIVATE_KEY) {
            console.log(chalk.green("✅ NEO_WARRIOR_PRIVATE_KEY is present in env."));
        }
    } else {
        console.log(chalk.green(`✅ Warrior ACTIVE: ${warrior.identity.id}`));
        console.log(chalk.dim(`   Address: ${warrior.identity.publicKey}`));
    }

    // 2. Test Signature (Pulse)
    if (warrior) {
        console.log(chalk.cyan("\n2. Testing Cryptographic Pulse Request..."));
        const pulsePayload = `MIO-PULSE:${Date.now()}`;
        try {
            const signature = await warrior.manager.signMessage(pulsePayload);
            console.log(`   Msg: "${pulsePayload}"`);
            console.log(`   Sig: ${chalk.green(signature.slice(0, 50))}...`);

            const valid = await warrior.manager.verifyIdentity(warrior.identity);
            console.log(`   Verification: ${valid ? "PASS" : "FAIL"}`);
        } catch (e) {
            console.log(chalk.red("Signature Error:"), e.message);
        }
    }

    // 3. Test Audit Log Integration
    console.log(chalk.cyan("\n3. Testing Sovereign Audit Log (FlowPay DB)..."));
    try {
        await SovereignAudit.log({
            eventType: "TEST_VERIFICATION",
            actor: "USER_TESTER",
            action: "VERIFY_INTEGRATION",
            details: { result: "success", mode: "manual", timestamp: Date.now() },
            identityId: "mio-warrior"
        });
        console.log(chalk.green("✅ Audit Log function called (DB Write)."));

        // Check DB
        try {
            const db = getDatabase();
            const row = db.prepare("SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 1").get();

            if (row) {
                console.log(chalk.green("\n🔍 Validating Last DB Entry:"));
                console.log(`   ID: ${row.id}`);
                console.log(`   Action: ${row.action}`);
                console.log(`   MIO ID: ${chalk.whiteBright(row.mio_id || "null")}`);
                console.log(`   Signature: ${chalk.yellow(row.signature ? row.signature.slice(0, 40) + "..." : "MISSING")}`);

                if (row.signature && row.mio_id) {
                    console.log(chalk.bold.green("\n🎉 SUCCESS: Proof of Intent (POI) successfully integrated!"));
                } else {
                    console.log(chalk.red("\n❌ FAILURE: Signature missing in DB."));
                }
            } else {
                console.log(chalk.yellow("⚠️ No rows found in audit_log."));
            }
        } catch (dbReadErr) {
            console.log(chalk.yellow("⚠️ Could not read from DB (might be locked or path issue):"), dbReadErr.message);
        }

    } catch (e) {
        console.log(chalk.red("Audit Log Error:"), e.message);
    } finally {
        try { closeDatabase(); } catch { }
    }
}

main().catch(console.error);
