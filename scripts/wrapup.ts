import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// Load Registry from ecosystem.json to ensure Single Source of Truth
import ecosystem from '../config/ecosystem.json' with { type: "json" };

const REPOS = ecosystem.map(p => ({
    name: p.name,
    path: p.localPath
}));

function checkRepo(repo: { name: string, path: string }) {
    const fullPath = path.resolve(process.cwd(), repo.path);

    if (!fs.existsSync(fullPath)) {
        console.log(`❌ ${repo.name.padEnd(20)}: Path not found (${repo.path})`);
        return;
    }

    try {
        // Check for uncommitted changes
        const status = execSync(`git -C "${fullPath}" status --porcelain`, { encoding: 'utf-8' }).trim();
        const isDirty = status.length > 0;

        // Check for unpushed commits
        let isAhead = false;
        try {
            const ahead = execSync(`git -C "${fullPath}" log @{u}..`, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
            if (ahead.length > 0) isAhead = true;
        } catch (e) {
            // Upstream might not be set
        }

        const icon = (isDirty || isAhead) ? "⚠️ " : "✅";
        let msg = `${icon} ${repo.name.padEnd(20)}: `;

        if (!isDirty && !isAhead) {
            msg += "Clean & Synced";
        } else {
            if (isDirty) msg += "[Uncommitted Changes] ";
            if (isAhead) msg += "[Need Push] ";
        }

        console.log(msg);

        if (isDirty) {
            console.log(`   👉 Action: cd "${repo.path}" && git add . && git commit -m "update" && git push`);
        }
        if (isAhead && !isDirty) {
            console.log(`   👉 Action: cd "${repo.path}" && git push`);
        }

    } catch (e) {
        console.log(`❓ ${repo.name.padEnd(20)}: Not a git repo or error checking status.`);
    }
}

console.log("\n🛑 NΞØ PROTOCOL: SESSION WRAP-UP CHECK\n");
console.log("Checking stack integrity before shutdown...\n");

for (const repo of REPOS) {
    checkRepo(repo);
}

console.log("\n===========================================\n");
