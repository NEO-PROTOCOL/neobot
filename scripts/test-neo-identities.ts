#!/usr/bin/env tsx
/**
 * @file test-neo-identities.ts
 * @description Testa as identidades NEO geradas
 */

import { config } from 'dotenv'
import { MioIdentityManager } from '../src/neo/identity/mio-system.js'
import { NEO_IDENTITY_TEMPLATES } from '../src/neo/identity/registry.js'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

async function testIdentities() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         NEO PROTOCOL - TESTAR IDENTIDADES                  ║
╚════════════════════════════════════════════════════════════╝
`)

  // Carregar .env
  config({ path: '.neo-identities/.env' })

  console.log('🔐 Carregando private keys do .env...')
  console.log('')

  let successCount = 0
  let failCount = 0

  for (const template of NEO_IDENTITY_TEMPLATES) {
    const envKey = `NEO_${template.id.replace('mio-', '').toUpperCase()}_PRIVATE_KEY`
    const privateKey = process.env[envKey]

    if (!privateKey || privateKey === 'PLACEHOLDER') {
      console.log(`❌ ${template.id}: Private key não encontrada (${envKey})`)
      failCount++
      continue
    }

    try {
      // 1. Criar manager
      const manager = new MioIdentityManager(privateKey)

      // 2. Carregar identity JSON
      const jsonPath = path.join(process.cwd(), '.neo-identities', `${template.id}.json`)
      const identityJSON = await fs.readFile(jsonPath, 'utf-8')
      const identity = manager.fromJSON(identityJSON)

      // 3. Verificar assinatura
      const isValid = await manager.verifyIdentity(identity)

      if (isValid) {
        console.log(`✅ ${template.id}: Assinatura válida`)
        
        // 4. Testar sign message
        const testMessage = `Test message from ${template.id}`
        const signature = await manager.signMessage(testMessage)
        
        console.log(`   └─ Signature: ${signature.slice(0, 20)}...`)
        
        successCount++
      } else {
        console.log(`❌ ${template.id}: Assinatura inválida`)
        failCount++
      }
    } catch (error: any) {
      console.log(`❌ ${template.id}: Erro - ${error.message}`)
      failCount++
    }

    console.log('')
  }

  // Resumo
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║                       RESULTADO                           ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')
  console.log(`✅ Sucessos: ${successCount}`)
  console.log(`❌ Falhas:   ${failCount}`)
  console.log(`📊 Total:    ${successCount + failCount}`)
  console.log('')

  if (failCount === 0) {
    console.log('🎉 Todas as identidades estão válidas!')
  } else {
    console.log('⚠️  Algumas identidades falharam na verificação.')
    process.exit(1)
  }
}

// Executar
if (import.meta.url === `file://${process.argv[1]}`) {
  testIdentities().catch(console.error)
}

export { testIdentities }
