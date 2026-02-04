import { defineConfig } from "tsdown";

const env = {
    NODE_ENV: "production",
};

export default defineConfig([
    {
        entry: "src/index.ts",
        env,
        fixedExtension: false,
        platform: "node",
    },
    {
        entry: "src/entry.ts",
        env,
        fixedExtension: false,
        platform: "node",
    },
    {
        entry: "src/cli/neobot.ts",
        outDir: "dist/cli",
        env,
        fixedExtension: false,
        platform: "node",
    },
    {
        dts: true,
        entry: "src/neo/sdk/index.ts",
        outDir: "dist/neo/sdk",
        env,
        fixedExtension: false,
        platform: "node",
    },
    {
        entry: "src/neo/identity/loader.ts",
        outDir: "dist/neo/identity",
        env,
        fixedExtension: false,
        platform: "node",
    },
    {
        entry: "src/neo/identity/audit.ts",
        outDir: "dist/neo/identity",
        env,
        fixedExtension: false,
        platform: "node",
    },
    {
        entry: "src/infra/flowpay/db.ts",
        outDir: "dist/infra/flowpay",
        env,
        fixedExtension: false,
        platform: "node",
    },
]);
