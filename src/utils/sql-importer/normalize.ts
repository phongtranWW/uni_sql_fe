/**
 * Strip SQL block comments (/* ... *\/), line comments (-- ...) and
 * normalize runs of whitespace to a single space.
 *
 * NOTE: We intentionally do NOT parse string literals here because the
 * backend-generated SQL never embeds comment syntax inside DEFAULT values.
 */
export function normalizeSql(sql: string): string {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, " ")  // block comments
    .replace(/--[^\n]*/g, "")            // line comments
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Split a normalized SQL string into individual statements by `;`,
 * skipping semicolons that appear inside single-quoted strings or
 * balanced parentheses.
 */
export function splitStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inString = false;
  let depth = 0;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];

    if (inString) {
      current += ch;
      if (ch === "'") {
        if (sql[i + 1] === "'") {
          // escaped quote '' — consume both
          current += "'";
          i++;
        } else {
          inString = false;
        }
      }
      continue;
    }

    if (ch === "'") {
      inString = true;
      current += ch;
    } else if (ch === "(") {
      depth++;
      current += ch;
    } else if (ch === ")") {
      depth--;
      current += ch;
    } else if (ch === ";" && depth === 0) {
      const trimmed = current.trim();
      if (trimmed) statements.push(trimmed);
      current = "";
    } else {
      current += ch;
    }
  }

  const trimmed = current.trim();
  if (trimmed) statements.push(trimmed);

  return statements;
}

/**
 * Remove surrounding double-quotes or backtick quoting and strip any
 * leading schema prefix (e.g. `public.users` → `users`).
 */
export function stripIdentifier(raw: string): string {
  let s = raw.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("`") && s.endsWith("`"))
  ) {
    s = s.slice(1, -1);
  }
  // Strip schema prefix: keep the part after the last dot
  const dot = s.lastIndexOf(".");
  if (dot !== -1) s = s.slice(dot + 1);
  return s;
}

/**
 * Split a string by top-level commas (commas not inside parentheses).
 * Used to split field lines inside a CREATE TABLE body.
 */
export function splitTopLevelCommas(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";

  for (const ch of s) {
    if (ch === "(") {
      depth++;
      current += ch;
    } else if (ch === ")") {
      depth--;
      current += ch;
    } else if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}
