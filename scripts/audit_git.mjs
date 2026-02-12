import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = '/Users/nettomello/CODIGOS';
const primary = ['neobot', 'neoflow-content-machine', 'flowpay', 'smart-core', 'neoflw-metadata', 'flowcloser-local'];

const dirs = fs.readdirSync(root).filter(f => fs.statSync(path.join(root, f)).isDirectory());

console.log('| Directory | Git Remote | Status |');
console.log('| :--- | :--- | :--- |');

for (const dir of dirs) {
    if (primary.includes(dir) || dir.startsWith('.') || dir === '📁 BACKUPS') continue;

    const dirPath = path.join(root, dir);
    if (!fs.existsSync(path.join(dirPath, '.git'))) {
        console.log(`| ${dir} | No .git | Skip |`);
        continue;
    }

    try {
        const remote = execSync('git remote -v', { cwd: dirPath }).toString();
        const hasGithub = remote.includes('github.com/neomello');
        const status = execSync('git status --porcelain', { cwd: dirPath }).toString();
        const isClean = status.length === 0;

        console.log(`| ${dir} | ${hasGithub ? '✅ neomello' : '❌ Other/None'} | ${isClean ? '✅ Clean' : '⚠️ Uncommitted'} |`);
    } catch (e) {
        console.log(`| ${dir} | Error | - |`);
    }
}
