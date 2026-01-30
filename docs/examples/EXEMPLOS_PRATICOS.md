# 🎯 Exemplos Práticos - NeoBot com Claude AI

## 📱 Casos de Uso Reais

### 1. Assistente de Programação

**Cenário:** Você está desenvolvendo e precisa de ajuda com código.

```bash
# Terminal
$ pnpm tsx skills/ai/scripts/chat.ts

Você: Como fazer uma API REST em Node.js com Express?

Claude: Para criar uma API REST com Express, siga estes passos:

1. Instale as dependências:
```bash
npm install express
```

2. Crie o servidor básico:
```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Rotas
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
  const user = req.body;
  res.status(201).json({ user });
});

app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});
```

Você: Adicione validação de dados

Claude: [código com validação usando Joi ou Zod]
```

---

### 2. Gerador de Documentação

**Cenário:** Você tem código e precisa documentar.

```bash
# Telegram
Você: /codigo markdown documentação para esta função:
function calcularIMC(peso, altura) {
  return peso / (altura * altura);
}

Bot:
```markdown
# calcularIMC

Calcula o Índice de Massa Corporal (IMC) de uma pessoa.

## Parâmetros

- `peso` (number): Peso em quilogramas
- `altura` (number): Altura em metros

## Retorno

- (number): O IMC calculado

## Exemplo

```javascript
const imc = calcularIMC(70, 1.75);
console.log(imc); // 22.86
```

## Fórmula

IMC = peso / (altura²)
```
```

---

### 3. Tradutor de Documentação

**Cenário:** Você encontrou uma documentação em inglês.

```bash
# Telegram
Você: /traduzir português
This function validates email addresses using regex pattern matching.
It returns true if the email is valid, false otherwise.

Bot: 🌐 Tradução:

Esta função valida endereços de email usando correspondência de padrões regex.
Ela retorna true se o email for válido, false caso contrário.
```

---

### 4. Resumidor de Artigos

**Cenário:** Você precisa ler um artigo longo rapidamente.

```bash
# Telegram
Você: /resumir
[cola artigo de 5 páginas sobre TypeScript]

Bot: 📝 Resumo:

TypeScript é um superset de JavaScript que adiciona tipagem estática.
Principais benefícios:
- Detecção de erros em tempo de desenvolvimento
- Melhor autocompletar em IDEs
- Código mais documentado e manutenível
- Refatoração mais segura

Ideal para projetos grandes e equipes.
```

---

### 5. Gerador de Testes

**Cenário:** Você precisa criar testes para seu código.

```bash
# CLI
$ pnpm tsx skills/ai/scripts/chat.ts "Gere testes Jest para esta função:
function somar(a, b) {
  return a + b;
}"

Claude:
```javascript
describe('somar', () => {
  test('deve somar dois números positivos', () => {
    expect(somar(2, 3)).toBe(5);
  });
  
  test('deve somar números negativos', () => {
    expect(somar(-2, -3)).toBe(-5);
  });
  
  test('deve somar número positivo com negativo', () => {
    expect(somar(5, -3)).toBe(2);
  });
  
  test('deve somar com zero', () => {
    expect(somar(5, 0)).toBe(5);
  });
  
  test('deve lidar com decimais', () => {
    expect(somar(1.5, 2.3)).toBeCloseTo(3.8);
  });
});
```
```

---

### 6. Conversor de Código

**Cenário:** Você tem código em Python e precisa em JavaScript.

```bash
# Telegram
Você: /codigo javascript converta este código Python:
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

Bot:
```javascript
function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Versão otimizada com memoization:

function fibonacciMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}
```
```

---

### 7. Explicador de Código

**Cenário:** Você encontrou código complexo e não entende.

