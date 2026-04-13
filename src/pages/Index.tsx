import { useState } from "react";
import PandaDoctor from "@/components/PandaDoctor";
import ProgressBar from "@/components/ProgressBar";
import AudioPlayerButton from "@/components/AudioPlayerButton";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { quizData, type QuizQuestion } from "@/data/quizData";
import { Share2, RotateCcw } from "lucide-react";

type Screen = "start" | "quiz" | "result" | "final";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const { isPlaying, play } = useAudioPlayer();

  const question: QuizQuestion | undefined = quizData[currentQ];
  const totalQuestions = quizData.length;
  const scorePercent = Math.round((score / totalQuestions) * 100);

  const handleAnswer = (answeredPanda: boolean) => {
    if (answered) return;
    const correct = answeredPanda === question.isRealPanda;
    setWasCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setAnswered(true);
    setScreen("result");
  };

  const handleNext = () => {
    if (currentQ + 1 >= totalQuestions) {
      setScreen("final");
    } else {
      setCurrentQ((c) => c + 1);
      setAnswered(false);
      setScreen("quiz");
    }
  };

  const handleRestart = () => {
    setScreen("start");
    setCurrentQ(0);
    setScore(0);
    setAnswered(false);
  };

  const handleShare = () => {
    const text = `🐼 パンダクイズで私のパンダ理解度は${scorePercent}%でした！あなたもパンダの声を聞き分けられるかな？`;
    if (navigator.share) {
      navigator.share({ title: "パンダ声クイズ", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("クリップボードにコピーしました！");
    }
  };

  // --- START SCREEN ---
  if (screen === "start") {
    return (
      <div className="min-h-screen bamboo-pattern flex flex-col items-center justify-center px-4 py-8 gap-6">
        <PandaDoctor state="neutral" message="パンダの声を聞き分けられるかパフ？🎵" />
        <h1 className="text-3xl font-black text-foreground tracking-tight text-center">
          🐼 パンダ声クイズ
        </h1>
        <p className="text-muted-foreground text-center max-w-sm">
          パンダは意外な鳴き声をするよ！本物のパンダの声を当ててみよう！
        </p>
        <button
          onClick={() => setScreen("quiz")}
          className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          クイズ開始 🎶
        </button>
      </div>
    );
  }

  // --- QUIZ SCREEN ---
  if (screen === "quiz" && question) {
    return (
      <div className="min-h-screen bamboo-pattern flex flex-col items-center px-4 py-6 gap-5">
        <PandaDoctor state="neutral" message="この声は誰の声かなパフ？🤔" />
        <ProgressBar current={currentQ + 1} total={totalQuestions} />
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

  // --- RESULT SCREEN ---
  if (screen === "result" && question) {
    return (
      <div className="min-h-screen bamboo-pattern flex flex-col items-center px-4 py-6 gap-5">
        <PandaDoctor
          state={wasCorrect ? "happy" : "sad"}
          message={wasCorrect ? "正解パフ！すごいパフ〜🎉" : "残念パフ…次はがんばるパフ💦"}
        />
        <div
          className={`text-4xl font-black ${wasCorrect ? "text-primary" : "text-destructive"}`}
        >
          {wasCorrect ? "⭕ 正解！" : "❌ 不正解…"}
        </div>
        <div className="w-full max-w-sm rounded-2xl bg-card border border-border p-5 shadow-sm">
          <p className="text-xs font-bold text-primary mb-1">🎓 パンダ博士の解説</p>
          <p className="text-sm text-foreground leading-relaxed">{question.explanation}</p>
        </div>
        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          {currentQ + 1 >= totalQuestions ? "結果を見る 📊" : "次の問題へ ➡️"}
        </button>
      </div>
    );
  }

  // --- FINAL SCREEN ---
  return (
    <div className="min-h-screen bamboo-pattern flex flex-col items-center justify-center px-4 py-8 gap-6">
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
      <p className="text-muted-foreground">
        {totalQuestions}問中{score}問正解！
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <Share2 size={18} /> シェア
        </button>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <RotateCcw size={18} /> もう一度
        </button>
      </div>
    </div>
  );
};

export default Index;
