import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Clock, Target, RefreshCw } from "lucide-react";
import PandaDoctor from "@/components/PandaDoctor";
import { useRanking } from "@/hooks/useRanking";
import type { MemoryDifficulty } from "@/hooks/useStats";

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const medal = (i: number) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`);

const RankingTable = ({
  difficulty,
  sortBy,
}: {
  difficulty: MemoryDifficulty;
  sortBy: "time" | "misses";
}) => {
  const { entries, loading, refresh } = useRanking(difficulty, sortBy);

  return (
    <div className="rounded-2xl bg-card border-2 border-primary/20 p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-foreground">
          {sortBy === "time" ? <Clock size={14} /> : <Target size={14} />}
          {sortBy === "time" ? "タイム順" : "ミス少ない順"}
        </div>
        <button
          onClick={refresh}
          className="p-1.5 rounded-full bg-secondary hover:scale-105 active:scale-95 transition-transform"
          aria-label="更新"
        >
          <RefreshCw size={12} className="text-foreground" />
        </button>
      </div>
      {loading ? (
        <div className="text-center text-xs text-muted-foreground py-4">読み込み中...</div>
      ) : entries.length === 0 ? (
        <div className="text-center text-xs text-muted-foreground py-4">
          まだ記録がないパフ。1番乗りを目指すパフ！
        </div>
      ) : (
        <ol className="flex flex-col gap-1">
          {entries.map((e, i) => (
            <li
              key={e.id}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${
                i < 3 ? "bg-primary/10" : "bg-secondary/40"
              }`}
            >
              <span className="w-6 text-center text-sm font-black tabular-nums">{medal(i)}</span>
              <span className="flex-1 text-sm font-bold text-foreground truncate">
                {e.nickname}
              </span>
              <span className="text-xs font-black text-primary tabular-nums">
                {fmtTime(e.time_sec)}
              </span>
              <span className="text-[10px] text-muted-foreground tabular-nums">
                ミス{e.misses}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

const Ranking = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<MemoryDifficulty>("easy");
  const [sortBy, setSortBy] = useState<"time" | "misses">("time");

  return (
    <div className="min-h-screen bamboo-pattern px-4 py-6">
      <div className="flex items-center gap-3 mb-4 max-w-lg mx-auto">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full bg-card border border-border shadow-sm hover:scale-105 active:scale-95 transition-transform"
          aria-label="戻る"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-xl font-black text-foreground flex items-center gap-2">
          <Trophy size={22} className="text-primary" />
          ランキング
        </h1>
      </div>

      <div className="max-w-lg mx-auto mb-4">
        <PandaDoctor state="neutral" message="みんなの神経衰弱の記録パフ🏆" />
      </div>

      <div className="max-w-lg mx-auto flex flex-col gap-3">
        {/* Difficulty tabs */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDifficulty("easy")}
            className={`py-2 rounded-full font-black text-sm transition-all ${
              difficulty === "easy"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border-2 border-border text-foreground"
            }`}
          >
            初級
          </button>
          <button
            onClick={() => setDifficulty("hard")}
            className={`py-2 rounded-full font-black text-sm transition-all ${
              difficulty === "hard"
                ? "bg-foreground text-background shadow-md"
                : "bg-card border-2 border-border text-foreground"
            }`}
          >
            上級
          </button>
        </div>

        {/* Sort tabs */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSortBy("time")}
            className={`py-1.5 rounded-full font-bold text-xs transition-all ${
              sortBy === "time"
                ? "bg-secondary text-secondary-foreground shadow-sm"
                : "bg-transparent text-muted-foreground"
            }`}
          >
            <Clock size={12} className="inline mr-1" />
            タイム順
          </button>
          <button
            onClick={() => setSortBy("misses")}
            className={`py-1.5 rounded-full font-bold text-xs transition-all ${
              sortBy === "misses"
                ? "bg-secondary text-secondary-foreground shadow-sm"
                : "bg-transparent text-muted-foreground"
            }`}
          >
            <Target size={12} className="inline mr-1" />
            ミス順
          </button>
        </div>

        <RankingTable difficulty={difficulty} sortBy={sortBy} />

        <p className="text-[10px] text-muted-foreground text-center">
          ※ 上位20件まで表示。クリア時に「ランキング登録」を選ぶと記録されます。
        </p>
      </div>
    </div>
  );
};

export default Ranking;
