
# -------------------------------------------------------------------------
# NEOBOT / OPENCLAW
# -------------------------------------------------------------------------
# This Makefile orchestrates the development, testing, and deployment
# of the Neobot/OpenClaw stack.
# -------------------------------------------------------------------------

.PHONY: help install dev build test test-docker check-update

# Default goal: show help
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  install      Install all dependencies (pnpm)"
	@echo "  dev          Run the neobot in development mode (cli)"
	@echo "  build        Build the core gateway, cli, and ui"
	@echo "  test         Run all tests"
	@echo "  test-docker  Run containerized tests"
	@echo "  start        Run the production build"
	@echo "  ui-build     Build ONLY the control UI"
	@echo "  docker-build Build the docker image locally (neobot)"
	@echo ""

# Install dependencies
install:
	pnpm install

# Run dev mode (CLI/Gateway)
dev:
	pnpm dev

# Build everything (Core + UI)
build:
	pnpm build
	pnpm ui:build

# Run generic tests
test:
	pnpm test

# Run Docker integration tests
test-docker:
	pnpm test:docker:all

# Start production mode
start:
	pnpm start

# Build only the UI
ui-build:
	pnpm ui:build

# Build Docker image locally
docker-build:
	docker build -t neobot .

# Check for updates (manual trigger)
check-update:
	node --import tsx src/infra/update-check.ts
