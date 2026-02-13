# Instagram CLI

## Overview

Instagram CLI is an unofficial terminal-based client for Instagram, designed to minimize distractions and enable 100% keyboard-driven interactions. The project provides two implementations: a primary TypeScript client (actively developed) and a legacy Python client. The TypeScript version uses Pastel for CLI scaffolding, Ink (React-based TUI), and Instagram Private API + MQTT for real-time messaging capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture (TypeScript Client)

**Framework**: React-based terminal UI using Ink with Pastel for CLI command routing.

- **Commands** (`source/commands/`): Each command exports a Zod schema (`args`, `options`) and a default React component. Full-screen UIs render inside `<AltScreen>` for proper terminal buffer management.
- **Views** (`source/ui/views/`): High-level orchestration components like `ChatView`, `MediaView`, `StoryView`.
- **Components** (`source/ui/components/`): Reusable stateless pieces (message lists, input boxes, media panes).
- **Hooks** (`source/ui/hooks/`): Encapsulate derived state and side effects (`useInstagramClient`, `useStories`, `useScreenSize`).
- **Context** (`source/ui/context/`): `ClientContext` provides authenticated Instagram client instances via React context.

### Backend Architecture

**API Layer** (`source/client.ts`): Hybrid approach combining:

- `instagram-private-api`: Web API for authentication, feeds, stories, and fallback messaging
- `instagram_mqtt`: Real-time MQTT connection for low-latency DM operations

The `InstagramClient` class extends Node.js `EventEmitter` to emit events like `'message'`, `'realtimeStatus'`, and `'error'`. Real-time messaging prioritizes MQTT with automatic Web API fallback.

**Key Utilities**:

- `source/utils/message-parser.ts`: Transforms raw API/MQTT responses into normalized `Message` types
- `source/utils/chat-commands.ts`: Vim-style command system (`:select`, `:react`, `:reply`, `:upload`)
- `source/utils/preprocess.ts`: Handles emoji shortcodes and inline file uploads

### Data Storage

**Configuration** (`source/config.ts`): YAML-based config stored in `~/.instagram-cli/config.yaml`. Uses `ConfigManager` singleton pattern.

**Sessions** (`source/session.ts`): Serialized Instagram API state stored per-user in `~/.instagram-cli/users/<username>/session.json`.

**Directories**:

- `~/.instagram-cli/users/`: Per-user session files
- `~/.instagram-cli/cache/`: Temporary data
- `~/.instagram-cli/media/`: Downloaded media files
- `~/.instagram-cli/logs/`: Session logs with automatic API request capture

### Authentication Flow

Multi-stage login handling:

1. Session-based login (automatic if saved session exists)
2. Username/password authentication
3. Two-factor authentication (TOTP/SMS)
4. Challenge verification (security checkpoints)

### Mock System

Development testing without API calls (`source/mocks/`):

- `MockClient`: Implements `InstagramClient` interface with fake data
- Run with `npm run start:mock -- --chat|--feed|--story`

### Python Client (Legacy)

Located in `instagram-py/`, uses:

- `instagrapi`: Instagram API client
- `curses`: Terminal UI
- `typer`: CLI framework

Maintained but not actively developed. Work on TypeScript client unless specified otherwise.

## External Dependencies

### Instagram APIs

- `instagram-private-api`: Unofficial web API client for authentication, feeds, threads, stories
- `instagram_mqtt`: Real-time messaging via MQTT protocol (GraphQL/Skywalker subscriptions)

### UI Framework

- `ink`: React for CLIs (v6+)
- `pastel`: CLI scaffolding with Zod-based argument parsing
- `ink-picture`: Terminal image rendering (requires `sharp`)
- `ink-gradient`, `ink-big-text`: Decorative text components

### Image Processing

- `sharp`: Native image manipulation for terminal display

### Search

- `fuse.js`: Fuzzy search for threads, users, and emoji lookup

### Configuration

- `js-yaml`: YAML parsing for config files
- `zod`: Schema validation for CLI arguments and options

### Logging

- `debug`: Captures `instagram-private-api` network requests
- Custom file-based logger writes to `~/.instagram-cli/logs/`

### Python Client Dependencies

- `instagrapi`: Python Instagram API
- `typer`: CLI framework
- `rich`: Terminal formatting
- `art`: ASCII art generation
