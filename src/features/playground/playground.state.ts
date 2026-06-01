import type { SqlDialect, QueryResult, QueryError } from "@/lib/sql-engine";

/**
 * One snippet the user has executed in the playground. Lives in-memory only.
 */
export interface PlaygroundHistoryEntry {
  id: string;
  sql: string;
  ranAt: string;
  ok: boolean;
  /** Optional summary, e.g. "SELECT 12 rows · 3ms" or error message. */
  summary?: string;
}

/**
 * Seed handed off from the editor's CodePreview dialog. Cleared once the user
 * leaves the playground via the back button (but kept across re-mounts inside
 * the playground so Reset still works).
 */
export interface PlaygroundSeed {
  sql: string;
  dialect: SqlDialect;
  projectId: string | null;
  projectName: string | null;
  /** Wall-clock time the seed was set — used to detect stale entries. */
  createdAt: string;
}

/**
 * Engine status and initialization state
 */
export type EngineStatus = "idle" | "initializing" | "ready" | "error";

/**
 * Run state for query execution
 */
export interface RunState {
  status: "idle" | "running" | "ok" | "error";
  results: QueryResult[];
  error: QueryError | null;
  finishedAt: string | null;
}

export interface PlaygroundSliceState {
  seed: PlaygroundSeed | null;
  history: PlaygroundHistoryEntry[];

  // Engine state
  engineStatus: EngineStatus;
  engineError: string | null;

  // Editor buffer
  buffer: string;
  selection: string;

  // Run state
  runState: RunState;
}

export const initialPlaygroundSliceState: PlaygroundSliceState = {
  seed: null,
  history: [],
  engineStatus: "idle",
  engineError: null,
  buffer: `-- Try a query against your schema, e.g.:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
`,
  selection: "",
  runState: {
    status: "idle",
    results: [],
    error: null,
    finishedAt: null,
  },
};
