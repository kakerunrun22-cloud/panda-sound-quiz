import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, RotateCcw, Volume2, Trophy } from "lucide-react";
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

const PAIR_COUNT = 6; // 6 pairs = 12 cards (4x3)

function buildDeck(): Card[] {
  const shuffledQs = [...quizData].sort(() => Math.random() - 0.5).slice(0, PAIR_COUNT);
  const cards: Card[] = shuffledQs.flatMap((q) => [
    { uid: `${q.id}-a`, question: q, matched: false, flipped: false },
    { uid: `${q.id}-b`, question: q, matched: false, flipped: false },
  ]);
  return cards.sort(() => Math.random() - 0.5);
}

const Memory = () => {
  const navigate = useNavigate();
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
    if (matchedCount === totalCards && startedAt && !recordedRef.current) {
      recordedRef.current = true;
      const timeSec = Math.round((Date.now() - startedAt) / 1000);
      setCleared(true);
      recordMemory(timeSec, misses);
      toast("🎉 クリアパフ！すごいパフ〜");
    }
  }, [matchedCount, totalCards, startedAt, misses, recordMemory]);

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

  const handleRestart = () => {
    setDeck(buildDeck());
    setSelected([]);
    setMisses(0);
    setLocked(false);
    setStartedAt(null);
    setCleared(false);
    recordedRef.current = false;
  };

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="relative min-h-screen bamboo-pattern px-4 py-6">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 p-2 rounded-full bg-card border border-border shadow-sm hover:scale-105 active:scale-95 transition-transform z-10"
        aria-label="メニューへ"
      >
        <ArrowLeft size={20} className="text-foreground" />
      </button>

      <div className="max-w-md mx-auto flex flex-col items-center gap-4 pt-10">
        <PandaDoctor
          state={cleared ? "happy" : "neutral"}
          message={
            cleared
              ? "コンプリートパフ！博士もびっくりパフ🎊"
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

        {/* Best record */}
        {stats.memory.bestTimeSec !== null && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Trophy size={12} className="text-primary" />
            ベスト：{fmtTime(stats.memory.bestTimeSec)} / ミス{stats.memory.bestMisses}
          </div>
        )}

        {/* Grid 4x3 */}
        <div className="grid grid-cols-4 gap-2 w-full">
          {deck.map((card, idx) => {
            const showFace = card.flipped || card.matched;
            return (
              <button
                key={card.uid}
                onClick={() => handleFlip(idx)}
                disabled={card.matched}
                className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                  card.matched
                    ? "bg-primary/10 border-primary/40 opacity-60"
                    : showFace
                      ? "bg-card border-primary shadow-md"
                      : "bg-foreground border-foreground hover:scale-105 active:scale-95 shadow"
                }`}
              >
                {showFace ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-2xl">{card.question.emoji}</span>
                    <Volume2 size={12} className="text-primary" />
                  </div>
                ) : (
                  <span className="text-2xl text-background">🐾</span>
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
          </div>
        )}

        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <RotateCcw size={18} /> 新しいゲーム
        </button>
      </div>
    </div>
  );
};

export default Memory;
