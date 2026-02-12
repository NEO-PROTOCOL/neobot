# Contributing to instagram-cli

Thank you for contributing to instagram-cli, and welcome to the force against brainrot!

## Project Structure

This repository contains **two separate clients** for Instagram:

- **TypeScript Client** (`./source` folder in root)
- **Python Client** (`instagram-py/` folder)

Choose the client you want to work on based on your preferences and the feature you're implementing.

The team is primarily focused on actively developing the TypeScript client. However, both clients are maintained actively.

## How to Contribute

> If you are experienced in contributing to open-source projects, jump ahead to [DEVELOPMENT.md](./DEVELOPMENT.md) for setup and code contribution instructions.

### 1. Create a Feature Branch

Create a new branch based on the issue you’re working on:

```bash
git checkout -b fix-bug-123  # For bug fixes
git checkout -b feature-new-command  # For new features
```

### 2. Make Your Changes

Setup the development environment as per the instructions in [DEVELOPMENT.md](./DEVELOPMENT.md). More guidelines for contributing code are included there as well.

Test your changes before submitting. _For UI changes, provide screenshots or GIFs._

> [!TIP]
> During development, we recommend using a secondary Instagram account if you are making a lot of API calls to avoid appearing suspicious to Instagram. Alternatively, use our mock data for UI changes.

### 3. Code Review & Merging

- Your changes will be reviewed, and maintainers may request changes.

### 4. Releases and Versioning

You don't need to worry about changing version numbers; maintainers will handle that during the release process.

Releases are created manually. We use different tag conventions for each client:

- **Python Client**: Use `v1.4.2`, `v1.5.0`, etc.
- **TypeScript Client**: Use `ts-v1.0.0`, `ts-v1.1.0-beta`, etc.

**Semantic Versioning:**

- Bug fixes increment the patch version (e.g., `1.0.1`)
- New features increment the minor version (e.g., `1.1.0`)
- Breaking changes increment the major version (e.g., `2.0.0`)

## Code of Conduct

Be respectful to others in the community.

## License

By contributing, you agree that your contributions will be licensed under the same license as this project.

---

Happy coding! 🚀 Thanks for contributing!
