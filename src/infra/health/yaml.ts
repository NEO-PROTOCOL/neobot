function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function indentLines(s: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return s
    .split("\n")
    .map((l) => (l.length ? pad + l : l))
    .join("\n");
}

function yamlEscapeString(s: string): string {
  // keep it safe and readable
  if (s === "") return '""';
  const needsQuotes = /[:\-[\]{},#&*!|>'"%@`]/.test(s) || /\s/.test(s) || s.includes("\n");
  if (!needsQuotes) return s;
  return JSON.stringify(s); // double quotes safe
}

export function toYaml(value: unknown, level = 0): string {
  const indent = " ".repeat(level);

  if (value === null || value === undefined) return "null";
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (typeof value === "string") {
    if (value.includes("\n")) {
      const block = value
        .split("\n")
        .map((l) => `${indent}  ${l}`)
        .join("\n");
      return `|\n${block}`;
    }
    return yamlEscapeString(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const lines = value.map((item) => {
      const rendered = toYaml(item, level + 2);
      if (isPlainObject(item) || Array.isArray(item)) {
        return `${indent}-\n${indentLines(rendered, 2)}`;
      }
      return `${indent}- ${rendered}`;
    });
    return lines.join("\n");
  }

  if (isPlainObject(value)) {
    const keys = Object.keys(value);
    if (keys.length === 0) return "{}";
    const lines: string[] = [];
    for (const k of keys) {
      const v = value[k];
      const rendered = toYaml(v, level + 2);

      if (isPlainObject(v) || Array.isArray(v)) {
        lines.push(`${indent}${k}:\n${indentLines(rendered, 2)}`);
      } else {
        lines.push(`${indent}${k}: ${rendered}`);
      }
    }
    return lines.join("\n");
  }

  // fallback
  try {
    if (typeof value === "object" && value !== null) {
      return yamlEscapeString(JSON.stringify(value));
    }
    return yamlEscapeString(String(value as any));
  } catch {
    return "unserializable";
  }
}
