import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { MemoryDifficulty } from "./useStats";

export interface RankingEntry {
  id: string;
  nickname: string;
  difficulty: MemoryDifficulty;
  time_sec: number;
  misses: number;
  created_at: string;
}

const NICKNAME_KEY = "panda-ranking-nickname";

export const getSavedNickname = () => {
  try {
    return localStorage.getItem(NICKNAME_KEY) ?? "";
  } catch {
    return "";
  }
};

export const saveNickname = (n: string) => {
  try {
    localStorage.setItem(NICKNAME_KEY, n);
  } catch {
    /* ignore */
  }
};

export const useRanking = (difficulty: MemoryDifficulty, sortBy: "time" | "misses" = "time") => {
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRanking = useCallback(async () => {
    setLoading(true);
    const orderCol = sortBy === "time" ? "time_sec" : "misses";
    const { data, error } = await supabase
      .from("memory_rankings")
      .select("*")
      .eq("difficulty", difficulty)
      .order(orderCol, { ascending: true })
      .order("created_at", { ascending: true })
      .limit(20);
    if (!error && data) setEntries(data as RankingEntry[]);
    setLoading(false);
  }, [difficulty, sortBy]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  return { entries, loading, refresh: fetchRanking };
};

export const submitRanking = async (
  nickname: string,
  difficulty: MemoryDifficulty,
  timeSec: number,
  misses: number
) => {
  const cleanName = (nickname || "ゲスト").trim().slice(0, 20) || "ゲスト";
  const { error } = await supabase.from("memory_rankings").insert({
    nickname: cleanName,
    difficulty,
    time_sec: timeSec,
    misses,
  });
  if (error) throw error;
  saveNickname(cleanName);
};
