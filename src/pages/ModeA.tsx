import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, RotateCcw, BookOpen } from "lucide-react";
import PandaDoctor from "@/components/PandaDoctor";
import ProgressBar from "@/components/ProgressBar";
import AudioPlayerButton from "@/components/AudioPlayerButton";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useEncyclopedia } from "@/hooks/useEncyclopedia";
import { useStats } from "@/hooks/useStats";
import { quizData, type QuizQuestion } from "@/data/quizData";

const QUIZ_COUNT = 5;

function pickRandom(arr: QuizQuestion[], n: number): QuizQuestion[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

type Screen = "quiz" | "result" | "final";

const ModeA = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("quiz");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => pickRandom(quizData, QUIZ_COUNT));
  const { isPlaying, play } = useAudioPlayer();
  const { unlock, isUnlocked } = useEncyclopedia();
  const { recordQuiz } = useStats();

  const question = questions[currentQ];
  const total = questions.length;
  const scorePercent = Math.round((score / total) * 100);

  const handleAnswer = (answeredPanda: boolean) => {
    const correct = answeredPanda === question.isRealPanda;
    setWasCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
      if (!isUnlocked(question.id)) {
        unlock(question.id);
        toast(`${question.emoji} ${question.animalLabel}の図鑑が解放されたパフ！`, {
          description: "鳴き声図鑑で詳しい解説が読めるよ📖",
          duration: 3000,
        });
      }
    }
    setScreen("result");
  };

  const handleNext = () => {
    if (currentQ + 1 >= total) {
      recordQuiz("modeA", score, total);
      setScreen("final");
    } else {
      setCurrentQ((c) => c + 1);
      setScreen("quiz");
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setScore(0);
    setQuestions(pickRandom(quizData, QUIZ_COUNT));
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

  if (screen === "quiz" && question) {
    return (
      <div className="relative min-h-screen bamboo-pattern flex flex-col items-center px-4 py-6 gap-5">
        <BackButton />
        <PandaDoctor state="neutral" message="この声は誰の声かなパフ？🤔" />
        <ProgressBar current={currentQ + 1} total={total} />
        <div className="flex-1 flex items-center">
          <AudioPlayerButton isPlaying={isPlaying} onPlay={() => play(question.audioUrl)} />
        </div>
        <p className="text-sm text-muted-foreground">タップして音声を再生 🔊</p>
        <div className="flex gap-4 w-full max-w-sm">
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            🐼 パンダ
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 py-4 rounded-2xl bg-foreground text-background font-bold text-lg shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            🎭 偽物
          </button>
        </div>
      </div>
    );
  }

  if (screen === "result" && question) {
    const reaction =
      !wasCorrect && question.specialWrongReaction
        ? question.specialWrongReaction
        : wasCorrect
          ? "正解パフ！すごいパフ〜🎉"
          : "残念パフ…次はがんばるパフ💦";
    return (
      <div className="relative min-h-screen bamboo-pattern flex flex-col items-center px-4 py-6 gap-5">
        <BackButton />
        <PandaDoctor state={wasCorrect ? "happy" : "sad"} message={reaction} />
        <div className={`text-4xl font-black ${wasCorrect ? "text-primary" : "text-destructive"}`}>
          {wasCorrect ? "⭕ 正解！" : "❌ 不正解…"}
        </div>
        {/* Big animal image */}
        <div className="rounded-3xl bg-card border-2 border-primary/30 p-3 shadow-md">
          <img
            src={question.imageUrl}
            alt={question.animalLabel}
            width={160}
            height={160}
            loading="lazy"
            className="w-32 h-32 object-contain"
          />
        </div>
        <div className="w-full max-w-sm rounded-2xl bg-card border border-border p-5 shadow-sm">
          <p className="text-xs font-bold text-primary mb-1">
            🎓 正解は「{question.animalLabel}」
          </p>
          <p className="text-sm text-foreground leading-relaxed">{question.explanation}</p>
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
            ? "パンダマスターパフ！🏆"
            : scorePercent >= 60
              ? "なかなかやるパフ！😊"
              : "もっと勉強するパフ…📚"
        }
      />
      <h2 className="text-2xl font-black text-foreground">あなたのパンダ理解度</h2>
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

export default ModeA;
