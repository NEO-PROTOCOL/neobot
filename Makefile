
# -----------------------------------------------------------------------------
#  NΞØ PROTOCOL :: ADVANCED MAKEFILE
#  Aggregated command center for Neobot, OpenClaw, and Neo Factory.
# -----------------------------------------------------------------------------

# --- CONFIGURATION -----------------------------------------------------------
APP_NAME := neobot
DOCKER_TAG := neobot:latest
NODE_ENV ?= development
PORT ?= 18789

# Detect OS
UNAME_S := $(shell uname -s)

# Styles
YELLOW := \033[1;33m
GREEN := \033[1;32m
CYAN := \033[1;36m
RED := \033[1;31m
RESET := \033[0m

# --- DEFAULT GOAL ------------------------------------------------------------
.DEFAULT_GOAL := help

.PHONY: help
help:  ## Show this help message
	@echo ""
	@echo "  $(CYAN)NΞØ PROTOCOL$(RESET) :: $(APP_NAME) Management Console"
	@echo ""
	@echo "  $(YELLOW)Usage:$(RESET) make [target]"
	@echo ""
	@echo "  $(GREEN)Lifecycle$(RESET)"
	@echo "    install      Install dependencies (pnpm)"
	@echo "    setup        Full project setup (hooks, env, deps)"
	@echo "    kickoff      Start a development session (System Check)"
	@echo "    wrapup       End a development session (Status Report)"
	@echo "    clean        Remove build artifacts"
	@echo "    deep-clean   Remove node_modules and all artifacts (Use with caution)"
	@echo ""
	@echo "  $(GREEN)Development$(RESET)"
	@echo "    dev          Run the Gateway CLI in dev mode"
	@echo "    dev-ui       Run the Control UI in dev mode"
	@echo "    tui          Run the Terminal UI"
	@echo "    lint         Check code style (oxlint)"
	@echo "    format       Fix code style"
	@echo ""
	@echo "  $(GREEN)Build$(RESET)"
	@echo "    build        Build Core and UI for production"
	@echo "    build-core   Build only the Gateway/Core"
	@echo "    build-ui     Build only the Control UI"
	@echo "    build-mac    Package the macOS Desktop App (Requires Mac)"
	@echo ""
	@echo "  $(GREEN)Testing$(RESET)"
	@echo "    test         Run unit tests"
	@echo "    test-e2e     Run end-to-end tests"
	@echo "    test-docker  Run the full Docker integration suite"
	@echo ""
	@echo "  $(GREEN)Docker Operations$(RESET)"
	@echo "    docker-build Build the production Docker image"
	@echo "    docker-run   Run the container locally (Port $(PORT))"
	@echo "    docker-shell Access shell inside the container"
	@echo ""

# --- LIFECYCLE ---------------------------------------------------------------

install: ## Install dependencies using pnpm
	@echo "$(CYAN)Installing dependencies...$(RESET)"
	@pnpm install

setup: install ## Initialize the environment
	@echo "$(CYAN)Setting up git hooks...$(RESET)"
	@bash scripts/hooks/install.sh
	@echo "$(CYAN)Verifying environment...$(RESET)"
	@test -f .env || cp .env.example .env
	@echo "$(GREEN)Setup complete. Edit .env to configure secrets.$(RESET)"

kickoff: ## Start session
	@node scripts/kickoff.js

wrapup: ## End session
	@node --import tsx scripts/wrapup.ts

clean: ## Remove dist and temp files
	@echo "$(YELLOW)Cleaning build artifacts...$(RESET)"
	@rm -rf dist ui/dist
	@rm -rf .cache

deep-clean: clean ## Remove node_modules and re-install
	@echo "$(RED)Removing node_modules...$(RESET)"
	@rm -rf node_modules ui/node_modules
	@pnpm store prune
	@echo "$(GREEN)Clean complete. Run 'make setup' to restore.$(RESET)"

# --- DEVELOPMENT -------------------------------------------------------------

dev: ## Run Core in dev mode
	@echo "$(GREEN)Starting Neobot Gateway (Dev)...$(RESET)"
	@pnpm dev

dev-ui: ## Run UI in dev mode
	@echo "$(GREEN)Starting Control UI (Dev)...$(RESET)"
	@pnpm ui:dev

tui: ## Run Terminal UI
	@pnpm tui:dev

lint: ## Lint codebase
	@pnpm lint

format: ## Format codebase
	@echo "$(CYAN)Formatting code...$(RESET)"
	@pnpm oxfmt .

# --- BUILD -------------------------------------------------------------------

build: build-core build-ui ## Build everything

build-core: ## Build Gateway/Core
	@echo "$(CYAN)Building Core...$(RESET)"
	@pnpm build

build-ui: ## Build Control UI
	@echo "$(CYAN)Building Control UI...$(RESET)"
	@pnpm ui:build

build-mac: ## Build macOS App
ifeq ($(UNAME_S),Darwin)
	@echo "$(CYAN)Packaging macOS Application...$(RESET)"
	@bash scripts/package-mac-app.sh
else
	@echo "$(RED)Error: macOS build requires Darwin kernel.$(RESET)"
endif

# --- TESTING -----------------------------------------------------------------

test: ## Run unit tests
	@pnpm test:fast

test-e2e: ## Run E2E tests
	@pnpm test:e2e

test-docker: ## Run Docker suite
	@pnpm test:docker:all

# --- DOCKER ------------------------------------------------------------------

docker-build: ## Build Docker Image
	@echo "$(CYAN)Building Docker Image: $(DOCKER_TAG)...$(RESET)"
	@docker build -t $(DOCKER_TAG) .

docker-run: ## Run Container
	@echo "$(GREEN)Running $(DOCKER_TAG) on port $(PORT)...$(RESET)"
	@docker run --rm -it \
		-p $(PORT):$(PORT) \
		--env-file .env \
		$(DOCKER_TAG)

docker-shell: ## Shell into container
	@docker run --rm -it --entrypoint sh $(DOCKER_TAG)

# --- UTILS -------------------------------------------------------------------

sync-upstream: ## Fetch updates from OpenClaw upstream
	@echo "$(CYAN)Syncing with upstream...$(RESET)"
	@git fetch upstream
	@git merge upstream/main
	@pnpm install

updates: ## Check for pnpm package updates
	@pnpm outdated
