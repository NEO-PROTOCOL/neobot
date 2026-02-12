# Configuração do Warp Terminal no VS Code

## ⚠️ Problema Identificado

Sua configuração atual do VS Code está usando `zsh` como terminal padrão:
```json
"terminal.integrated.defaultProfile.osx": "zsh"
```

Para usar o Warp, você precisa alterar isso.

---

## ✅ Solução: Configuração Correta

### Opção 1: Usar Warp como Terminal Integrado (Recomendado)

Adicione/altere estas linhas no seu `settings.json`:

```json
{
  "terminal.integrated.defaultProfile.osx": "warp",
  "terminal.integrated.profiles.osx": {
    "warp": {
      "path": "/Applications/Warp.app/Contents/MacOS/stable/warp",
      "args": []
    },
    "zsh": {
      "path": "zsh",
      "args": ["-l"]
    }
  }
}
```

### Opção 2: Manter zsh mas com Warp Externo

Se preferir manter o zsh no VS Code e usar o Warp externamente:

1. Mantenha a configuração atual
2. Use o Warp como aplicação separada
3. Configure atalhos para abrir o Warp rapidamente

---

## 🔧 Como Aplicar a Mudança

### Método Rápido (Via UI)
1. Pressione `Cmd + Shift + P`
2. Digite: "Preferences: Open User Settings (JSON)"
3. Localize a linha: `"terminal.integrated.defaultProfile.osx": "zsh"`
4. Substitua por: `"terminal.integrated.defaultProfile.osx": "warp"`
5. Adicione o bloco `terminal.integrated.profiles.osx` (veja acima)
6. Salve o arquivo
7. **Feche todos os terminais abertos**
8. Abra um novo terminal (`Ctrl + ` ` ou `Cmd + J`)

### Verificação
Execute no novo terminal:
```bash
echo $TERM_PROGRAM
```

Deve retornar: `WarpTerminal`

---

## 🎯 Configuração Completa Recomendada

Aqui está a seção completa de terminal para seu `settings.json`:

```json
{
  // Terminal Configuration
  "terminal.integrated.fontFamily": "JetBrains Mono, Menlo, Monaco",
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.lineHeight": 1.4,
  "terminal.integrated.cursorStyle": "line",
  "terminal.integrated.cursorBlinking": false,
  "terminal.integrated.scrollback": 10000,
  "terminal.integrated.defaultProfile.osx": "warp",
  "terminal.integrated.gpuAcceleration": "on",
  "terminal.integrated.profiles.osx": {
    "warp": {
      "path": "/Applications/Warp.app/Contents/MacOS/stable/warp",
      "args": []
    },
    "zsh": {
      "path": "zsh",
      "args": ["-l"]
    },
    "bash": {
      "path": "bash",
      "args": ["-l"]
    }
  },
  "terminal.integrated.env.osx": {
    "FIG_NEW_SESSION": "1"
  }
}
```

---

## 🚀 Benefícios do Warp

- ✨ **Autocompleção inteligente** - Sugestões contextuais
- 📝 **Histórico avançado** - Busca e reutilização fácil
- 🎨 **Interface moderna** - UI limpa e responsiva
- 🚀 **Workflows salvos** - Comandos frequentes salvos
- 🔍 **Busca em tempo real** - Encontre comandos rapidamente
- 🤖 **AI Assistant** - Ajuda com comandos complexos

---

## 🔄 Alternando Entre Terminais

Depois de configurar, você pode alternar facilmente:

1. Clique no dropdown do terminal (ao lado do `+`)
2. Escolha entre: Warp, zsh, bash
3. Ou use `Cmd + Shift + P` → "Terminal: Select Default Profile"

---

## ⚡ Atalhos Úteis do Warp

- `Cmd + K` - Limpar terminal
- `Cmd + T` - Nova aba
- `Cmd + D` - Split vertical
- `Cmd + Shift + D` - Split horizontal
- `Cmd + Up/Down` - Navegar entre blocos de comando

---

## 🐛 Troubleshooting

### Terminal ainda mostra `vscode`
- Feche **todos** os terminais abertos
- Reinicie o VS Code completamente
- Abra um novo terminal

### Warp não aparece nas opções
- Verifique se o Warp está instalado: `ls /Applications/Warp.app`
- Reinstale se necessário: `brew install --cask warp`

### Preferências não salvam
- Verifique permissões do arquivo `settings.json`
- Tente editar via UI: Settings → Terminal → Default Profile

---

**Última atualização:** 2026-02-05  
**Status:** Warp configurado como padrão no sistema, mas VS Code ainda usando zsh
