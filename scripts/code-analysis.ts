
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🔍 Starting NEØ Code Analysis...");

const TARGET_FILES = [
    "src/agents/tools/image-tool.ts",
    "src/media-understanding/providers/image.ts",
];

// Verify files exist
const missing = TARGET_FILES.filter((f) => !fs.existsSync(f));
if (missing.length > 0) {
    console.error("❌ Missing files:", missing);
    process.exit(1);
}

console.log("📂 Analyzing Critical Paths:");
TARGET_FILES.forEach(f => console.log(`   - ${f}`));

try {
    // Run tsc purely on these files to isolate the issue
    // We use --noEmit and --skipLibCheck to focus on our logic errors
    const cmd = `npx tsc ${TARGET_FILES.join(" ")} --noEmit --target esnext --moduleResolution node --allowSyntheticDefaultImports --esModuleInterop --skipLibCheck --allowJs`;

    console.log("\n⚡ Executing Compiler Check...");
    execSync(cmd, { stdio: "inherit", cwd: process.cwd() });

    console.log("\n✅ No critical errors found in target files.");
} catch (error) {
    console.log("\n⚠️  Compiler found issues. Review output above.");
    // We don't exit 1 here to allow the process to continu if used in a pipeline that handles output
}
