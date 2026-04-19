import { useState, useCallback, useEffect } from "react";

export type GameMode = "modeA" | "modeB" | "modeC";
export type MemoryDifficulty = "easy" | "hard";

export interface ModeStats {
  plays: number;
  totalQuestions: number;
  totalCorrect: number;
}

export interface MemoryRecord {
  bestTimeSec: number | null;
  bestMisses: number | null;
  plays: number;
}

export interface StatsState {
  modeA: ModeStats;
  modeB: ModeStats;
  /** @deprecated kept for backward compat — use memoryEasy/memoryHard */
  memory?: MemoryRecord;
  memoryEasy: MemoryRecord;
  memoryHard: MemoryRecord;
}

const STORAGE_KEY = "panda-stats-v2";
const LEGACY_KEY = "panda-stats-v1";

const emptyMemory = (): MemoryRecord => ({ bestTimeSec: null, bestMisses: null, plays: 0 });

const initial: StatsState = {
  modeA: { plays: 0, totalQuestions: 0, totalCorrect: 0 },
  modeB: { plays: 0, totalQuestions: 0, totalCorrect: 0 },
  memoryEasy: emptyMemory(),
  memoryHard: emptyMemory(),
};

function loadInitial(): StatsState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...initial, ...JSON.parse(saved) };
    // Migrate from v1 if present (old combined memory record → easy bucket)
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      return {
        ...initial,
        modeA: parsed.modeA ?? initial.modeA,
        modeB: parsed.modeB ?? initial.modeB,
        memoryEasy: parsed.memory ?? emptyMemory(),
      };
    }
    return initial;
  } catch {
    return initial;
  }
}

export const useStats = () => {
  const [stats, setStats] = useState<StatsState>(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const recordQuiz = useCallback(
    (mode: "modeA" | "modeB", correct: number, total: number) => {
      setStats((prev) => ({
        ...prev,
        [mode]: {
          plays: prev[mode].plays + 1,
          totalQuestions: prev[mode].totalQuestions + total,
          totalCorrect: prev[mode].totalCorrect + correct,
        },
      }));
    },
    []
  );

  const recordMemory = useCallback(
    (difficulty: MemoryDifficulty, timeSec: number, misses: number) => {
      setStats((prev) => {
        const key = difficulty === "easy" ? "memoryEasy" : "memoryHard";
        const m = prev[key];
        return {
          ...prev,
          [key]: {
            plays: m.plays + 1,
            bestTimeSec: m.bestTimeSec === null ? timeSec : Math.min(m.bestTimeSec, timeSec),
            bestMisses: m.bestMisses === null ? misses : Math.min(m.bestMisses, misses),
          },
        };
      });
    },
    []
  );

  const reset = useCallback(() => setStats(initial), []);

  return { stats, recordQuiz, recordMemory, reset };
};
