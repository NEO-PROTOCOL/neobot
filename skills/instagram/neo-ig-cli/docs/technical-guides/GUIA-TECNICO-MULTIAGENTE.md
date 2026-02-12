# 🚀 Guia Técnico: Instagram CLI para Multiagente e Automação

## 📋 Visão Geral do Sistema

Este guia técnico detalha como integrar o **Instagram CLI** em sistemas multiagente e automação. O CLI fornece uma interface programática para operações do Instagram via terminal.

## 🏗️ Arquitetura do Sistema

### Componentes Principais

- **CLI Core**: Interface de linha de comando baseada em Pastel/Ink
- **Instagram Private API**: Cliente HTTP para API do Instagram
- **Session Management**: Gerenciamento de autenticação e tokens
- **Real-time Client**: Conexões MQTT para mensagens em tempo real

### Dependências Críticas

```json
{
  "instagram-private-api": "^1.45.3",
  "pastel": "^4.0.0",
  "ink": "^5.0.0",
  "zod": "^3.21.4"
}
```

## 🔐 Sistema de Autenticação

### Fluxo de Login

```typescript
// 1. Inicialização do cliente
const client = new InstagramClient();

// 2. Login interativo
await client.login(username, password);

// 3. Verificação de sessão
const isLoggedIn = await client.isLoggedIn();
```

### Gerenciamento de Sessões Múltiplas

```typescript
class SessionManager {
  private sessions: Map<string, InstagramClient> = new Map();

  async createSession(username: string): Promise<InstagramClient> {
    const client = new InstagramClient();
    await client.login(username, await this.getPassword(username));
    this.sessions.set(username, client);
    return client;
  }

  async getSession(username: string): Promise<InstagramClient> {
    if (!this.sessions.has(username)) {
      return this.createSession(username);
    }
    return this.sessions.get(username)!;
  }
}
```

## 📡 Operações Disponíveis

### 1. Feed e Timeline

#### Buscar Feed do Usuário

```bash
# Sintaxe CLI
instagram-cli feed [username]

# Exemplo para agente
instagram-cli feed neoflowoff.eth
```

#### Implementação Programática

```typescript
async function getUserFeed(username?: string): Promise<FeedInstance> {
  const client = await sessionManager.getSession(username || 'default');

  try {
    const ig = client.getInstagramClient();
    const timelineFeed = ig.feed.timeline();
    const items = await timelineFeed.items();

    return {
      posts: items.map(normalizePost),
      pagination: timelineFeed.serialize()
    };
  } catch (error) {
    logger.error(`Feed fetch failed: ${error.message}`);
    throw new FeedError('Unable to fetch feed', { cause: error });
  }
}
```

### 2. Sistema de Chat

#### Enviar Mensagem

```bash
# CLI
instagram-cli chat -u destinatario

# Dentro do chat (modo interativo)
:upload /path/to/file.jpg
Mensagem de texto
```

#### API Programática
```typescript
interface MessagePayload {
  text?: string;
  media?: Buffer;
  mediaType?: 'photo' | 'video';
}

async function sendMessage(
  recipientUsername: string,
  payload: MessagePayload,
  senderUsername?: string
): Promise<MessageResult> {
  const client = await sessionManager.getSession(senderUsername || 'default');
  const ig = client.getInstagramClient();

  // 1. Encontrar ou criar thread
  const thread = await findOrCreateThread(ig, recipientUsername);

  // 2. Preparar mídia se necessário
  let mediaId: string | undefined;
  if (payload.media) {
    mediaId = await uploadMedia(ig, payload.media, payload.mediaType);
  }

  // 3. Enviar mensagem
  const result = await thread.broadcastText(payload.text || '', {
    mediaId,
    mediaType: payload.mediaType
  });

  return {
    messageId: result.item_id,
    timestamp: result.timestamp,
    status: 'sent'
  };
}
```

### 3. Stories

#### Visualizar Stories
```bash
instagram-cli stories
```

