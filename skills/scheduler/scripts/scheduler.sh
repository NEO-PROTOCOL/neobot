#!/bin/bash
# Wrapper for the scheduler TS script
pnpm tsx "$(dirname "$0")/scheduler.ts" "$@"
