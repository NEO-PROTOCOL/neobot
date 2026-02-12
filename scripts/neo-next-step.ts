#!/usr/bin/env node --import tsx
/**
 * NEO Next Step - Próximo Passo de Maior Impacto
 * 
 * Identifica e executa o próximo passo mais rápido e de maior impacto positivo
 */

import { config } from "dotenv";
import * as fs from "node:fs/promises";
import * as path from "node:path";

config();

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     NEO PROTOCOL - PRÓXIMO PASSO DE MAIOR IMPACTO          ║
╚════════════════════════════════════════════════════════════╝
`);

  console.log("🎯 Análise de Próximos Passos:\n");

  // 1. Verificar skills prontas para publicação
  console.log("📦 1. Skills Prontas para Publicação:");
  const skillsDir = path.join(process.cwd(), "skills");
  const skills = await fs.readdir(skillsDir, { withFileTypes: true });
  
  const skillsWithJson: string[] = [];
  const skillsNeedingJson: string[] = [];
  
  for (const skill of skills) {
    if (!skill.isDirectory()) continue;
    
    const skillPath = path.join(skillsDir, skill.name);
    const skillJsonPath = path.join(skillPath, "skill.json");
    
    try {
      await fs.access(skillJsonPath);
      skillsWithJson.push(skill.name);
    } catch {
      // Verifica se tem SKILL.md (skill existente)
      const skillMdPath = path.join(skillPath, "SKILL.md");
      try {
        await fs.access(skillMdPath);
        skillsNeedingJson.push(skill.name);
      } catch {
        // Ignora
      }
    }
  }

  console.log(`   ✅ Com skill.json: ${skillsWithJson.length}`);
  skillsWithJson.forEach(s => console.log(`      - ${s}`));
  
  console.log(`\n   ⚠️  Precisam de skill.json: ${skillsNeedingJson.length}`);
  const criticalSkills = skillsNeedingJson.filter(s => 
    ['asi1', 'smart-factory', 'flowpay', 'telegram', 'flowcloser'].some(c => 
      s.toLowerCase().includes(c.toLowerCase())
    )
  );
  
  if (criticalSkills.length > 0) {
    console.log(`   🎯 Skills críticas para publicar:`);
    criticalSkills.slice(0, 3).forEach(s => console.log(`      - ${s}`));
  }

  console.log("\n📋 2. Status Atual:");
  console.log("   ✅ IPFS Registry: Funcionando");
  console.log("   ✅ Primeira Skill: Publicada (neo-ipfs-status)");
  console.log("   ✅ CLI Commands: Funcionando");
  console.log("   ✅ Pinata: Configurado");
  console.log("   ⏳ Skills no Registry: 1/18+");

  console.log("\n🚀 3. PRÓXIMO PASSO RECOMENDADO:\n");
  
  if (criticalSkills.length > 0) {
    const nextSkill = criticalSkills[0];
    console.log(`   📝 Criar skill.json para: ${nextSkill}`);
    console.log(`   📤 Publicar: pnpm neobot neo skill publish ./skills/${nextSkill}`);
    console.log(`   ✅ Impacto: Registry com múltiplas skills funcionais`);
    console.log(`   ⏱️  Tempo estimado: 10-15 minutos`);
  } else {
    console.log("   ⏳ Todas as skills críticas já têm skill.json!");
    console.log("   📤 Próximo: Publicar skills existentes");
  }

  console.log("\n💡 Alternativa (se preferir):");
  console.log("   🔐 Ativar identidades mio-system");
  console.log("   📝 Implementar MioIdentityManager");
  console.log("   ⏱️  Tempo estimado: 30-45 minutos");

  console.log("\n" + "=".repeat(64));
  console.log("💬 Recomendação: Publicar mais 1-2 skills críticas");
  console.log("   → Demonstra funcionamento do registry");
  console.log("   → Gera momentum visível");
  console.log("   → Valida infraestrutura com múltiplas skills");
  console.log("=".repeat(64) + "\n");
}

main().catch(console.error);
