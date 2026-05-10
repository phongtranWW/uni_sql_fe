import { createContext, useContext } from "react";
import type { QueryError, QueryResult } from "@/lib/sql-engine";
import type { UseSqlEngineResult } from "@/hooks/use-sql-engine";
import type { PlaygroundSeed } from "@/features/playground/playground.state";

/**
 * One run cycle's UI state, kept locally inside the playground page (not in
 * Redux) because it is short-lived and tightly coupled to the editor buffer.
 */
export interface RunState {
  status: "idle" | "running" | "ok" | "error";
  results: QueryResult[];
  error: QueryError | null;
  /** Wall-clock time the latest run finished. */
  finishedAt: string | null;
}

export interface PlaygroundContextValue {
  seed: PlaygroundSeed;

  // From useSqlEngine
  engine: UseSqlEngineResult;

  // Editor buffer + run state lifted from <PlaygroundEditor>
  buffer: string;
  setBuffer: (next: string) => void;
  selection: string;
  setSelection: (next: string) => void;

  runState: RunState;
  runAll: () => void;
  runSelection: () => void;
  resetDb: () => void;
}

export const PlaygroundContext = createContext<PlaygroundContextValue | null>(
  null,
);

export function usePlayground(): PlaygroundContextValue {
  const ctx = useContext(PlaygroundContext);
  if (!ctx) {
    throw new Error("usePlayground must be used inside <PlaygroundProvider>");
  }
  return ctx;
}
