# NΞØ Identity Layer (mio-system)

Este diretório contém o coração da soberania digital do Protocolo NEØ: o sistema de identidades descentralizadas **mio-system**.

## 🏗️ Estrutura
- `mio-system.ts`: Lógica central de criptografia, geração de chaves e verificação de assinaturas Web3.
- `registry.ts`: Registro oficial das 10 identidades do protocolo (Templates, Permissões e Metadados).
- `NEO_IDENTITIES_GENERATED.md`: Relatório detalhado das identidades geradas e segurança crítica.
- `scripts/`: Scripts operacionais para gestão de identidades.
    - `generate.ts`: Gera o vault completo (`.neo-identities/`).
    - `activate.ts`: Ativa instâncias das identidades via `.env`.
    - `awaken-warrior.ts`: Ritual de inicialização do nó Warrior.

## 🔑 Identidades Oficiais
Atualmente, o protocolo reconhece 10 entidades soberanas:
1. **Core**: Orquestração central.
2. **Gateway**: Roteamento e canais.
3. **Skills**: Registro descentralizado.
4. **Factory**: Smart Contracts & Minting.
5. **FlowPay**: Pagamentos e Tesouraria.
6. **ASI1**: Inteligência Artificial Local.
7. **Telegram**: Interface de Mensageria.
8. **WhatsApp**: Interface de Mensageria.
9. **IPFS**: Persistência de Dados.
10. **Warrior**: Execução Soberana e Proteção.

## ⚠️ Segurança
- As **Private Keys** REAIS residem apenas na pasta raiz `.neo-identities/.env`.
- Esse diretório está permanentemente no `.gitignore`.
- Nunca commite chaves privadas. A soberania depende do seu segredo.

## ⚔️ Comandos
```bash
# Ativar identidades no ambiente local
npx tsx src/neo/identity/scripts/activate.ts

# Gerar novas identidades (Cuidado: Sobrescreve Vault)
npx tsx src/neo/identity/scripts/generate.ts
```

Ø
