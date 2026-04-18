import { useState, useCallback, useEffect } from "react";

export type GameMode = "modeA" | "modeB" | "modeC";

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
  memory: MemoryRecord;
}

const STORAGE_KEY = "panda-stats-v1";

const initial: StatsState = {
  modeA: { plays: 0, totalQuestions: 0, totalCorrect: 0 },
  modeB: { plays: 0, totalQuestions: 0, totalCorrect: 0 },
  memory: { bestTimeSec: null, bestMisses: null, plays: 0 },
};

export const useStats = () => {
  const [stats, setStats] = useState<StatsState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return initial;
      return { ...initial, ...JSON.parse(saved) };
    } catch {
      return initial;
    }
  });

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

  const recordMemory = useCallback((timeSec: number, misses: number) => {
    setStats((prev) => {
      const m = prev.memory;
      return {
        ...prev,
        memory: {
          plays: m.plays + 1,
          bestTimeSec: m.bestTimeSec === null ? timeSec : Math.min(m.bestTimeSec, timeSec),
          bestMisses: m.bestMisses === null ? misses : Math.min(m.bestMisses, misses),
        },
      };
    });
  }, []);

  const reset = useCallback(() => setStats(initial), []);

  return { stats, recordQuiz, recordMemory, reset };
};
