# Dockerfile para neo-ig-cli
# Multi-stage build para otimizar tamanho da imagem

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências de build
RUN apk add --no-cache python3 make g++

# Copiar arquivos de dependências
COPY package.json package-lock.json ./
COPY patches/ ./patches/

# Instalar dependências
RUN npm ci --legacy-peer-deps

# Copiar código fonte
COPY . .

# Aplicar patches
RUN npx patch-package

# Build do projeto
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Instalar dependências de runtime (sharp precisa de libs)
RUN apk add --no-cache \
    vips \
    cairo \
    pango \
    giflib \
    libpng \
    libjpeg-turbo \
    librsvg

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar arquivos necessários
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
COPY --from=builder --chown=nodejs:nodejs /app/package-lock.json ./
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/patches ./patches

# Variáveis de ambiente
ENV NODE_ENV=production
ENV INSTAGRAM_CLI_DATA_DIR=/app/data

# Criar diretórios de dados
RUN mkdir -p /app/data/users /app/data/cache /app/data/media /app/data/logs && \
    chown -R nodejs:nodejs /app/data

# Expor porta (se necessário para API futura)
EXPOSE 3000

# Mudar para usuário não-root
USER nodejs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "process.exit(0)" || exit 1

# Comando padrão
CMD ["node", "dist/cli.js"]