#### Implementação
```typescript
async function getStories(username?: string): Promise<StoryResult[]> {
  const client = await sessionManager.getSession(username || 'default');
  const ig = client.getInstagramClient();

  const reelsTray = await ig.feed.reelsTray();
  const stories = reelsTray.tray;

  return stories.map(story => ({
    id: story.id,
    user: {
      username: story.user.username,
      fullName: story.user.full_name,
      profilePic: story.user.profile_pic_url
    },
    items: story.items.map(normalizeStoryItem),
    seen: story.seen
  }));
}
```

### 4. Notificações

#### Buscar Notificações
```bash
instagram-cli notify [username]
```

#### API
```typescript
interface NotificationResult {
  newStories: NotificationItem[];
  oldStories: NotificationItem[];
  counts: {
    total: number;
    new: number;
    old: number;
  };
}

async function getNotifications(username?: string): Promise<NotificationResult> {
  const client = await sessionManager.getSession(username || 'default');
  const ig = client.getInstagramClient();

  const newsInbox = await ig.news.inbox();

  return {
    newStories: newsInbox.new_stories?.map(normalizeNotification) || [],
    oldStories: newsInbox.old_stories?.map(normalizeNotification) || [],
    counts: {
      total: (newsInbox.new_stories?.length || 0) + (newsInbox.old_stories?.length || 0),
      new: newsInbox.new_stories?.length || 0,
      old: newsInbox.old_stories?.length || 0
    }
  };
}
```

## 🎯 Operações de Postagem (Posting)

> **⚠️ LIMITAÇÃO:** O CLI atual NÃO suporta postagem. Use API direta.

### Implementação de Postagem (API Direta)
```typescript
interface PostOptions {
  caption?: string;
  location?: {
    name: string;
    lat?: number;
    lng?: number;
  };
  tags?: string[];
}

class PostingService {
  private client: InstagramClient;

  constructor(client: InstagramClient) {
    this.client = client;
  }

  async postPhoto(
    imagePath: string,
    options: PostOptions = {}
  ): Promise<PostResult> {
    const ig = this.client.getInstagramClient();

    // 1. Ler arquivo
    const imageBuffer = await fs.promises.readFile(imagePath);

    // 2. Preparar localização se fornecida
    let locationData;
    if (options.location) {
      locationData = await this.findOrCreateLocation(
        ig,
        options.location.name,
        options.location
      );
    }

    // 3. Postar
    const result = await ig.publish.photo({
      file: imageBuffer,
      caption: this.buildCaption(options.caption, options.tags),
      location: locationData
    });

    return {
      mediaId: result.media.pk,
      code: result.media.code,
      url: `https://instagram.com/p/${result.media.code}`,
      status: 'published'
    };
  }

  async postVideo(
    videoPath: string,
    options: PostOptions = {}
  ): Promise<PostResult> {
    const ig = this.client.getInstagramClient();

    // Para vídeo, precisa de thumbnail
    const videoBuffer = await fs.promises.readFile(videoPath);

    // Gerar thumbnail automaticamente ou usar frame inicial
    const thumbnailBuffer = await this.generateThumbnail(videoBuffer);

    const result = await ig.publish.video({
      video: videoBuffer,
      coverImage: thumbnailBuffer,
      caption: this.buildCaption(options.caption, options.tags)
    });

    return {
      mediaId: result.media.pk,
      code: result.media.code,
      url: `https://instagram.com/p/${result.media.code}`,
      status: 'published'
    };
  }

  private buildCaption(baseCaption?: string, tags?: string[]): string {
    let caption = baseCaption || '';

    if (tags && tags.length > 0) {
      caption += '\n\n' + tags.map(tag => `#${tag}`).join(' ');
    }

    return caption;
  }

  private async generateThumbnail(videoBuffer: Buffer): Promise<Buffer> {
    // Implementar geração de thumbnail
    // Pode usar libraries como fluent-ffmpeg ou sharp
    return videoBuffer; // Placeholder
  }
}
```

## 🤖 Integração com Agentes de IA

### Classe Base para Agente Instagram
```typescript
abstract class InstagramAgent {
  protected sessionManager: SessionManager;
  protected postingService: PostingService;
  protected logger: Logger;

