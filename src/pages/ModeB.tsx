import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, RotateCcw, BookOpen, Volume2 } from "lucide-react";
import PandaDoctor from "@/components/PandaDoctor";
import ProgressBar from "@/components/ProgressBar";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useEncyclopedia } from "@/hooks/useEncyclopedia";
import { useStats } from "@/hooks/useStats";
import { quizData, type QuizQuestion } from "@/data/quizData";

const QUIZ_COUNT = 5;

interface Pair {
  panda: QuizQuestion;
  fake: QuizQuestion;
  pandaSide: 0 | 1;
}

/** Build pairs of (panda voice, lookalike fake) using shared pairId. */
function buildPairs(n: number): Pair[] {
  const pandas = quizData.filter((q) => q.type === "panda");
  const fakeByPair = new Map<string, QuizQuestion>();
  quizData.filter((q) => q.type === "fake").forEach((q) => fakeByPair.set(q.pairId, q));

  const validPandas = pandas.filter((p) => fakeByPair.has(p.pairId));
  const shuffled = [...validPandas].sort(() => Math.random() - 0.5).slice(0, n);

  return shuffled.map((panda) => ({
    panda,
    fake: fakeByPair.get(panda.pairId)!,
    pandaSide: (Math.random() < 0.5 ? 0 : 1) as 0 | 1,
  }));
}

type Screen = "quiz" | "result" | "final";

const ModeB = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("quiz");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [pairs, setPairs] = useState<Pair[]>(() => buildPairs(QUIZ_COUNT));
  const { isPlaying, play, stop } = useAudioPlayer();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const { unlock, isUnlocked } = useEncyclopedia();
  const { recordQuiz } = useStats();

  const pair = pairs[currentQ];
  const total = pairs.length;
  const scorePercent = total > 0 ? Math.round((score / total) * 100) : 0;

  const sides = useMemo<[QuizQuestion, QuizQuestion]>(() => {
    if (!pair) return [quizData[0], quizData[1]];
    return pair.pandaSide === 0 ? [pair.panda, pair.fake] : [pair.fake, pair.panda];
  }, [pair]);

  const wrongPicked = pair ? (pair.pandaSide === 0 ? pair.fake : pair.panda) : null;

  const handlePlay = (idx: number, url: string) => {
    setActiveIdx(idx);
    play(url);
  };

  const handleAnswer = (chosenIdx: 0 | 1) => {
    if (!pair) return;
    stop();
    setActiveIdx(null);
    const correct = chosenIdx === pair.pandaSide;
    setWasCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
      if (!isUnlocked(pair.panda.id)) {
        unlock(pair.panda.id);
        toast(`${pair.panda.emoji} ${pair.panda.animalLabel}の図鑑が解放されたパフ！`, {
          description: "鳴き声図鑑で詳しい解説が読めるよ📖",
          duration: 3000,
        });
      }
    }
    setScreen("result");
  };

  const handleNext = () => {
    if (currentQ + 1 >= total) {
      recordQuiz("modeB", score, total);
      setScreen("final");
    } else {
      setCurrentQ((c) => c + 1);
      setScreen("quiz");
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setScore(0);
    setPairs(buildPairs(QUIZ_COUNT));
    setScreen("quiz");
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

  if (screen === "quiz" && pair) {
    return (
      <div className="relative min-h-screen bamboo-pattern flex flex-col items-center px-4 py-6 gap-5">
        <BackButton />
        <PandaDoctor state="neutral" message="どっちが本物のパンダの声かなパフ？🎧" />
        <ProgressBar current={currentQ + 1} total={total} />

        <div className="flex flex-col gap-4 w-full max-w-sm mt-2">
          {sides.map((q, idx) => (
            <div
              key={`${currentQ}-${idx}`}
              className="rounded-2xl bg-card border-2 border-primary/20 p-4 shadow-sm flex items-center gap-3"
            >
              <button
                onClick={() => handlePlay(idx, q.audioUrl)}
                className={`flex-shrink-0 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform ${
                  isPlaying && activeIdx === idx ? "ripple-animation" : ""
                }`}
                aria-label="音声を再生"
              >
                <Volume2 size={24} strokeWidth={2.5} />
              </button>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground font-bold mb-1">
                  音声 {String.fromCharCode(65 + idx)}
                </div>
                <button
                  onClick={() => handleAnswer(idx as 0 | 1)}
                  className="w-full py-2.5 rounded-xl bg-foreground text-background font-bold text-sm shadow hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  これがパンダ！
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">両方聴き比べて選んでね 🔊</p>
      </div>
    );
  }

  if (screen === "result" && pair) {
    const reaction =
      !wasCorrect && wrongPicked?.specialWrongReaction
        ? wrongPicked.specialWrongReaction
        : wasCorrect
          ? "正解パフ！耳が良いパフ〜🎉"
          : "惜しいパフ…もう一度よく聴いてみるパフ💦";
    return (
      <div className="relative min-h-screen bamboo-pattern flex flex-col items-center px-4 py-6 gap-5">
        <BackButton />
        <PandaDoctor state={wasCorrect ? "happy" : "sad"} message={reaction} />
        <div className={`text-4xl font-black ${wasCorrect ? "text-primary" : "text-destructive"}`}>
          {wasCorrect ? "⭕ 正解！" : "❌ 不正解…"}
        </div>

        {/* Big animal image */}
        <div className="rounded-3xl bg-card border-2 border-primary/30 p-2 shadow-md overflow-hidden">
          <img
            src={pair.panda.detailImageUrl ?? pair.panda.imageUrl}
            alt={pair.panda.animalLabel}
            width={160}
            height={160}
            loading="lazy"
            className="w-32 h-32 object-cover rounded-2xl"
          />
        </div>

        <div className="w-full max-w-sm rounded-2xl bg-card border border-border p-5 shadow-sm">
          <p className="text-xs font-bold text-primary mb-1">
            🎓 正解は「{pair.panda.animalLabel}」
          </p>
          <p className="text-sm text-foreground leading-relaxed">{pair.panda.explanation}</p>
        </div>
        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          {currentQ + 1 >= total ? "結果を見る 📊" : "次の問題へ ➡️"}
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bamboo-pattern flex flex-col items-center justify-center px-4 py-8 gap-6">
      <BackButton />
      <PandaDoctor
        state={scorePercent >= 60 ? "happy" : "sad"}
        message={
          scorePercent >= 80
            ? "パンダの耳を持つパフ！🏆"
            : scorePercent >= 60
              ? "聴き分けがうまいパフ！😊"
              : "もっと聴き比べてみるパフ…📚"
        }
      />
      <h2 className="text-2xl font-black text-foreground">聴き比べスコア</h2>
      <div className="text-6xl font-black text-primary">{scorePercent}%</div>
      <p className="text-muted-foreground">{total}問中{score}問正解！</p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <RotateCcw size={18} /> もう一度
        </button>
        <button
          onClick={() => navigate("/encyclopedia")}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-card border-2 border-primary/30 text-foreground font-bold shadow-sm hover:scale-105 active:scale-95 transition-transform"
        >
          <BookOpen size={18} className="text-primary" /> 図鑑
        </button>
      </div>
    </div>
  );
};

export default ModeB;
