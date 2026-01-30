#!/usr/bin/env tsx
/**
 * @file generate-neo-identities.ts
 * @description Gera as 9 identidades oficiais do NEO Protocol
 * 
 * IMPORTANTE:
 * - Este script gera private keys REAIS
 * - NUNCA commite as private keys geradas
 * - Salve em 1Password ou .env (git ignored)
 */

import { 
  MioIdentityManager, 
  generatePrivateKey,
  type NeoIdentity 
} from '../src/neo/identity/mio-system.js'
import { NEO_IDENTITY_TEMPLATES } from '../src/neo/identity/registry.js'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

interface GeneratedIdentity {
  template: typeof NEO_IDENTITY_TEMPLATES[number]
  privateKey: string
  identity: NeoIdentity
}

/**
 * Gera todas as 9 identidades NEO
 */
async function generateAllIdentities(): Promise<GeneratedIdentity[]> {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     NEO PROTOCOL - GERAR IDENTIDADES OFICIAIS              ║
╚════════════════════════════════════════════════════════════╝
`)

  console.log('🔐 Gerando 9 identidades Web3...')
  console.log('')

  const identities: GeneratedIdentity[] = []

  for (const template of NEO_IDENTITY_TEMPLATES) {
    console.log(`📝 Criando: ${template.id} (${template.role})`)

    // 1. Gerar private key
    const privateKey = generatePrivateKey()

    // 2. Criar identity manager
    const manager = new MioIdentityManager(privateKey)

    // 3. Criar identidade completa
    const identity = await manager.createIdentity(
      template.metadata,
      {
        roles: [template.role],
        permissions: {
          channels: [...template.permissions.channels],
          skills: [...template.permissions.skills],
          tools: [...template.permissions.tools]
        }
      }
    )

    // 4. Verificar assinatura
    const isValid = await manager.verifyIdentity(identity)
    
    if (!isValid) {
      throw new Error(`Failed to verify identity: ${template.id}`)
    }

    console.log(`   ✅ ${identity.id} (${identity.publicKey.slice(0, 10)}...)`)
    console.log('')

    identities.push({
      template,
      privateKey,
      identity
    })
  }

  return identities
}

/**
 * Salva identidades em arquivos
 */
async function saveIdentities(identities: GeneratedIdentity[]): Promise<void> {
  const outputDir = path.join(process.cwd(), '.neo-identities')
  
  // Cria diretório
  await fs.mkdir(outputDir, { recursive: true })

  console.log('💾 Salvando identidades...')
  console.log('')

  // 1. Salva cada identidade como JSON
  for (const { identity, template } of identities) {
    const filename = `${template.id}.json`
    const filepath = path.join(outputDir, filename)
    
    await fs.writeFile(
      filepath,
      JSON.stringify(identity, null, 2),
      'utf-8'
    )

    console.log(`   ✅ Salvo: ${filename}`)
  }

  console.log('')

  // 2. Cria arquivo .env.example (SEM private keys reais)
  const envExample = `# NEO Protocol - Identity Private Keys
# 
# IMPORTANTE:
# - Copie este arquivo para .env
# - Substitua os valores PLACEHOLDER pelas private keys reais
# - NUNCA commite o arquivo .env (está no .gitignore)
# - Recomendado: Use 1Password para armazenar as keys

${identities.map(({ template }) => 
  `NEO_${template.id.replace('mio-', '').toUpperCase()}_PRIVATE_KEY=PLACEHOLDER`
).join('\n')}
`

  await fs.writeFile(
    path.join(outputDir, '.env.example'),
    envExample,
    'utf-8'
  )

  console.log('   ✅ Salvo: .env.example')
  console.log('')

  // 3. Cria arquivo .env REAL (com private keys)
  const envReal = `# NEO Protocol - Identity Private Keys
# 
# ⚠️  ATENÇÃO: Este arquivo contém private keys REAIS!
# - NUNCA commite este arquivo
# - Faça backup em 1Password
# - Mantenha seguro

${identities.map(({ template, privateKey }) => 
  `NEO_${template.id.replace('mio-', '').toUpperCase()}_PRIVATE_KEY=${privateKey}`
).join('\n')}
`

  await fs.writeFile(
    path.join(outputDir, '.env'),
    envReal,
    'utf-8'
  )

  console.log('   ✅ Salvo: .env (⚠️  PRIVATE - NÃO COMMITAR)')
  console.log('')

  // 4. Cria arquivo summary
  const summary = `# NEO Protocol - Identities Summary

**Data de Geração:** ${new Date().toISOString()}

## Identidades Criadas

${identities.map(({ identity, template }) => `
### ${template.id} - ${template.role}

- **mio-ID:** \`${identity.id}\`
- **Public Key:** \`${identity.publicKey}\`
- **Roles:** ${identity.roles.join(', ')}
- **Permissions:**
  - Channels: ${identity.permissions.channels.join(', ') || 'none'}
  - Skills: ${identity.permissions.skills.join(', ') || 'none'}
  - Tools: ${identity.permissions.tools.join(', ') || 'none'}
- **Created:** ${identity.createdAt.toISOString()}

**Metadata:**
- Name: ${identity.metadata.name}
- Bio: ${identity.metadata.bio || 'N/A'}

---
`).join('\n')}

## Como Usar

### 1. Carregar Private Keys

\`\`\`typescript
import { config } from 'dotenv'
import { MioIdentityManager } from './neo/identity/mio-system'

// Carregar .env
config({ path: '.neo-identities/.env' })

// Criar manager para cada identidade
const coreManager = new MioIdentityManager(
  process.env.NEO_CORE_PRIVATE_KEY!
)
\`\`\`

### 2. Usar Identidade

\`\`\`typescript
// Assinar mensagem
const signature = await coreManager.signMessage('Hello NEO')

// Verificar identidade
const identity = JSON.parse(
  await fs.readFile('.neo-identities/mio-core.json', 'utf-8')
)

const isValid = await coreManager.verifyIdentity(identity)
\`\`\`

### 3. Backup em 1Password

\`\`\`bash
# Criar item no 1Password
op item create \\
  --category=Login \\
  --title="NEO Protocol Identities" \\
  --vault="Personal" \\
  "Private Keys[password]=$(cat .neo-identities/.env)"

# Recuperar
op item get "NEO Protocol Identities" --fields "Private Keys"
\`\`\`

## ⚠️ Segurança

1. **NUNCA commite** o arquivo \`.env\` com private keys
2. **Faça backup** em 1Password ou similar
3. **Rotacione keys** regularmente (a cada 6 meses)
4. **Use .env** apenas em desenvolvimento
5. **Em produção**, use secrets manager (AWS Secrets, etc)

## Arquivo .gitignore

Certifique-se que \`.neo-identities/.env\` está no \`.gitignore\`:

\`\`\`
.neo-identities/.env
.env
*.pem
*.key
\`\`\`
`

  await fs.writeFile(
    path.join(outputDir, 'IDENTITIES_SUMMARY.md'),
    summary,
    'utf-8'
  )

  console.log('   ✅ Salvo: IDENTITIES_SUMMARY.md')
  console.log('')
}