  constructor(config: AgentConfig) {
    this.sessionManager = new SessionManager(config.sessions);
    this.logger = createLogger(config.logging);
  }

  // Método abstrato para lógica específica do agente
  abstract async executeTask(task: AgentTask): Promise<AgentResult>;

  // Métodos utilitários compartilhados
  protected async postContent(
    content: GeneratedContent,
    username?: string
  ): Promise<PostResult> {
    const client = await this.sessionManager.getSession(username);

    if (content.type === 'image') {
      return this.postingService.postPhoto(content.path, {
        caption: content.caption,
        tags: content.tags
      });
    } else if (content.type === 'video') {
      return this.postingService.postVideo(content.path, {
        caption: content.caption,
        tags: content.tags
      });
    }

    throw new Error(`Unsupported content type: ${content.type}`);
  }

  protected async analyzeFeed(
    username?: string,
    criteria?: FeedAnalysisCriteria
  ): Promise<FeedAnalysis> {
    const feed = await getUserFeed(username);

    return {
      postCount: feed.posts.length,
      engagement: this.calculateEngagement(feed.posts),
      trends: this.extractTrends(feed.posts),
      recommendations: this.generateRecommendations(feed.posts, criteria)
    };
  }

  protected async engageWithContent(
    targetUsername: string,
    engagementType: 'like' | 'comment' | 'follow',
    content?: string
  ): Promise<EngagementResult> {
    // Implementar lógica de engajamento
    // NOTA: CLI atual não suporta likes/comments
    // Usar API direta
  }
}
```

### Exemplo de Agente Concreto
```typescript
class ContentCreatorAgent extends InstagramAgent {
  async executeTask(task: ContentCreationTask): Promise<AgentResult> {
    try {
      // 1. Analisar tendências
      const trends = await this.analyzeFeed(task.targetAudience);

      // 2. Gerar conteúdo com IA
      const content = await this.generateContent(trends, task.theme);

      // 3. Postar conteúdo
      const postResult = await this.postContent(content);

      // 4. Interagir com audiência
      await this.engageWithAudience(content, task.engagementStrategy);

      return {
        success: true,
        postId: postResult.mediaId,
        engagement: await this.trackEngagement(postResult.mediaId)
      };

    } catch (error) {
      this.logger.error('Content creation failed', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async generateContent(
    trends: TrendData[],
    theme: string
  ): Promise<GeneratedContent> {
    // Lógica de geração de conteúdo com IA
    // Retornar caminho do arquivo gerado, legenda, etc.
  }
}
```

## 🔧 Utilitários e Helpers

### Rate Limiting
```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  async waitIfNeeded(endpoint: string, limit: number, windowMs: number): Promise<void> {
    const now = Date.now();
    const requests = this.requests.get(endpoint) || [];

    // Remove requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);

    if (validRequests.length >= limit) {
      const oldestRequest = Math.min(...validRequests);
      const waitTime = windowMs - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    validRequests.push(now);
    this.requests.set(endpoint, validRequests);
  }
}
```

### Error Handling
```typescript
class InstagramError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'InstagramError';
  }
}

class ErrorHandler {
  static handle(error: any): never {
    if (error instanceof InstagramError) {
      throw error;
    }

    // Map common errors
    if (error.message?.includes('checkpoint')) {
      throw new InstagramError(
        'Instagram requires verification',
        'CHECKPOINT_REQUIRED',
        false
      );
    }

    if (error.message?.includes('rate limit')) {
      throw new InstagramError(
        'Rate limit exceeded',
        'RATE_LIMIT',
        true
      );
    }

    throw new InstagramError(
      `Unexpected error: ${error.message}`,
      'UNKNOWN_ERROR',
      false
    );
  }
}
```

### Logging Estruturado
```typescript
interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  component: string;
  operation: string;
  userId?: string;
  metadata?: Record<string, any>;
  error?: Error;
}

