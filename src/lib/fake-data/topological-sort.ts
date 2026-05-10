import type { SchemaTable } from "@/lib/sql-engine";

export interface TopoSortInput {
  tables: SchemaTable[];
  /**
   * The set of tables we actually want to insert into. Tables outside this
   * set are still considered when computing dependencies (we may want to
   * auto-include their parents) but they will not appear in `ordered`.
   */
  selected: Set<string>;
}

export interface TopoSortResult {
  /**
   * Tables to insert into, ordered so that every table appears AFTER all of
   * its FK parents. Tables stuck in a cycle are omitted and reported in
   * `cycles` instead.
   */
  ordered: string[];
  /** Tables dropped because they participate in an unresolvable FK cycle. */
  cycles: string[];
  /** All FK edges discovered, useful for the auto-include-parents step. */
  edges: Array<{ from: string; to: string; nullable: boolean; column: string }>;
}

/**
 * Kahn's algorithm with a small twist: an FK on a NULLABLE column does not
 * count as a hard dependency (we can insert NULL and skip the parent). This
 * unlocks self-referencing tables like `employees(manager_id NULL)`.
 *
 * Returns dependency-respecting order. Self-loops via nullable FKs are
 * tolerated; non-nullable cycles end up in `cycles`.
 */
export function sortTablesByFk({
  tables,
  selected,
}: TopoSortInput): TopoSortResult {
  const edges: TopoSortResult["edges"] = [];
  const tableNames = new Set(tables.map((t) => t.name));

  for (const t of tables) {
    for (const c of t.columns) {
      if (!c.fk) continue;
      if (!tableNames.has(c.fk.table)) continue; // FK to a table we don't see
      edges.push({
        from: t.name,
        to: c.fk.table,
        nullable: c.nullable,
        column: c.name,
      });
    }
  }

  // Hard edges = non-nullable FKs only. Self-loops stay out so we never
  // deadlock a table on itself.
  const hardEdges = edges.filter((e) => !e.nullable && e.from !== e.to);

  const inDegree = new Map<string, number>();
  for (const t of tables) inDegree.set(t.name, 0);
  for (const e of hardEdges) {
    inDegree.set(e.from, (inDegree.get(e.from) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const [name, deg] of inDegree) {
    if (deg === 0 && selected.has(name)) queue.push(name);
  }
  // Also seed the queue with selected tables that depend only on
  // unselected (but in-schema) parents — we still respect them ordering-wise
  // but those parents must already be included. This loop is intentionally
  // just for ordering; auto-inclusion is handled by the caller upstream.

  const ordered: string[] = [];
  const visited = new Set<string>();

  // Simple priority loop: for every "ready" table emit it, then decrement
  // child in-degrees. Tables not in `selected` are skipped from output but
  // still reduce in-degree of their dependants.
  const allReady: string[] = [];
  for (const [name, deg] of inDegree) {
    if (deg === 0) allReady.push(name);
  }

  while (allReady.length > 0) {
    const next = allReady.shift()!;
    if (visited.has(next)) continue;
    visited.add(next);
    if (selected.has(next)) ordered.push(next);

    for (const e of hardEdges) {
      if (e.to !== next) continue;
      const newDeg = (inDegree.get(e.from) ?? 0) - 1;
      inDegree.set(e.from, newDeg);
      if (newDeg === 0 && !visited.has(e.from)) {
        allReady.push(e.from);
      }
    }
  }

  const cycles = Array.from(selected).filter((t) => !visited.has(t));

  return { ordered, cycles, edges };
}
