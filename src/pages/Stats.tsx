import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, Trophy, BookOpen, RotateCcw } from "lucide-react";
import PandaDoctor from "@/components/PandaDoctor";
import { useStats } from "@/hooks/useStats";
import { useEncyclopedia } from "@/hooks/useEncyclopedia";
import { quizData } from "@/data/quizData";

const fmtTime = (s: number | null) => {
  if (s === null) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const StatCard = ({
  title,
  emoji,
  children,
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl bg-card border-2 border-primary/20 p-4 shadow-sm">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-2xl">{emoji}</span>
      <h3 className="font-black text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

const Stats = () => {
  const navigate = useNavigate();
  const { stats, reset } = useStats();
  const { unlockedIds } = useEncyclopedia();

  const accA =
    stats.modeA.totalQuestions > 0
      ? Math.round((stats.modeA.totalCorrect / stats.modeA.totalQuestions) * 100)
      : 0;
  const accB =
    stats.modeB.totalQuestions > 0
      ? Math.round((stats.modeB.totalCorrect / stats.modeB.totalQuestions) * 100)
      : 0;

  const handleReset = () => {
    if (confirm("成績データをリセットするパフ？（図鑑データは消えません）")) {
      reset();
    }
  };

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
          <BarChart3 size={22} className="text-primary" />
          成績スタジオ
        </h1>
      </div>

      <div className="max-w-lg mx-auto mb-5">
        <PandaDoctor state="neutral" message="今までの記録を見てみるパフ📊" />
      </div>

      <div className="max-w-lg mx-auto flex flex-col gap-3">
        <StatCard title="モードA：パンダか偽物か" emoji="🎧">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] text-muted-foreground font-bold">プレイ回数</div>
              <div className="text-xl font-black text-foreground">{stats.modeA.plays}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold">正解数</div>
              <div className="text-xl font-black text-primary">
                {stats.modeA.totalCorrect}/{stats.modeA.totalQuestions}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold">正解率</div>
              <div className="text-xl font-black text-primary">{accA}%</div>
            </div>
          </div>
        </StatCard>

        <StatCard title="モードB：聴き比べ" emoji="⚖️">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] text-muted-foreground font-bold">プレイ回数</div>
              <div className="text-xl font-black text-foreground">{stats.modeB.plays}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold">正解数</div>
              <div className="text-xl font-black text-primary">
                {stats.modeB.totalCorrect}/{stats.modeB.totalQuestions}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold">正解率</div>
              <div className="text-xl font-black text-primary">{accB}%</div>
            </div>
          </div>
        </StatCard>

        <StatCard title="モードC：神経衰弱（初級）" emoji="♠">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] text-muted-foreground font-bold">プレイ回数</div>
              <div className="text-xl font-black text-foreground">{stats.memoryEasy.plays}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold flex items-center justify-center gap-0.5">
                <Trophy size={10} /> ベストタイム
              </div>
              <div className="text-xl font-black text-primary tabular-nums">
                {fmtTime(stats.memoryEasy.bestTimeSec)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold">最少ミス</div>
              <div className="text-xl font-black text-primary">
                {stats.memoryEasy.bestMisses ?? "—"}
              </div>
            </div>
          </div>
        </StatCard>

        <StatCard title="モードC：神経衰弱（上級）" emoji="♠">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] text-muted-foreground font-bold">プレイ回数</div>
              <div className="text-xl font-black text-foreground">{stats.memoryHard.plays}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold flex items-center justify-center gap-0.5">
                <Trophy size={10} /> ベストタイム
              </div>
              <div className="text-xl font-black text-foreground tabular-nums">
                {fmtTime(stats.memoryHard.bestTimeSec)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold">最少ミス</div>
              <div className="text-xl font-black text-foreground">
                {stats.memoryHard.bestMisses ?? "—"}
              </div>
            </div>
          </div>
        </StatCard>

        <StatCard title="図鑑コレクション" emoji="📖">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">解放済み</span>
            <span className="text-2xl font-black text-primary">
              {unlockedIds.length}/{quizData.length}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden mt-2">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(unlockedIds.length / quizData.length) * 100}%` }}
            />
          </div>
          <button
            onClick={() => navigate("/encyclopedia")}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-bold text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <BookOpen size={14} className="text-primary" /> 図鑑を見る
          </button>
        </StatCard>

        <button
          onClick={handleReset}
          className="mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-card border border-destructive/40 text-destructive font-bold text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <RotateCcw size={12} /> 成績をリセット
        </button>
      </div>
    </div>
  );
};

export default Stats;
