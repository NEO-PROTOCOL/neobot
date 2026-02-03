#!/usr/bin/env tsx
/**
 * NEO Protocol - Awaken Node Warrior
 * 
 * Generates the unique MIO-Key for the Node Warrior identity.
 */

import {
    MioIdentityManager,
    generatePrivateKey
} from '../mio-system.js'
import { NEO_IDENTITY_TEMPLATES } from '../registry.js'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import chalk from 'chalk'

async function awakenWarrior() {
    const template = NEO_IDENTITY_TEMPLATES.find(t => t.id === 'mio-warrior');

    if (!template) {
        console.error(chalk.red('❌ Template mio-warrior não encontrado no registro!'));
        process.exit(1);
    }

    console.log(chalk.cyan(`
╔════════════════════════════════════════════════════════════╗
║             NEO PROTOCOL - AWAKENING WARRIOR               ║
╚════════════════════════════════════════════════════════════╝
`));

    const privateKey = generatePrivateKey();
    const manager = new MioIdentityManager(privateKey);

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

    const outputDir = path.join(process.cwd(), '.neo-identities');
    await fs.mkdir(outputDir, { recursive: true });

    const filepath = path.join(outputDir, 'mio-warrior.json');
    await fs.writeFile(filepath, JSON.stringify(identity, null, 2), 'utf-8');

    const envPath = path.join(outputDir, '.env');
    const envLine = `NEO_WARRIOR_PRIVATE_KEY=${privateKey}\n`;

    try {
        await fs.appendFile(envPath, envLine);
    } catch {
        await fs.writeFile(envPath, envLine);
    }

    console.log(chalk.green(`✅ Warrior Awakened!`));
    console.log(chalk.yellow(`   mio-ID: `) + chalk.white(identity.id));
    console.log(chalk.yellow(`   Public Key: `) + chalk.white(identity.publicKey));

    console.log(chalk.magenta(`\n⚔️ O momento está marcado. O Warrior agora possui sua própria chave. Ø`));
}

awakenWarrior().catch(console.error);
