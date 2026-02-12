
import { createNeoRegistry } from '../src/neo/registry/index.js';
import path from 'path';
import fs from 'fs';
import { program } from 'commander';
import chalk from 'chalk';

// Setup CLI
program
    .name('neo-skill')
    .description('NEO Protocol Skills CLI')
    .version('1.0.0');

// Command: neo:skill:publish <path>
program
    .command('publish')
    .description('Publish a skill directory to IPFS')
    .argument('<path>', 'Path to skill directory')
    .option('--gateway <url>', 'IPFS Gateway URL', 'http://127.0.0.1:5001')
    .action(async (skillPath, options) => {
        try {
            const absolutePath = path.resolve(process.cwd(), skillPath);

            if (!fs.existsSync(absolutePath)) {
                console.error(chalk.red(`❌ Path not found: ${absolutePath}`));
                process.exit(1);
            }

            console.log(chalk.blue(`🚀 Initializing NEO Registry (IPFS: ${options.gateway})...`));
            const registry = createNeoRegistry({ ipfsApiUrl: options.gateway });

            const { cid, manifest } = await registry.publish(absolutePath);

            console.log(chalk.green(`\n✨ SUCCESS! Skill Published to NEO Network.`));
            console.log(chalk.white(`   CID: `) + chalk.cyan.bold(cid));
            console.log(chalk.white(`   Name: `) + chalk.yellow(manifest.name));
            console.log(chalk.white(`   Version: `) + chalk.yellow(manifest.version));
            console.log(chalk.gray(`\nTo install on another node:`));
            console.log(chalk.white(`   pnpm neo:skill:install ${cid}`));

        } catch (e: any) {
            console.error(chalk.red(`\n❌ Error publishing skill:`));
            console.error(e.message);
            process.exit(1);
        }
    });

// Command: neo:skill:install <cid>
program
    .command('install')
    .description('Install a skill from IPFS')
    .argument('<cid>', 'IPFS CID of the skill')
    .option('--alias <name>', 'Custom folder name for installation')
    .option('--gateway <url>', 'IPFS Gateway URL', 'http://127.0.0.1:5001')
    .action(async (cid, options) => {
        try {
            console.log(chalk.blue(`🚀 Initializing NEO Registry (IPFS: ${options.gateway})...`));
            const registry = createNeoRegistry({ ipfsApiUrl: options.gateway });

            const installPath = await registry.install(cid, options.alias);

            console.log(chalk.green(`\n✨ SUCCESS! Skill Installed.`));
            console.log(chalk.white(`   Location: `) + chalk.yellow(installPath));

        } catch (e: any) {
            console.error(chalk.red(`\n❌ Error installing skill:`));
            console.error(e.message);
            process.exit(1);
        }
    });

program.parse();
