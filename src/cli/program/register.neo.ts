/**
 * NEO Protocol CLI Registration
 *
 * Registers all NEO Protocol commands in the openclaw CLI
 */

import type { Command } from "commander";
import { neoInfoCommand } from "../../neo/cli/info.js";
import { indexCreateCommand } from "../../neo/cli/index-create.js";
import { skillPublishCommand } from "../../neo/cli/skill-publish.js";
import { skillInstallCommand } from "../../neo/cli/skill-install.js";
import { skillListCommand } from "../../neo/cli/skill-list.js";

/**
 * Registers NEO Protocol commands
 *
 * Structure:
 *   neo
 *   ├── info              Display NEO Protocol info
 *   ├── index:create      Create skills index on IPFS
 *   └── skill
 *       ├── publish       Publish skill to IPFS
 *       ├── install       Install skill from IPFS
 *       └── list          List available skills
 */
export function registerNeoCommands(program: Command): void {
  const neo = program.command("neo").description("NEO Protocol commands");

  // neo:info
  neo
    .command("info")
    .description("Display NEO Protocol information")
    .action(async () => {
      try {
        await neoInfoCommand();
      } catch (error: any) {
        console.error(`Failed to execute neo:info: ${error.message}`);
        process.exit(1);
      }
    });

  // neo:index:create
  neo
    .command("index:create")
    .description("Create new skills index on IPFS")
    .action(async () => {
      try {
        await indexCreateCommand();
      } catch (error: any) {
        console.error(`Failed to create index: ${error.message}`);
        process.exit(1);
      }
    });

  // neo:skill
  const skill = neo.command("skill").description("NEO skill management");

  // neo:skill:publish
  skill
    .command("publish <path>")
    .description("Publish skill to IPFS registry")
    .action(async (path: string) => {
      try {
        await skillPublishCommand(path);
      } catch (error: any) {
        console.error(`Failed to publish skill: ${error.message}`);
        process.exit(1);
      }
    });

  // neo:skill:install
  skill
    .command("install <spec>")
    .description("Install skill from IPFS registry")
    .option("--path <dir>", "Custom installation directory")
    .action(async (spec: string, options: { path?: string }) => {
      try {
        await skillInstallCommand(spec, options);
      } catch (error: any) {
        console.error(`Failed to install skill: ${error.message}`);
        process.exit(1);
      }
    });

  // neo:skill:list
  skill
    .command("list")
    .description("List available skills in registry")
    .option("--search <query>", "Search skills by name/description/category")
    .action(async (options: { search?: string }) => {
      try {
        await skillListCommand(options);
      } catch (error: any) {
        console.error(`Failed to list skills: ${error.message}`);
        process.exit(1);
      }
    });
}
