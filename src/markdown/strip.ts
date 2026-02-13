import { markdownToIR } from "./ir.js";

/**
 * Strips markdown formatting and returns plain text.
 * This is useful for TTS engines or channels that don't support markdown.
 */
export function stripMarkdown(text: string): string {
  if (!text) {
    return "";
  }
  // markdownToIR returns an IR containing the plain text in .text
  const ir = markdownToIR(text);
  return ir.text;
}