class StructuredLogger {
  log(entry: Omit<LogEntry, 'timestamp'>): void {
    const fullEntry: LogEntry = {
      timestamp: new Date(),
      ...entry
    };

    // Log to file, console, external service, etc.
    this.writeLog(fullEntry);
  }

  private writeLog(entry: LogEntry): void {
    const formatted = JSON.stringify(entry, (key, value) => {
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack
        };
      }
      return value;
    });

    console.log(formatted);
  }
}
```

## 📊 Monitoramento e Métricas

### Métricas de Performance
```typescript
interface AgentMetrics {
  postsCreated: number;
  engagementRate: number;
  responseTime: number;
  errorRate: number;
  sessionUptime: number;
}

class MetricsCollector {
  private metrics: AgentMetrics = {
    postsCreated: 0,
    engagementRate: 0,
    responseTime: 0,
    errorRate: 0,
    sessionUptime: 0
  };

  recordPostCreated(): void {
    this.metrics.postsCreated++;
  }

  recordEngagement(postId: string, type: 'like' | 'comment' | 'share'): void {
    // Update engagement metrics
  }

  getMetrics(): AgentMetrics {
    return { ...this.metrics };
  }
}
```

## 🚀 Deployment e Escalabilidade

### Configuração para Produção
```typescript
interface ProductionConfig {
  agents: AgentConfig[];
  rateLimits: RateLimitConfig;
  monitoring: MonitoringConfig;
  failover: FailoverConfig;
}

class ProductionManager {
  private agents: InstagramAgent[] = [];
  private healthChecker: HealthChecker;

  async startProduction(config: ProductionConfig): Promise<void> {
    // Initialize agents
    for (const agentConfig of config.agents) {
      const agent = this.createAgent(agentConfig);
      this.agents.push(agent);
    }

    // Start health monitoring
    this.healthChecker = new HealthChecker(this.agents);
    await this.healthChecker.start();

    // Start agents
    await Promise.all(
      this.agents.map(agent => agent.start())
    );
  }

  async stopProduction(): Promise<void> {
    await Promise.all(
      this.agents.map(agent => agent.stop())
    );

    if (this.healthChecker) {
      await this.healthChecker.stop();
    }
  }
}
```

## 🔒 Segurança e Compliance

### Práticas de Segurança
```typescript
class SecurityManager {
  // Rotate sessions periodically
  async rotateSessions(): Promise<void> {
    // Implementation for session rotation
  }

  // Encrypt sensitive data
  encryptData(data: string): string {
    // Implementation for data encryption
  }

  // Rate limiting per IP/account
  async checkRateLimit(identifier: string): Promise<boolean> {
    // Implementation for rate limiting
  }
}
```

### Compliance com Termos de Uso
```typescript
class ComplianceChecker {
  // Check content against Instagram policies
  async validateContent(content: GeneratedContent): Promise<ComplianceResult> {
    // Implementation for content validation
  }

  // Log all actions for audit
  async logAction(action: AuditableAction): Promise<void> {
    // Implementation for audit logging
  }
}
```

## 📚 Referências da API

### Endpoints Principais
- `POST /api/v1/media/configure/` - Configurar mídia
- `POST /api/v1/media/upload/` - Upload de mídia
- `GET /api/v1/feed/timeline/` - Feed timeline
- `POST /api/v1/direct_v2/threads/` - Criar thread de chat

### Headers Necessários
```typescript
const defaultHeaders = {
  'User-Agent': 'Instagram 123.0.0.21.114 (iPhone; iOS 13_0; en_US; en-US; scale=2.00; 750x1334) AppleWebKit/605.1.15',
  'X-Instagram-AJAX': '1',
  'X-CSRFToken': 'missing',
  'X-Requested-With': 'XMLHttpRequest'
};
```

Este guia fornece uma base sólida para implementar agentes de IA que interagem com o Instagram de forma programática e escalável.
