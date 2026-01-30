# Padrão Markdown NEO — Guia para IA

Documento de referência para **qualquer agente de IA** que edite ou crie Markdown no contexto NEO. Seguir este padrão garante consistência visual retrô (anos 80/90) e alinhamento com a identidade do protocolo.

---

## Regra geral: largura 64 caracteres

- **Todas as linhas** de conteúdo, bordas e títulos devem respeitar **64 caracteres** de largura (incluindo os caracteres da borda).
- Quebre parágrafos longos em linhas de até 64 caracteres.
- Em caixas: conteúdo entre `│` ou `┃` deve caber na largura interna (62 caracteres entre as bordas).

---

## 1. Avisos e status (relatórios)

Use para cabeçalhos de documento, listas de verificação e itens com status (OK / WARN).

**Cabeçalho de relatório:**

```text
========================================================================
                        TITULO CENTRALIZADO
========================================================================
```

- Linha de `=` com **64 caracteres** (exatamente 64).
- Título centralizado na linha seguinte.
- Nova linha de `=` fechando.

**Itens com status:**

- **Completo:** `[####] Descrição ............................... OK`
- **Parcial / atenção:** `[#---] Descrição ............................... WARN`

Use pontos (`.`) para alinhar a coluna de status à direita. Mantenha a linha em 64 caracteres.

**Exemplo:**

```text
========================================================================
              NEO PROTOCOL STACK - ARQUITETURA HIBRIDA
========================================================================
[####] Versao 1.0.0 .............................................. OK
[#---] Status Design Phase ........................................ WARN
========================================================================
```

---

## 2. Dados estruturados (listas e seções)

Use caixas com bordas simples e seção em destaque com `▓▓▓`.

**Molde:**

```text
┌────────────────────────────────────────────────────────────────┐
│ ▓▓▓ NOME DA SEÇÃO                                              │
├────────────────────────────────────────────────────────────────┤
│ └─ Item principal                                               │
│    └─ Sub-item                                                  │
│    └─ Outro sub-item                                            │
└────────────────────────────────────────────────────────────────┘
```

- **Bordas:** `┌` `─` `┐` `│` `├` `┤` `└` `┘`.
- **Largura:** 64 caracteres por linha (2 para bordas + 62 de conteúdo).
- **Seção:** `▓▓▓` seguido de espaço e do nome da seção.
- **Itens:** `└─` para item; quatro espaços + `└─` para sub-item.
- Preencha com espaços até completar 62 caracteres de conteúdo por linha.

---

## 3. Arquitetura e diagramas de camadas

Use bordas pesadas e “dithering” para destacar blocos de arquitetura.

**Molde:**

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ NOME DA CAMADA                                                 ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ┃
┃ ░ ░  Conteúdo com fundo pontilhado (dithering)           ░ ░ ┃
┃ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

- **Bordas:** `┏` `┓` `┃` `┣` `┫` `┗` `┛` e `━`.
- **Dithering:** linhas com `░` nas bordas esquerda/direita para efeito de fundo.
- **Largura:** 64 caracteres por linha.
- Use para camadas (ex.: NEO Layer, Moltbot Core, Protocol Interface).

---

## 4. Separadores de seção (subtópicos)

Para subseções dentro do documento:

```text
----------------------------------------------------------------------
1. Nome do bloco (opcional)
----------------------------------------------------------------------
```

- Linha de `-` com 64 caracteres.
- Título opcional na linha central.
- Nova linha de `-` fechando.

---

## 5. Listas fora de caixas

- Use **`-`** (dash) como marcador de lista, não `•` nem `+`, para compatibilidade com markdownlint (MD004).
- Deixe uma linha em branco antes e depois da lista quando fizer sentido para leitura (respeitando exceções de lint abaixo).

---

## 6. URLs e referências

- Escreva URLs entre **angle brackets**: `<https://exemplo.com>`.
- Evita que o linter trate como “URL nua” (MD034).

---

## 7. Assinatura padrão dos documentos

Todo documento NEO deve encerrar com esta assinatura. Use-a **exatamente** como abaixo, ao final do corpo do texto.

```text
┌─────────────────────────────────────────────────────────────────┐
│ ▓▓▓ NΞØ MELLØ                                                   │
│     Core Architect · NΞØ Protocol                               │
│     neo@neoprotocol.space                                       │
│                                                                 │
│     "Code is law. Expand until chaos becomes protocol."         │
│                                                                 │
│     Security by design. Exploits find no refuge here.           │
└─────────────────────────────────────────────────────────────────┘
```

- **Onde:** ao final do documento, após licença/referências se houver.
- **Não altere** texto, quebras de linha nem aspas da citação.
- Largura da caixa: 65 caracteres (borda + 63 internos + borda).

---

## 8. Markdownlint em documentos NEO

Documentos que usam **integramente** este padrão (ex.: `ARCHITECTURE_NEO_PROTOCOL.md`) devem incluir no **início do arquivo**:

```html
<!-- markdownlint-disable MD003 MD007 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->
```

Assim, o linter não conflita com:

- Títulos em estilo setext (`====` / `----`).
- Múltiplos blocos que parecem “H1”.
- Listas e indentação dentro de caixas ASCII.
- Nomes de tipos (CID, NeoSkill, etc.) e URLs em `<>`.

---

## 9. Resumo rápido para IA

- **Título relatório:** `====` + título + `====` — largura 64
- **Item OK:** `[####] texto ............... OK` — 64
- **Item WARN:** `[#---] texto ............... WARN` — 64
- **Caixa lista:** `┌─┐│├┤└┘` + `▓▓▓` + `└─` — 64
- **Caixa arquitetura:** `┏┓┃┣┫┗┛` + `━` + `░` — 64
- **Subtítulo:** `------` + título + `------` — 64
- **Listas:** marcador `-` (não `•` nem `+`)
- **URLs:** `<https://...>` (entre angle brackets)
- **Assinatura:** caixa `▓▓▓ NΞØ MELLØ` ao final de todo documento (ver §7)

Ao criar ou editar Markdown NEO: manter **64 caracteres**, usar os símbolos acima, incluir a **assinatura padrão** ao final e, em arquivos “full NEO”, o comentário de disable do markdownlint no topo.
