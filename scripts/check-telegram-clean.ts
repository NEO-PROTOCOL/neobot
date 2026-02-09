
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const FORBIDDEN_PATHS = [
    'src/telegram',
    'src/infra/notifiers/telegram.ts',
];

const FORBIDDEN_CONTENT = [
    'node-telegram-bot-api',
    'Telegraf',
];

function scanDirectory(dir: string, invalidFiles: string[]) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                scanDirectory(fullPath, invalidFiles);
            }
        } else {
            // Check path
            if (FORBIDDEN_PATHS.some(p => fullPath.includes(p))) {
                invalidFiles.push(`Path forbidden: ${fullPath}`);
            }

            // Check content (only for ts/js/json files)
            if (fullPath.endsWith('.ts') || fullPath.endsWith('.js') || fullPath.endsWith('.json')) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                FORBIDDEN_CONTENT.forEach(term => {
                    if (content.includes(term)) {
                        // Allow this script itself to contain the terms
                        if (!fullPath.includes('check-telegram-clean.ts')) {
                            invalidFiles.push(`Content forbidden in ${fullPath}: "${term}"`);
                        }
                    }
                });
            }
        }
    }
}

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
    console.log('🛡️  Scanning for Telegram contamination...');
    const rootDir = path.resolve(__dirname, '..');
    const invalidFiles: string[] = [];

    // Check if forbidden paths exist directly first (even if empty)
    FORBIDDEN_PATHS.forEach(p => {
        const fullPath = path.join(rootDir, p);
        if (fs.existsSync(fullPath)) {
            invalidFiles.push(`Path forbidden: ${fullPath}`);
        }
    });

    // Start deep scan
    scanDirectory(path.join(rootDir, 'src'), invalidFiles);

    // Check package.json specifically
    const pkgPath = path.join(rootDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
        const content = fs.readFileSync(pkgPath, 'utf-8');
        FORBIDDEN_CONTENT.forEach(term => {
            if (content.includes(term)) {
                invalidFiles.push(`Content forbidden in ${pkgPath}: "${term}"`);
            }
        });
    }

    if (invalidFiles.length > 0) {
        console.error('❌ Telegram contamination detected!');
        invalidFiles.forEach(f => console.error(` - ${f}`));
        process.exit(1);
    }

    console.log('✅ System is clean. No Telegram traces found.');
}

main();
