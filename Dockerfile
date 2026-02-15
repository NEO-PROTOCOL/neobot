# ── Stage 1: deps ──────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS deps

RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@10.29.3

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./
COPY patches ./patches
COPY scripts ./scripts

RUN pnpm install --no-frozen-lockfile

# ── Stage 2: build ─────────────────────────────────────────────────────────────
FROM deps AS build

COPY . .
RUN pnpm build

# ── Stage 3: runtime ───────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS runtime

WORKDIR /app

# Copy only what's needed to run
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/openclaw.mjs ./openclaw.mjs
COPY --from=build /app/skills ./skills
COPY --from=build /app/extensions ./extensions
COPY --from=build /app/config ./config

ENV NODE_ENV=production
ENV CLAWDBOT_STATE_DIR=/app/data
ENV MOLTBOT_STATE_DIR=/app/data
ENV TMPDIR=/app/tmp

RUN mkdir -p /app/data /app/tmp && \
    chown -R node:node /app/data /app/tmp && \
    chmod 777 /app/tmp

USER node

EXPOSE 18789

CMD ["sh", "-c", "node dist/index.js gateway --bind lan --allow-unconfigured --port ${PORT:-18789}"]
