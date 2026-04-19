import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, RotateCcw, Volume2, Trophy, Music } from "lucide-react";
import PandaDoctor from "@/components/PandaDoctor";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useStats } from "@/hooks/useStats";
import { quizData, type QuizQuestion } from "@/data/quizData";

interface Card {
  uid: string;
  question: QuizQuestion;
  matched: boolean;
  flipped: boolean;
}

type Difficulty = "easy" | "hard";
const PAIR_COUNT = 6; // 6 pairs = 12 cards (4x3)

function buildDeck(): Card[] {
  const shuffledQs = [...quizData].sort(() => Math.random() - 0.5).slice(0, PAIR_COUNT);
  const cards: Card[] = shuffledQs.flatMap((q) => [
    { uid: `${q.id}-a`, question: q, matched: false, flipped: false },
    { uid: `${q.id}-b`, question: q, matched: false, flipped: false },
  ]);
  return cards.sort(() => Math.random() - 0.5);
}

const fmtTime = (s: number | null) => {
  if (s === null) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const Memory = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [deck, setDeck] = useState<Card[]>(() => buildDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [locked, setLocked] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [cleared, setCleared] = useState(false);
  const recordedRef = useRef(false);
  const { play } = useAudioPlayer();
  const { stats, recordMemory } = useStats();

  const matchedCount = deck.filter((c) => c.matched).length;
  const totalCards = deck.length;

  // Timer tick
  useEffect(() => {
    if (!startedAt || cleared) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [startedAt, cleared]);

  // Detect clear
  useEffect(() => {
    if (matchedCount === totalCards && startedAt && !recordedRef.current && difficulty) {
      recordedRef.current = true;
      const timeSec = Math.round((Date.now() - startedAt) / 1000);
      setCleared(true);
      recordMemory(difficulty, timeSec, misses);
      toast("🎉 クリアパフ！すごいパフ〜");
    }
  }, [matchedCount, totalCards, startedAt, misses, recordMemory, difficulty]);

  const elapsed = useMemo(() => {
    if (!startedAt) return 0;
    return Math.floor((now - startedAt) / 1000);
  }, [now, startedAt]);

  const handleFlip = (idx: number) => {
    if (locked) return;
    const card = deck[idx];
    if (card.matched || card.flipped) return;
    if (!startedAt) setStartedAt(Date.now());

    const newDeck = deck.map((c, i) => (i === idx ? { ...c, flipped: true } : c));
    setDeck(newDeck);
    play(card.question.audioUrl);

    const newSelected = [...selected, idx];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setLocked(true);
      const [a, b] = newSelected;
      const isMatch = newDeck[a].question.id === newDeck[b].question.id;
      setTimeout(() => {
        setDeck((prev) =>
          prev.map((c, i) => {
            if (i === a || i === b) {
              return isMatch ? { ...c, matched: true, flipped: true } : { ...c, flipped: false };
            }
            return c;
          })
        );
        if (!isMatch) setMisses((m) => m + 1);
        setSelected([]);
        setLocked(false);
      }, 900);
    }
  };

  const startGame = (d: Difficulty) => {
    setDifficulty(d);
    setDeck(buildDeck());
    setSelected([]);
    setMisses(0);
    setLocked(false);
    setStartedAt(null);
    setCleared(false);
    recordedRef.current = false;
  };

  const handleRestart = () => {
    if (difficulty) startGame(difficulty);
  };

  const BackButton = () => (
    <button
      onClick={() => navigate("/")}
      className="absolute top-4 left-4 p-2 rounded-full bg-card border border-border shadow-sm hover:scale-105 active:scale-95 transition-transform z-10"
      aria-label="メニューへ"
    >
      <ArrowLeft size={20} className="text-foreground" />
    </button>
  );

  const easyBest = stats.memoryEasy;
  const hardBest = stats.memoryHard;

  // Difficulty selection screen
  if (!difficulty) {
    return (
      <div className="relative min-h-screen bamboo-pattern px-4 py-6 flex flex-col items-center">
        <BackButton />
        <div className="max-w-md mx-auto flex flex-col items-center gap-5 pt-10 w-full">
          <PandaDoctor state="neutral" message="難易度を選んでね！絵文字ありで楽しむか、音だけで挑戦するかパフ🎴" />
          <h2 className="text-xl font-black text-foreground mt-2">難易度を選択</h2>

          <button
            onClick={() => startGame("easy")}
            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card border-2 border-primary/30 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform text-left"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
              🐼
            </div>
            <div className="flex-1">
              <div className="font-black text-foreground text-base mb-0.5">初級（絵文字あり）</div>
              <p className="text-xs text-muted-foreground leading-snug mb-1">
                カードに動物の絵文字が表示されるよ。視覚と音のヒントで楽しくプレイ！
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary">
                <Trophy size={11} />
                ベスト：{fmtTime(easyBest.bestTimeSec)} / ミス{easyBest.bestMisses ?? "—"}
              </div>
            </div>
          </button>

          <button
            onClick={() => startGame("hard")}
            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card border-2 border-foreground/40 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform text-left"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center">
              <Music size={26} className="text-background" />
            </div>
            <div className="flex-1">
              <div className="font-black text-foreground text-base mb-0.5">上級（絵文字なし）</div>
              <p className="text-xs text-muted-foreground leading-snug mb-1">
                カードは音だけ！耳の記憶力で勝負するストイックモードパフ。
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-foreground">
                <Trophy size={11} />
                ベスト：{fmtTime(hardBest.bestTimeSec)} / ミス{hardBest.bestMisses ?? "—"}
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bamboo-pattern px-4 py-6">
      <BackButton />

      <div className="max-w-md mx-auto flex flex-col items-center gap-4 pt-10">
        <PandaDoctor
          state={cleared ? "happy" : "neutral"}
          message={
            cleared
              ? "コンプリートパフ！博士もびっくりパフ🎊"
              : difficulty === "hard"
                ? "音だけが頼りパフ🎧 集中するパフ！"
                : "同じ音のカードを2枚めくってペアにするパフ🧠"
          }
        />

        {/* Status bar */}
        <div className="w-full grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-card border border-border p-2">
            <div className="text-[10px] text-muted-foreground font-bold">タイム</div>
            <div className="text-sm font-black text-foreground tabular-nums">{fmtTime(elapsed)}</div>
          </div>
          <div className="rounded-xl bg-card border border-border p-2">
            <div className="text-[10px] text-muted-foreground font-bold">ミス</div>
            <div className="text-sm font-black text-destructive">{misses}</div>
          </div>
          <div className="rounded-xl bg-card border border-border p-2">
            <div className="text-[10px] text-muted-foreground font-bold">ペア</div>
            <div className="text-sm font-black text-primary">
              {matchedCount / 2}/{totalCards / 2}
            </div>
          </div>
        </div>

        {/* Difficulty badge */}
        <div className="text-[10px] font-bold text-muted-foreground">
          モード：{difficulty === "easy" ? "🐼 初級（絵文字あり）" : "🎧 上級（音のみ）"}
        </div>

        {/* Grid 4x3 */}
        <div className="grid grid-cols-4 gap-2 w-full">
          {deck.map((card, idx) => {
            const showFace = card.flipped || card.matched;
            const isSelected = selected.includes(idx) && !card.matched;
            return (
              <button
                key={card.uid}
                onClick={() => handleFlip(idx)}
                disabled={card.matched}
                className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                  card.matched
                    ? "bg-primary/10 border-primary/40 opacity-60"
                    : showFace
                      ? "bg-card border-primary shadow-md scale-[1.03]"
                      : isSelected
                        ? "bg-primary/20 border-primary shadow-md"
                        : "bg-foreground border-foreground hover:scale-105 active:scale-95 shadow"
                }`}
              >
                {showFace ? (
                  difficulty === "easy" ? (
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-2xl leading-none">{card.question.emoji}</span>
                      <Volume2 size={12} className="text-primary" />
                    </div>
                  ) : (
                    // Hard mode: clean音符アイコン (no emoji hint)
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                      <Music size={20} className="text-primary" strokeWidth={2.5} />
                    </div>
                  )
                ) : (
                  // Card back: minimalist paw
                  <span className="text-xl text-background opacity-80">🐾</span>
                )}
              </button>
            );
          })}
        </div>

        {cleared && (
          <div className="w-full rounded-2xl bg-card border-2 border-primary/30 p-4 text-center shadow-md">
            <div className="text-2xl font-black text-primary mb-1">クリア！🎉</div>
            <p className="text-sm text-foreground">
              タイム：<span className="font-bold">{fmtTime(elapsed)}</span> / ミス：
              <span className="font-bold text-destructive">{misses}</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-2">
              {difficulty === "easy" ? "🐼 初級" : "🎧 上級"} ベスト：
              {fmtTime(
                (difficulty === "easy" ? easyBest : hardBest).bestTimeSec
              )} / ミス
              {(difficulty === "easy" ? easyBest : hardBest).bestMisses ?? "—"}
            </p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <RotateCcw size={18} /> 新しいゲーム
          </button>
          <button
            onClick={() => setDifficulty(null)}
            className="px-5 py-3 rounded-full bg-card border-2 border-border text-foreground font-bold text-sm shadow-sm hover:scale-105 active:scale-95 transition-transform"
          >
            難易度変更
          </button>
        </div>
      </div>
    </div>
  );
};

export default Memory;