```bash
# Chat
Você: Explique este código linha por linha:
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

Claude:
Esta é uma função de debounce, usada para limitar a frequência de execução de uma função.

Linha por linha:

1. `const debounce = (fn, delay) => {`
   - Cria uma função que recebe a função a ser "debounced" e o delay

2. `let timeoutId;`
   - Variável para armazenar o ID do timeout

3. `return (...args) => {`
   - Retorna uma nova função que aceita qualquer número de argumentos

4. `clearTimeout(timeoutId);`
   - Cancela o timeout anterior (se existir)

5. `timeoutId = setTimeout(() => fn(...args), delay);`
   - Cria novo timeout que executará a função após o delay

Uso prático:
```javascript
const buscar = debounce((termo) => {
  console.log('Buscando:', termo);
}, 300);

// Só executa após 300ms sem novas chamadas
buscar('a');
buscar('ab');
buscar('abc'); // Só esta será executada
```
```

---

### 8. Gerador de SQL

**Cenário:** Você precisa criar queries SQL complexas.

```bash
# Telegram
Você: /codigo sql crie uma query para buscar usuários ativos
que fizeram compras nos últimos 30 dias, ordenados por valor total

Bot:
```sql
SELECT 
  u.id,
  u.nome,
  u.email,
  COUNT(c.id) as total_compras,
  SUM(c.valor) as valor_total
FROM usuarios u
INNER JOIN compras c ON u.id = c.usuario_id
WHERE 
  u.ativo = true
  AND c.data_compra >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id, u.nome, u.email
ORDER BY valor_total DESC;
```
```

---

### 9. Revisor de Código

**Cenário:** Você quer feedback sobre seu código.

```bash
# Chat
Você: Revise este código e sugira melhorias:
function processarUsuarios(usuarios) {
  var resultado = [];
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].idade > 18) {
      resultado.push(usuarios[i]);
    }
  }
  return resultado;
}

Claude:
Aqui estão as melhorias sugeridas:

```javascript
// Versão melhorada
function processarUsuarios(usuarios) {
  return usuarios.filter(usuario => usuario.idade > 18);
}
```

Mudanças:
1. ✅ Usar `const` ao invés de `var`
2. ✅ Usar `filter()` ao invés de loop manual
3. ✅ Arrow function mais concisa
4. ✅ Código mais legível e funcional

Versão com validação:
```javascript
function processarUsuarios(usuarios) {
  if (!Array.isArray(usuarios)) {
    throw new Error('Parâmetro deve ser um array');
  }
  
  return usuarios.filter(usuario => 
    usuario && 
    typeof usuario.idade === 'number' && 
    usuario.idade > 18
  );
}
```
```

---

### 10. Gerador de Regex

**Cenário:** Você precisa de uma expressão regular.

```bash
# Telegram
Você: /codigo regex validar telefone brasileiro no formato (XX) XXXXX-XXXX

Bot:
```javascript
// Regex para telefone brasileiro
const regexTelefone = /^\(\d{2}\) \d{5}-\d{4}$/;

// Função de validação
function validarTelefone(telefone) {
  return regexTelefone.test(telefone);
}

// Exemplos de uso
console.log(validarTelefone('(11) 98765-4321')); // true
console.log(validarTelefone('11987654321'));     // false

// Versão que aceita múltiplos formatos
const regexTelefoneFlexivel = /^(?:\(\d{2}\)\s?|\d{2}\s?)?\d{4,5}-?\d{4}$/;

// Função para formatar
function formatarTelefone(telefone) {
  const numeros = telefone.replace(/\D/g, '');
  
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
}
```
```

---

## 🎨 Integrações Criativas

### 11. Bot de Estudos

```bash
# Criar flashcards
Você: Crie 5 flashcards sobre TypeScript

Claude:
**Flashcard 1:**
P: O que é TypeScript?
R: Um superset de JavaScript que adiciona tipagem estática

**Flashcard 2:**
P: Qual a diferença entre `interface` e `type`?
R: Interfaces podem ser estendidas e mescladas, types são mais flexíveis

[...]
```

### 12. Gerador de Commits

```bash
# Gerar mensagem de commit
Você: Gere uma mensagem de commit para estas mudanças:
- Adicionei validação de email
- Corrigi bug no login
- Atualizei dependências

Claude:
```
feat: adicionar validação de email e corrigir bug no login

- Implementa validação de formato de email no formulário
- Corrige erro de autenticação no fluxo de login
- Atualiza dependências de segurança (npm audit fix)

BREAKING CHANGE: Emails inválidos agora são rejeitados
```
```

### 13. Gerador de README

```bash
Você: Crie um README.md para meu projeto de API de tarefas

Claude: [README completo com badges, instalação, uso, etc]
```

---

## 🚀 Automações com IA

### 14. Análise Automática de Logs

```typescript
// Criar skill que analisa logs automaticamente
import { ClaudeService } from './skills/ai/claude-service';
import fs from 'fs';

async function analisarLogs() {
  const claude = new ClaudeService();
  const logs = fs.readFileSync('logs/error.log', 'utf-8');
  
  const analise = await claude.chat(
    'system',
    `Analise estes logs de erro e identifique padrões:\n\n${logs}`
  );
  
  console.log('📊 Análise de Logs:');
  console.log(analise);
}
```

### 15. Gerador de Relatórios

```typescript
// Gerar relatório diário automaticamente
async function gerarRelatorio() {
  const claude = new ClaudeService();
  
  const dados = {
    usuarios: 1523,
    vendas: 342,
    receita: 15420.50
  };
  
  const relatorio = await claude.chat(
    'system',
    `Gere um relatório executivo com estes dados: ${JSON.stringify(dados)}`
  );
  
  // Enviar por email ou Telegram
}
```

---

## 💡 Dicas Avançadas

### Contexto Personalizado

```typescript
const claude = new ClaudeService();

// Chat com contexto específico
const resposta = await claude.chat(
  'user123',
  'Como implementar autenticação?',
  'projeto: API REST com Node.js e PostgreSQL'
);
```

### Streaming de Respostas

```typescript
// Para respostas longas, você pode implementar streaming
// (requer modificação do claude-service.ts)
```

### Cache de Respostas

```typescript
// Implementar cache para perguntas frequentes
const cache = new Map();

async function chatComCache(userId, message) {
  if (cache.has(message)) {
    return cache.get(message);
  }
  
  const response = await claude.chat(userId, message);
  cache.set(message, response);
  
  return response;
}
```

---

## 🎯 Próximos Passos

Agora que você viu os exemplos, experimente:

1. ✅ Testar cada caso de uso
2. ✅ Criar seus próprios prompts
3. ✅ Integrar no seu workflow
4. ✅ Automatizar tarefas repetitivas
5. ✅ Compartilhar com a equipe

**Divirta-se! 🚀**
