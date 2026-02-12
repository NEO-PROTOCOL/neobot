# WORKFLOW_PROTOCOL

## Propósito

Este documento formaliza o modo operacional de desenvolvimento utilizado por MELLØ.
Não descreve preferências pessoais. Define um protocolo replicável para construção, manutenção e evolução de sistemas vivos, descentralizados e orientados a longo prazo.

O objetivo é permitir continuidade, auditoria e operação por outros nós sem dependência do autor original.

---

## Princípios Fundamentais

1.  Código é consequência, não ponto de partida.
2.  Decisões irreversíveis devem ser externalizadas em texto antes de execução.
3.  Versionamento preserva entendimento, não apenas estado.
4.  Sistemas devem operar corretamente mesmo na ausência do criador.
5.  Clareza futura tem prioridade sobre otimização imediata.

---

## Modos Operacionais (Workflows)

### WF-01 Arquitetura de Sistema

Usado quando:

*  o problema é estrutural ou mal definido
*  o sistema ainda não existe
*  decisões iniciais impactam todo o ciclo de vida

Características:

*  inicia sempre em markdown
*  uso intensivo de diagramas
*  README antes de qualquer código executável
*  definição explícita de escopo e não-escopo
*  ausência deliberada de UI

Artefatos esperados:

*  docs/ARCHITECTURE.md
*  docs/PHILOSOPHY.md
*  README.md
*  diagramas mermaid

Saída válida:

*  arquitetura compreensível por terceiros
*  decisões registradas
*  pontos de extensão claros

---

### WF-02 Execução Direta

Usado quando:

*  a arquitetura já está definida
*  o objetivo é destravar avanço
*  há necessidade de velocidade controlada

Características:

*  foco em código funcional
*  documentação mínima, porém suficiente
*  commits frequentes e sem medo de refatoração
*  testes focados em pontos críticos

Artefatos esperados:

*  código executável
*  scripts utilitários
*  automações

Saída válida:

*  funcionalidade entregue
*  sem violar contratos definidos no WF-01

---

### WF-03 Consolidação e Padronização

Usado quando:

*  algo funcionou e precisa ser reutilizável
*  surgem repetições
*  risco de fragmentação aumenta

Características:

*  reorganização de pastas
*  extração de padrões
*  criação de templates
*  documentação pragmática

Artefatos esperados:

*  templates de repositório
*  padrões de README
*  workflows de CI
*  convenções explícitas

Saída válida:

*  base reutilizável
*  redução de entropia

---

### WF-04 Recuperação e Continuidade

Usado quando:

*  ocorre falha crítica
*  ambiente é corrompido
*  há perda parcial de contexto

Características:

*  prioridade em preservar sentido
*  extração manual de dados
*  registros narrativos humanos
*  decisão consciente sobre reintegração

Artefatos esperados:

*  pasta RECOVERY
*  arquivos .save
*  logs manuais

Saída válida:

*  continuidade cognitiva garantida
*  contexto recuperável

---

## Perfis Operacionais

### Perfil Arquiteto

Responsabilidades:

*  definir estruturas
*  criar contratos
*  estabelecer padrões
*  decidir o que não entra

Permissões:

*  alterações estruturais
*  decisões irreversíveis

---

### Perfil Executor

Responsabilidades:

*  implementar soluções
*  operar dentro dos padrões
*  avançar entregas

Restrições:

*  não redefinir arquitetura

---

### Perfil Auditor

Responsabilidades:

*  revisar decisões passadas
*  validar coerência sistêmica
*  remover excessos
*  documentar falhas

---

### Perfil Nó Externo Simulado

Responsabilidades:

*  testar onboarding
*  identificar fricções
*  validar legibilidade

Atuação:

*  leitura fria
*  execução sem contexto prévio

---

## Tipos de Repositório

### Experimental

*  alta tolerância a mudanças
*  documentação leve
*  foco em aprendizado

### Protocolo

*  documentação obrigatória
*  contratos explícitos
*  baixa tolerância a breaking changes

### Infra Crítica

*  rigor máximo
*  auditoria constante
*  alterações controladas

### Produto de Terceiro

*  clareza sobre limites
*  documentação orientada ao operador

---

## Regras de Transição entre Workflows

*  WF-01 pode transitar para WF-02 somente após contratos explícitos
*  WF-02 deve transitar para WF-03 ao detectar padrões repetidos
*  WF-04 pode ser acionado a partir de qualquer workflow
*  nenhuma transição é automática

---

## Anti-Padrões

*  começar por UI
*  codar sem README
*  decisões implícitas
*  dependência tácita do autor
*  confundir velocidade com pressa

---

## Observação Final

Este protocolo não busca eficiência máxima.
Busca continuidade, clareza e soberania operacional.

Quando corretamente aplicado, o sistema se sustenta, evolui e incorpora novos nós sem exigir presença constante do criador.
