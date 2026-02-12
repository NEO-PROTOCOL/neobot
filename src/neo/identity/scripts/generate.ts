#!/usr/bin/env tsx
/**
 * NEO Protocol - Generate Official Identities
 * 
 * Generates the official MIO identities (private keys + metadata) 
 * for the protocol based on the central registry.
 */

import {
    MioIdentityManager,
    generatePrivateKey,
    type NeoIdentity
} from '../mio-system.js'
import { NEO_IDENTITY_TEMPLATES } from '../registry.js'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import chalk from 'chalk'

interface GeneratedIdentity {
    template: typeof NEO_IDENTITY_TEMPLATES[number]
    privateKey: string
    identity: NeoIdentity
}

async function generateAllIdentities(): Promise<GeneratedIdentity[]> {
    console.log(chalk.cyan(`
╔════════════════════════════════════════════════════════════╗
║     NEO PROTOCOL - GENERATING OFFICIAL IDENTITIES          ║
╚════════════════════════════════════════════════════════════╝
`))

    console.log(chalk.yellow('🔐 Generating Web3 identities...'))
    console.log('')

    const identities: GeneratedIdentity[] = []

    for (const template of NEO_IDENTITY_TEMPLATES) {
        console.log(chalk.gray(`📝 Creating: ${template.id} (${template.role})`))

        const privateKey = generatePrivateKey()
        const manager = new MioIdentityManager(privateKey)

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
        )

        const isValid = await manager.verifyIdentity(identity)
        if (!isValid) throw new Error(`Failed to verify identity: ${template.id}`)

        console.log(chalk.green(`   ✅ ${identity.id}`))
        identities.push({ template, privateKey, identity })
    }

    return identities
}

async function saveIdentities(identities: GeneratedIdentity[]): Promise<void> {
    const outputDir = path.join(process.cwd(), '.neo-identities')
    await fs.mkdir(outputDir, { recursive: true })

    console.log(chalk.cyan('\n💾 Saving to vault...'))

    // 1. JSON Identities
    for (const { identity, template } of identities) {
        const filename = `${template.id}.json`
        await fs.writeFile(path.join(outputDir, filename), JSON.stringify(identity, null, 2), 'utf-8')
        console.log(chalk.gray(`   ✅ Saved: ${filename}`))
    }

    // 2. Real .env
    const envReal = `# NEO Protocol - Identity Private Keys
# GENERATED AT: ${new Date().toISOString()}

${identities.map(({ template, privateKey }) =>
        `NEO_${template.id.replace('mio-', '').toUpperCase()}_PRIVATE_KEY=${privateKey}`
    ).join('\n')}
`
    await fs.writeFile(path.join(outputDir, '.env'), envReal, 'utf-8')
    console.log(chalk.magenta(`   ✅ Saved: .env (⚠️  SENSITIVE)`))
}

async function main() {
    try {
        const identities = await generateAllIdentities()
        await saveIdentities(identities)
        console.log(chalk.bold.green('\n🎉 NEO Identity Vault initialized. Autonomous established. Ø'));
    } catch (error: any) {
        console.error(chalk.red('\n❌ Error generating identities:'), error.message)
        process.exit(1)
    }
}

main().catch(console.error)
