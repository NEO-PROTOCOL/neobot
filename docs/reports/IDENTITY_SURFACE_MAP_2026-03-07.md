# Identity Surface Map

Data: 2026-03-07
Escopo: `/Users/nettomello/neomello/NEO-PROTOCOL`

## Leitura Executiva

Hoje o stack possui uma camada de identidade real, mas fragmentada em tres formas:

1. `neobot` concentra a implementacao canonica de identidade soberana via `mio-system`.
2. `mio-system` opera como espelho institucional e endpoint HTTP da camada de identidade, mas ainda com runtime simplificado.
3. `neo-protcl` e `neo-protocol-landing` usam identidade em modo grafo off-chain e reputacional, nao como emissao primaria de identidades.

Conclusao direta: `NΞØ ID` ainda nao existe como produto unificado com nome unico, mas a sua infraestrutura-base ja existe e esta distribuida pelo ecossistema.

## Fonte Canonica

### 1. Source of truth operacional

- `neobot-orchestrator/config/ecosystem.json`
- Funcao: define o papel do `mio-system` no ecossistema e aponta `mio-core` como identidade primaria do orquestrador.
- Observacao: o campo `identity.note` ainda fala em `9 identidades`, mas o registro atual possui `10`.

### 2. Source of truth de identidade

- `neobot/src/neo/identity/registry.ts`
- Funcao: registro oficial dos templates de identidade.
- Estado atual: 10 identidades canonicas
  - `mio-core`
  - `mio-gateway`
  - `mio-skills`
  - `mio-factory`
  - `mio-flowpay`
  - `mio-asi1`
  - `mio-whatsapp`
  - `mio-telegram`
  - `mio-ipfs`
  - `mio-warrior`

### 3. Definicao criptografica

- `neobot/src/neo/identity/mio-system.ts`
- Funcao:
  - define `NeoIdentity`
  - gera `mio-id`
  - assina identidade com wallet Ethereum
  - verifica assinatura e integridade do `mio-id`

Isto e o coracao tecnico do que pode virar `NΞØ ID`.

## Mapa Por Repositorio

### `neobot`

Papel: nucleo real da camada de identidade.

Superficie viva:

- `src/neo/identity/mio-system.ts`
  - manager criptografico
  - emissao, serializacao e verificacao
- `src/neo/identity/registry.ts`
  - catalogo oficial de identidades
- `src/neo/identity/loader.ts`
  - carrega identidades a partir de `.neo-identities/.env`
- `src/neo/identity/scripts/generate.ts`
  - gera o vault `.neo-identities/`
- `src/neo/identity/scripts/activate.ts`
  - ativa e valida todas as identidades do registro
- `scripts/test-neo-identities.ts`
  - smoke test de integridade das identidades
- `src/neo/sdk/index.ts`
  - exporta identidade no SDK publico
- `src/neo/cli/help.ts`
  - expone comandos `neo:identity:*`

Superficie de seguranca:

- `.gitignore`
  - protege `.neo-identities/`
- `git-hooks/pre-commit-secrets`
  - bloqueia commit de arquivos sensiveis de identidade

Superficie documental:

- `src/neo/identity/README.md`
- `docs/mio/IDENTITIES_GENERATED.md`
- `docs/core/ARCHITECTURE_NEO_PROTOCOL.md`
- `docs/core/INTEGRATION_ROADMAP.md`
- `docs/PROJECT_IDENTITY_MAP.md`

Leitura: `neobot` ja e o backend semantico de `NΞØ ID`.

### `mio-system`

Papel: repositorio espelho e camada HTTP institucional da identidade.

Superficie viva:

- `src/server.js`
  - expone `/health`
  - expone `/api/v1/ecosystem`
  - expone `/api/v1/identities`
  - recebe `/api/webhook/nexus`

Limitacao atual:

- `/api/v1/identities` ainda devolve placeholder.
- O servidor nao emite, verifica ou carrega `NeoIdentity` de forma equivalente ao `neobot`.

Superficie documental:

- `README.md`
- `identities/SISTEMA_MIO.md`
- `identities/MAPA_MIO.md`
- `identities/QUICK_START.md`

Leitura: `mio-system` ja ocupa o lugar narrativo de autoridade de identidade, mas ainda nao ocupa o lugar tecnico completo.

### `neobot-orchestrator`

