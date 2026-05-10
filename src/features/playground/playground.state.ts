import type { SqlDialect } from "@/lib/sql-engine";

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

export interface PlaygroundSliceState {
  seed: PlaygroundSeed | null;
  history: PlaygroundHistoryEntry[];
}

export const initialPlaygroundSliceState: PlaygroundSliceState = {
  seed: null,
  history: [],
};
