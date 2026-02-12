FROM node:25-bookworm

# Install Bun (required for build scripts)
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Install pnpm directly (more robust than corepack in some Docker environments)
RUN npm install -g pnpm@latest

WORKDIR /app

ARG CLAWDBOT_DOCKER_APT_PACKAGES=""
RUN if [ -n "$CLAWDBOT_DOCKER_APT_PACKAGES" ]; then \
  apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends $CLAWDBOT_DOCKER_APT_PACKAGES && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*; \
  fi

COPY package.json pnpm-lock.yaml .npmrc ./
COPY patches ./patches
COPY scripts ./scripts

RUN pnpm install --no-frozen-lockfile

COPY . .
RUN pnpm build

ENV NODE_ENV=production
# Force state dirs to a writable location inside the container
ENV CLAWDBOT_STATE_DIR=/app/data
ENV MOLTBOT_STATE_DIR=/app/data
ENV TMPDIR=/app/tmp

# Create writable directories and set permissions for 'node' user
RUN mkdir -p /app/data /app/tmp && \
  chown -R node:node /app/data /app/tmp && \
  chmod 777 /app/tmp

# Security hardening: Run as non-root user
# The node:22-bookworm image includes a 'node' user (uid 1000)
# This reduces the attack surface by preventing container escape via root privileges
USER node

# Expose default port (Railway will override this with its own PORT env)
EXPOSE 18789

# Use a shell to allow expansion of PORT environment variable
CMD ["sh", "-c", "node dist/index.js gateway --bind lan --allow-unconfigured --port ${PORT:-18789}"]