Papel: declara identidade no mapa mestre do ecossistema.

Superficie viva:

- `config/ecosystem.json`
  - identidade primaria do orquestrador: `mio-core`
  - referencia `src/neo/identity/`

Leitura: nao implementa identidade, mas ancora a topologia oficial.

### `neo-protcl`

Papel: identidade como grafo off-chain, reputacao e admissao.

Superficie viva:

- `src/context/mcp/identityGraph.js`
  - grafo de identidade off-chain
  - persistencia em `localStorage` com chave `neo_identity_graph`
- `src/context/mcp/index.js`
  - `acknowledgeNodeOffChain()`
  - `registerInteraction()`
  - integra MCP ao Identity Graph
- `src/services/reputationBridge.js`
  - traduz eventos on-chain para edges e nos off-chain
  - eventos centrais:
    - `onReviewValidated()`
    - `onNodeAdmitted()`

Superficie documental:

- `docs/ops/IDENTITY_GRAPH_USAGE.md`
- `docs/ARQUITETURA_CAMADAS_NEØ.md`
- docs legadas relacionadas ao audit do grafo

Leitura: aqui identidade nao e carteira soberana. E contexto, relacao e reputacao.

### `neo-protocol-landing`

Papel: espelho quase direto de `neo-protcl` para a camada de identidade off-chain.

Superficie viva:

- `src/context/mcp/identityGraph.js`
- `src/context/mcp/index.js`
- `src/services/reputationBridge.js`

Leitura: ha duplicacao de superficie identitaria entre `neo-protcl` e `neo-protocol-landing`.

### `neo-nexus`

Papel: hub de eventos com referencias documentais e grafo do ecossistema, nao emissor de identidade.

Superficie viva relacionada:

- `config/ecosystem.json`
  - espelho do source of truth com nota de identidade
- `src/core/graph.ts`
  - grafo do ecossistema, nao o mesmo que `IdentityGraph`
- `data/ecosystem-graph.json`
  - persistencia do grafo de nos do ecossistema

Superficie documental:

- `docs/PROTOCOL_CONTEXT.md`

Leitura: `neo-nexus` transporta relacoes entre nos, mas nao carrega a semantica forte de `NeoIdentity`.

### `neo-agent-full`

Papel: repositorio com presenca identitaria declarativa, nao canonica.

Superficie encontrada:

- `ecosystem.json`
  - inclui espelho de configuracao
- `docs/MANIFESTO.md`
  - menciona `.neo-identities/`

Leitura: participa do ecossistema de identidade, mas nao define o modelo.

## Tipos De Identidade Hoje

A identidade aparece em tres camadas distintas:

### 1. Identidade soberana criptografica

Origem:

- `neobot/src/neo/identity/mio-system.ts`

Elementos:

- `mio-id`
- assinatura Web3
- endereco Ethereum
- roles
- permissions

### 2. Identidade operacional de ecossistema

Origem:

- `*/config/ecosystem.json`
- `*/ecosystem.json`

Elementos:

- `identity.primary`
- papeis por repositorio
- amarracao entre servicos e identidades

### 3. Identidade reputacional e contextual

Origem:

- `neo-protcl/src/context/mcp/identityGraph.js`
- `neo-protocol-landing/src/context/mcp/identityGraph.js`

Elementos:

- nos
- edges
- score implicito
- admissao off-chain
- memoria de interacao

## Fluxo Real Atual

Fluxo soberano:

1. `registry.ts` define os templates oficiais.
2. `generate.ts` cria private keys e JSONs em `.neo-identities/`.
3. `activate.ts` reidrata e valida tudo.
4. `loader.ts` carrega identidades ativas para uso interno.
5. `sdk/index.ts` expone a camada ao resto do protocolo.

Fluxo reputacional:

1. MCP reconhece um no com `acknowledgeNodeOffChain()`.
2. O no entra no `IdentityGraph`.
3. `registerInteraction()` cria relacionamentos.
4. `reputationBridge.js` converte eventos on-chain em edges off-chain.

## Fraturas E Inconsistencias

### 1. Contagem inconsistente de identidades

O ecossistema esta desalinhado:

- `neobot/src/neo/identity/README.md` fala em `10 entidades soberanas`
- `neobot/src/neo/identity/registry.ts` possui `10 templates`
- varios `ecosystem.json` ainda falam em `9 identidades`

