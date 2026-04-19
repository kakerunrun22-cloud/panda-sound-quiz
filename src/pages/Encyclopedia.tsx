import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Volume2, ArrowLeft, BookOpen } from "lucide-react";
import PandaDoctor from "@/components/PandaDoctor";
import { quizData, type QuizQuestion } from "@/data/quizData";
import { useEncyclopedia } from "@/hooks/useEncyclopedia";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Encyclopedia = () => {
  const navigate = useNavigate();
  const { isUnlocked, unlockedIds } = useEncyclopedia();
  const { isPlaying, play } = useAudioPlayer();
  const [selected, setSelected] = useState<QuizQuestion | null>(null);

  const unlockedCount = unlockedIds.length;
  const totalCount = quizData.length;

  return (
    <div className="min-h-screen bamboo-pattern px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 max-w-lg mx-auto">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full bg-card border border-border shadow-sm hover:scale-105 active:scale-95 transition-transform"
          aria-label="戻る"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-xl font-black text-foreground flex items-center gap-2">
          <BookOpen size={22} className="text-primary" />
          パンダ博士の鳴き声図鑑
        </h1>
      </div>

      {/* Panda guide */}
      <div className="max-w-lg mx-auto mb-5">
        <PandaDoctor
          state={unlockedCount >= totalCount ? "happy" : "neutral"}
          message={
            unlockedCount >= totalCount
              ? "全部コンプリートパフ！すごいパフ〜🎉"
              : `${unlockedCount}/${totalCount}種類を発見したパフ！クイズで正解してもっと集めるパフ🔍`
          }
        />
      </div>

      {/* Progress */}
      <div className="max-w-lg mx-auto mb-5">
        <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1">
          <span>コレクション</span>
          <span>{unlockedCount}/{totalCount}</span>
        </div>
        <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
        {quizData.map((item) => {
          const unlocked = isUnlocked(item.id);
          return (
            <button
              key={item.id}
              onClick={() => unlocked && setSelected(item)}
              disabled={!unlocked}
              className={`relative rounded-2xl border-2 p-4 flex flex-col items-center gap-2 transition-all duration-200
                ${unlocked
                  ? "bg-card border-primary/30 shadow-md hover:scale-[1.03] hover:shadow-lg active:scale-[0.98] cursor-pointer"
                  : "bg-muted border-border opacity-60 cursor-not-allowed"
                }`}
            >
              {/* Image / Lock */}
              {unlocked ? (
                <div className="w-20 h-20 rounded-xl bg-secondary/40 border border-border p-1 flex items-center justify-center">
                  <img
                    src={item.imageUrl}
                    alt={item.animalLabel}
                    width={80}
                    height={80}
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center text-4xl">
                  ❓
                </div>
              )}
              {!unlocked && (
                <div className="absolute top-2 right-2">
                  <Lock size={16} className="text-muted-foreground" />
                </div>
              )}
              {/* Label */}
              <span className={`text-xs font-bold text-center leading-tight ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                {unlocked ? item.animalLabel : "？？？"}
              </span>
              {unlocked && (
                <span className="text-[10px] text-primary font-semibold">タップで詳細</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl border-2 border-primary/20 encyclopedia-detail">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <span className="text-3xl">{selected?.emoji}</span>
              {selected?.animalLabel}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="flex flex-col gap-4">
              {/* Animal photo (real-life image) */}
              <div className="flex justify-center">
                <div className="w-56 h-56 rounded-2xl bg-secondary/40 border-2 border-primary/20 p-1.5 shadow-inner overflow-hidden">
                  <img
                    src={selected.detailImageUrl ?? selected.imageUrl}
                    alt={selected.animalLabel}
                    width={224}
                    height={224}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
              {/* Audio replay */}
              <button
                onClick={() => play(selected.audioUrl)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-bold shadow-md hover:scale-105 active:scale-95 transition-transform ${isPlaying ? "ripple-animation" : ""}`}
              >
                <Volume2 size={20} />
                {isPlaying ? "再生中…" : "もう一度聴く 🔊"}
              </button>

              {/* Long description */}
              <div className="rounded-2xl bg-secondary/50 border border-border p-4">
                <p className="text-xs font-bold text-primary mb-2 flex items-center gap-1">
                  <BookOpen size={14} />
                  🎓 パンダ博士の図鑑メモ
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {selected.longDescription}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Encyclopedia;
