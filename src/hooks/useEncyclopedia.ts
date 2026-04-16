import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "panda-encyclopedia-unlocked";

export const useEncyclopedia = () => {
  const [unlockedIds, setUnlockedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedIds));
  }, [unlockedIds]);

  const unlock = useCallback((id: number) => {
    setUnlockedIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const isUnlocked = useCallback(
    (id: number) => unlockedIds.includes(id),
    [unlockedIds]
  );

  return { unlockedIds, unlock, isUnlocked };
};