/**
 * Cria arquivo .gitignore
 */
async function createGitignore(): Promise<void> {
  const outputDir = path.join(process.cwd(), '.neo-identities')
  
  const gitignore = `# NEO Identities - Private files
.env
*.pem
*.key
private/
`

  await fs.writeFile(
    path.join(outputDir, '.gitignore'),
    gitignore,
    'utf-8'
  )

  console.log('   ✅ Criado: .gitignore')
  console.log('')
}

/**
 * Exibe instruções finais
 */
function showInstructions(identities: GeneratedIdentity[]): void {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║                   ✅ IDENTIDADES CRIADAS                  ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')
  console.log(`📦 Total de identidades: ${identities.length}`)
  console.log('')
  console.log('📁 Arquivos salvos em: .neo-identities/')
  console.log('   ├─ mio-*.json          (Identidades públicas)')
  console.log('   ├─ .env                (⚠️  Private keys - NÃO COMMITAR)')
  console.log('   ├─ .env.example        (Template sem keys)')
  console.log('   ├─ .gitignore          (Proteção git)')
  console.log('   └─ IDENTITIES_SUMMARY.md')
  console.log('')
  console.log('🔐 PRÓXIMOS PASSOS:')
  console.log('')
  console.log('1. Fazer backup das private keys em 1Password:')
  console.log('   $ op item create --category=Login \\')
  console.log('       --title="NEO Protocol Keys" \\')
  console.log('       --vault="Personal" \\')
  console.log('       "Keys[password]=$(cat .neo-identities/.env)"')
  console.log('')
  console.log('2. Verificar que .env está no .gitignore:')
  console.log('   $ grep ".neo-identities/.env" .gitignore')
  console.log('')
  console.log('3. Testar identidades:')
  console.log('   $ pnpm tsx scripts/test-neo-identities.ts')
  console.log('')
  console.log('4. (Opcional) Deletar .env local após backup:')
  console.log('   $ rm .neo-identities/.env')
  console.log('')
  console.log('⚠️  IMPORTANTE:')
  console.log('   - NUNCA commite o arquivo .env')
  console.log('   - Faça backup seguro (1Password)')
  console.log('   - Rotacione keys regularmente')
  console.log('')
  console.log('📚 Ver documentação completa:')
  console.log('   $ cat .neo-identities/IDENTITIES_SUMMARY.md')
  console.log('')
}

/**
 * Exibe tabela resumida
 */
function showTable(identities: GeneratedIdentity[]): void {
  console.log('┌──────────────────┬──────────────────────────┬────────────────────────┐')
  console.log('│ mio-ID           │ Public Key               │ Role                   │')
  console.log('├──────────────────┼──────────────────────────┼────────────────────────┤')

  for (const { identity, template } of identities) {
    const id = identity.id.padEnd(16)
    const pubKey = (identity.publicKey.slice(0, 10) + '...').padEnd(24)
    const role = template.role.slice(0, 22).padEnd(22)

    console.log(`│ ${id} │ ${pubKey} │ ${role} │`)
  }

  console.log('└──────────────────┴──────────────────────────┴────────────────────────┘')
  console.log('')
}

/**
 * Main
 */
async function main() {
  try {
    // Gerar identidades
    const identities = await generateAllIdentities()

    // Exibir tabela
    showTable(identities)

    // Salvar arquivos
    await saveIdentities(identities)

    // Criar .gitignore
    await createGitignore()

    // Instruções finais
    showInstructions(identities)

  } catch (error: any) {
    console.error('')
    console.error('❌ Erro ao gerar identidades:', error.message)
    console.error('')
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

// Executar
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { generateAllIdentities, saveIdentities }