Impacto:

- documentacao, auditoria e runtime nao descrevem o mesmo sistema.

### 2. `IdentityLoader` nao cobre todas as identidades do registro

Em `neobot/src/neo/identity/loader.ts`, o `ENV_MAP` nao contem `mio-telegram`.

Consequencia:

- o sistema declara 10 identidades
- o loader atual consegue carregar no maximo 9 via mapa explicito

### 3. `mio-system` promete mais do que executa

O repositorio `mio-system` se posiciona como autoridade de identidade, mas:

- nao replica o manager canonico de `NeoIdentity`
- nao oferece emissao real de identidades no endpoint HTTP
- `GET /api/v1/identities` ainda e placeholder

Consequencia:

- existe marca institucional de `NΞØ ID`
- mas o runtime forte continua preso ao `neobot`

### 4. Duplicacao entre `neo-protcl` e `neo-protocol-landing`

Os dois repositorios carregam:

- `identityGraph.js`
- `reputationBridge.js`
- docs equivalentes

Consequencia:

- maior custo de manutencao
- risco de bifurcacao de comportamento

### 5. Mistura entre identidade de wallet e identidade de no

Hoje convivem dois modelos:

- `NeoIdentity` assinada por wallet
- `IdentityGraph` baseado em `nodeId`, endereco e metadata

Isso ainda nao esta consolidado numa camada unica de resolucao, por exemplo:

- `mio-id -> nodeId -> wallet -> reputacao`

Este e o vazio arquitetural central.

## O Que Ja E `NΞØ ID` Na Pratica

Se o nome de produto fosse consolidado hoje, ele seria composto por:

- emissao soberana de identidade: `neobot/src/neo/identity/*`
- vault e ativacao local: `.neo-identities/`
- topologia oficial: `neobot-orchestrator/config/ecosystem.json`
- reputacao e relacao off-chain: `neo-protcl` e `neo-protocol-landing`
- endpoint institucional: `mio-system/src/server.js`

Em outras palavras:

`NΞØ ID` ja existe como substrato.
Ainda nao existe como sistema unificado com fronteiras claras.

## Prioridade Arquitetural Recomendada

Se a intencao for transformar esse conjunto em uma camada formal de produto, a ordem racional e:

1. Unificar a nomenclatura
   - escolher oficialmente entre `NΞØ ID`, `NEO Identity`, `mio-system` e `Identity Graph`
2. Corrigir a simetria do runtime
   - alinhar `registry`, `loader`, docs e `ecosystem.json`
3. Definir um resolvedor canonico
   - `mio-id -> service role -> nodeId -> wallet -> domain -> reputation`
4. Decidir o centro operacional
   - `neobot` continua como authority
   - ou `mio-system` passa a ser authority real
5. Eliminar duplicacao de frontend
   - manter uma implementacao canonica de `IdentityGraph`

## Referencias Mais Importantes

Arquitetura canonica:

- `neobot/src/neo/identity/mio-system.ts`
- `neobot/src/neo/identity/registry.ts`
- `neobot/src/neo/identity/loader.ts`

Topologia oficial:

- `neobot-orchestrator/config/ecosystem.json`

Camada HTTP institucional:

- `mio-system/src/server.js`

Camada reputacional:

- `neo-protcl/src/context/mcp/identityGraph.js`
- `neo-protcl/src/context/mcp/index.js`
- `neo-protcl/src/services/reputationBridge.js`

Espelho frontend:

- `neo-protocol-landing/src/context/mcp/identityGraph.js`
- `neo-protocol-landing/src/services/reputationBridge.js`

## Contagem De Superficie Encontrada

Arquivos com referencia relevante por repositorio:

- `neobot`: 57
- `mio-system`: 22
- `neo-protcl`: 12
- `neo-protocol-landing`: 12
- `neo-nexus`: 5
- `neo-agent-full`: 3
- `neo-dashboard-deploy`: 2
- `neobot-orchestrator`: 1

Leitura final:

O centro de gravidade de identidade esta em `neobot`.
O centro de narrativa esta em `mio-system`.
O centro de relacao e reputacao esta em `neo-protcl`.

Enquanto esses tres polos nao forem fundidos sob um resolvedor unico, `NΞØ ID` seguira existindo como poder latente, nao como camada soberana fechada.
