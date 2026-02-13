import type { Command } from "commander";
import { defaultRuntime } from "../runtime.js";
import { theme } from "../terminal/theme.js";
import { parseTimeoutMs } from "./parse-timeout.js";

export function registerTuiCli(program: Command) {
  program
    .command("tui")
    .description("TermUI is now removed in lean mode. Use your sovereign channel for interaction.")
    .action(() => {
      console.log(theme.error("TermUI is not available in NEØ 'Lean' mode."));
      console.log(theme.muted("Deep Autonomous requires choosing your own UI (WhatsApp or Dashboard)."));
    });
}
