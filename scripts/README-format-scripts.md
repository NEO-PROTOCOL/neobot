# 📝 Scripts de Formatação de Markdown

Scripts para padronizar a formatação de todos os arquivos Markdown no projeto NeoBot.

## 🎯 Regras Aplicadas

### 1. Linha vazia após cabeçalhos

```markdown
# Título

Texto aqui...
```

### 2. Linha vazia após dois pontos

```markdown
Exemplo:

Conteúdo aqui...
```

### 3. Underline substituído por hífen

```markdown
Antes:
_ Item 1
_ Item 2

Depois:
- Item 1
- Item 2
```

## 🚀 Como Usar

### Versão Bash (Recomendado para Unix/Linux/macOS)

```bash
# Tornar executável
chmod +x scripts/format-markdown.sh

# Executar
./scripts/format-markdown.sh
```

### Versão Node.js (Cross-platform)

```bash
# Instalar dependência (glob)
npm install glob

# Executar
node scripts/format-markdown.js

# Ou com pnpm
pnpm exec node scripts/format-markdown.js
```

## 📂 Arquivos Processados

O script processa todos os arquivos `.md` em:

- Raiz do projeto (`*.md`)
- `docs/**/*.md`
- `dashboard/**/*.md`
- `skills/**/*.md`
- `extensions/**/*.md`
- `src/**/*.md`

**Excluindo:**

- `node_modules/`
- `.git/`
- `dist/`
- `.cursor/`
- `coverage/`

## 🔒 Segurança

### Backups Automáticos

Antes de modificar qualquer arquivo, o script cria um backup:

```
README.md → README.md.backup
```

### Remover Backups

Após verificar que tudo está correto:

```bash
# Unix/Linux/macOS
find . -name "*.md.backup" -delete

# Windows PowerShell
Get-ChildItem -Recurse -Filter "*.md.backup" | Remove-Item
```

### Restaurar a partir de Backup

Se algo der errado:

```bash
# Restaurar um arquivo específico
mv README.md.backup README.md

# Restaurar todos
for file in $(find . -name "*.md.backup"); do
  mv "$file" "${file%.backup}"
done
```

## 📊 Output do Script

### Durante Execução

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📝 NeoBot Markdown Formatter
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ Buscando arquivos .md...

Processando: README.md
✓ Formatado com sucesso

Processando: FEATURES.md
ℹ Nenhuma mudança necessária
```

### Resumo Final

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 Resumo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total de arquivos: 20
  Arquivos modificados: 5
  Arquivos sem mudanças: 15

✓ Formatação concluída!

ℹ Backups criados: *.md.backup
ℹ Para remover backups: find . -name '*.md.backup' -delete
```

## 🔧 Personalização

### Adicionar Novas Regras

Edite o script e adicione suas regras na seção de processamento:

```javascript
// Exemplo: Remover espaços duplos
if (line.includes('  ')) {
  processedLine = line.replace(/  +/g, ' ');
  changes++;
}
```

### Adicionar Novos Padrões

No script Node.js, edite o array `patterns`:

```javascript
const patterns = [
  '*.md',
  'docs/**/*.md',
  'seu-novo-diretorio/**/*.md'  // Adicione aqui
];
```

### Adicionar Exclusões

Edite o array `ignore`:

```javascript
const ignore = [
  '**/node_modules/**',
  '**/sua-pasta-exclusao/**'  // Adicione aqui
];
```

## 🐛 Troubleshooting

### Script não encontra arquivos

```bash
# Verificar se há arquivos .md
find . -name "*.md" | head -20

# Verificar permissões
ls -la scripts/format-markdown.sh
```

### Erro de permissão (Bash)

```bash
chmod +x scripts/format-markdown.sh
```

### Erro "glob not found" (Node.js)

```bash
# Instalar dependência
npm install glob
# ou
pnpm add glob
```

## 📝 Adicionando ao package.json

Adicione scripts de atalho:

```json
{
  "scripts": {
    "format:md": "node scripts/format-markdown.js",
    "format:md:bash": "./scripts/format-markdown.sh"
  }
}
```

Uso:

```bash
pnpm format:md
```

## 🎨 Integração com CI/CD

### GitHub Actions

```yaml
name: Check Markdown Formatting

on: [pull_request]

jobs:
  format-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm install glob
      - run: node scripts/format-markdown.js
      - run: git diff --exit-code
```

## 📚 Referências

- [Markdown Guide](https://www.markdownguide.org/)
- [CommonMark Spec](https://commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

---

**Desenvolvido com ❤️ para NeoBot**  
Version 1.1.0 | 2026-01-28
