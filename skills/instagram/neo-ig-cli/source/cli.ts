#!/usr/bin/env node
// Load .env file if it exists (before any other imports that might need env vars)
import { config } from 'dotenv';
import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Pastel from 'pastel';
import { readPackageUp } from 'read-package-up';
import { initializeLogger } from './utils/logger.js';

// Load .env file from project root (only if it exists)
const scriptDir = dirname(fileURLToPath(import.meta.url));
const package_ = await readPackageUp({cwd: scriptDir});
if (package_) {
	const projectRoot = dirname(package_.path);
	const envPath = join(projectRoot, '.env');
	try {
		// Only load .env if the file exists
		await fs.promises.access(envPath);
		config({path: envPath});
	} catch {
		// .env file doesn't exist, skip loading
	}
}

// Initialize logger as early as possible
await initializeLogger();

// This is needed to get the correct path in ES modules
// In order to find the correct nearest package.json
// Pastel's default doesn't work when running globally where pwd is not the code path
// (package_ is already defined above for .env loading)

const app = new Pastel({
	importMeta: import.meta,
	version: package_?.packageJson.version,
	description: package_?.packageJson.description,
});

try {
	await app.run();
} catch {
	// eslint-disable-next-line n/prefer-global/process
	process.exit(1);
}
