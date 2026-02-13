# Instagram CLI

The ultimate weapon against brainrot. The fastest, lightest, and most portable Instagram client.

$$
\text{Instagram}_{\text{CLI}} = \lim_{\text{screen time} \to 0} \text{Productivity} \to \infty
$$

[![npm](https://img.shields.io/npm/v/@i7m/instagram-cli?style=flat-square)](https://www.npmjs.com/package/@i7m/instagram-cli)
[![downloads](https://img.shields.io/npm/dm/@i7m/instagram-cli?style=flat-square)](https://www.npmjs.com/package/@i7m/instagram-cli)
![PyPI](https://img.shields.io/pypi/v/instagram-cli)
[![PyPI Downloads](https://static.pepy.tech/badge/instagram-cli)](https://pepy.tech/projects/instagram-cli)
![Python](https://img.shields.io/pypi/pyversions/instagram-cli)

> [!WARNING]
> This project is not affiliated with, authorized, or endorsed by Instagram. This is an independent and unofficial project. Using it might violate Meta's Terms of Service. Use at your own risk.

## What does it do?

Empower yourself to become a 10x Instagrammer by minimizing distractions, enabling 100% keyboard control, and accessing it from any terminal — whether in your VSCode editor or your Linux server.

- Chat with your friends without falling into endless brainrot
- Stay updated & connected without being exploited for your attention
- Focus on meaningful conversations and be productive
- Full keyboard navigation and shortcuts, no mouse, no touchscreens
- Celebrate the art and simplicity of **terminal UI (TUI)**

## Quick Start

Follow these simple steps to get started:

1. **Install dependencies** (if working with local development):

   ```bash
   npm ci && npm run build
   ```

2. **Login to your Instagram account**:

   ```bash
   # Login with your Instagram credentials
   instagram-cli auth login
   ```

3. **Test basic commands**:

   ```bash
   # View your feed
   instagram-cli feed

   # Start chatting (replace 'username' with a friend's username)
   instagram-cli chat username

   # View stories
   instagram-cli stories
   ```

4. **Check who you're logged in as**:

   ```bash
   instagram-cli auth whoami
   ```

That's it! You're ready to use Instagram CLI. For more advanced features, see the [Commands](#commands) section below.

## TypeScript Client

We recommend using the TypeScript client whenever possible. It is more secure, performant, feature-rich, actively developed, and works on all platforms including Windows.

### Homebrew (macOS/Linux)

```bash
brew tap supreme-gg-gg/tap
brew install instagram-cli
```

### NPM

```bash
npm install -g @i7m/instagram-cli
```

For other installation methods, please refer to the [TypeScript Client Documentation](./DEVELOPMENT.md).

### Key Features

- Full support for Windows, Linux, and macOS, modern React-based UI
- Developer-friendly shortcuts, viewing feed and stories, in-terminal image rendering
- Leverages realtime MQTT-based protocol used by Instagram app for messaging
- Highly performant and much faster than your GUI browser or touchscreen app
- Works well in all terminal emulators, **including VSCode Integrated Terminal**

## Python Client

> The Python client is the original implementation of `instagram-cli`.

```bash
pip install instagram-cli
```

Note that Python links to the `instagram` command, while TypeScript links to `instagram-cli`.

> [!CAUTION]
> We do not recommend using the TypeScript and Python client simultaneously with the same account to reduce the risk of account bans. We recommend using the TypeScript client when possible since it is much less likely to trigger Instagram's anti-bot mechanisms.

### Python Client Features

- Classic `curses`-based terminal UI, works well on Linux and macOS, nostalgic UNIX vibes...
- Extends Instagram with powerful plugins like LaTeX rendering, chat summarisation (e.g. Ollama)

For more information about the Python client, please refer to the [Python Client Documentation](./instagram-py/README.md). **The following documentation is for the Typescript client only.**

## Commands

The following commands will be available after installing the package:

```bash
instagram-cli                                  # display title art
instagram-cli --help                           # view available commands

# Authentication
instagram-cli auth login --username            # login with username and password
instagram-cli auth logout                      # logout and removes session
instagram-cli auth switch <username>           # switch to another saved account
instagram-cli auth whoami                      # display current default user

# Core features
instagram-cli chat -u <username> -t <title>    # start chat interface
instagram-cli feed                             # view posts from people you follow
instagram-cli stories                          # view stories from people you follow (BETA)
instagram-cli notify                           # view notifications (inbox, followers, mentions)

# Modify configuration
instagram-cli config                           # lists all config
instagram-cli config <key> <value>             # set config key to value
instagram-cli config edit                      # open config file in editor
```

> [!TIP]
> You can easily manage multiple accounts with Instagram CLI!
> Your login for each account will be saved **locally** and you can switch between them using the `instagram-cli auth switch <username>` command or run a certain command with a specific account using the `--username` flag.

## Chat Commands

Inside the chat interface and after selecting a thread, you can navigate all interface with 100% keyboard support. When messaging, the following commands are available:

```bash
# Select messages to perform actions
:select
:react <emoji | :emoji_name:>
:reply <text>
:unsend

# Media Handling
:upload <path-to-image-or-video>
# Download command coming soon...

# Navigation
:k # go up
:K # go to top
:j # go down
:J # go to bottom
```

> [!TIP]
> You can quickly include text files or images in a message by using `#` followed by the file path. For example, `#path/to/file.txt` or `#path/to/image.png`.
> Use `tab` and `enter` to autocomplete file paths. You can include emojis in messages with `:emoji_name:` e.g. `:thumbsup:` = 👍 (with fuzzy matching).

### Configuration

You can view and modify configuration with `instagram-cli config`. The configuration file is located at `~/.instagram-cli/config.ts.yaml`. The following are common configuration options:

| Key            | Type   | Default     | Description                                                                                                 |
| -------------- | ------ | ----------- | ----------------------------------------------------------------------------------------------------------- |
| image.protocol | string | "halfBlock" | Protocol for rendering images. Options: "ascii", "halfBlock", "braille", "kitty", "iterm2", "sixel", or "". |
| feed.feedType  | string | "list"      | Layout of feed display. Options: "timeline", "list", "".                                                    |

> [!NOTE]
> We automatically select the best image protocol based on your terminal. If you experience issues with image rendering, try changing the `image.protocol` setting. Make sure this is supported by your terminal (e.g. `sixel` and `iterm2` protocols won't work in Kitty).

## Contributing

We welcome contributors! Please see the comprehensive [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to get started, create issues, and submit pull requests. It is very important that you follow these instructions because we manage two different clients in the same repository. _Instagram CLI is NOT meant to be used for bot-behaviours, we will not accept contributions that add such features._

## Reporting Issues

Occasionally, Instagram may update their API or protocols which can cause certain features to break. If you encounter any issues, please check the relevant log files located at `~/.instagram-cli/logs/` to help diagnose and fix the problem quickly.

## Security

This project uses dependencies that may have known security vulnerabilities. For detailed information about the current security status, known vulnerabilities, and why some cannot be fixed, please see [docs/security-vulnerabilities.md](./docs/security-vulnerabilities.md).

**Quick summary:**

- Some critical vulnerabilities exist in deprecated dependencies (`request` → `instagram-private-api`)
- These cannot be fixed until upstream dependencies are updated
- The CLI is designed for local use, which mitigates most security risks
- We actively monitor and update dependencies when fixes become available

## Deployment

This project can be deployed using Docker or Railway. For detailed deployment instructions and comparison, see:

- **[Deployment Guide](./docs/deployment-guide.md)** - Complete guide for Docker and Railway
- **[Deployment Comparison](./docs/deployment-comparison.md)** - Detailed comparison to help you choose
- **[Automatic Login](./docs/automatic-login.md)** - Login automation via environment variables

**Quick start:**

### Docker
```bash
# Create .env file (copy from env.example)
cp env.example .env
# Edit .env with your credentials

docker-compose up -d
```

### Railway
1. Connect your GitHub repo to Railway
2. Railway will auto-detect and deploy
3. Configure environment variables in Railway dashboard:
   - `INSTAGRAM_USERNAME` (as Secret)
   - `INSTAGRAM_PASSWORD` (as Secret)

**Automatic Login:** Set `INSTAGRAM_USERNAME` and `INSTAGRAM_PASSWORD` environment variables for automatic login without interaction. See [automatic login guide](./docs/automatic-login.md) for details.

For more details, see the [deployment guide](./docs/deployment-guide.md).

### Sister projects

We contributed the following extensions to the Ink ecosystem for building Terminal UI apps:

- [Ink Picture, Ink-native image component](https://github.com/endernoke/ink-picture)
- [Wax, Ink routing framework](https://github.com/endernoke/wax).
