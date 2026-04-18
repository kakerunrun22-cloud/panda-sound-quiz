import { useNavigate } from "react-router-dom";
import { HelpCircle, Scale, Brain, BookOpen, BarChart3 } from "lucide-react";
import PandaDoctor from "@/components/PandaDoctor";
import MenuCard from "@/components/MenuCard";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bamboo-pattern px-4 py-8 flex flex-col items-center gap-6">
      <PandaDoctor state="neutral" message="今日はどのモードで遊ぶパフ？🎵" />

      <h1 className="text-3xl font-black text-foreground tracking-tight text-center">
        🐼 パンダの鳴き声マスター
      </h1>
      <p className="text-muted-foreground text-center max-w-sm text-sm -mt-2">
        パンダ博士の研究所へようこそパフ！
      </p>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <MenuCard
          icon={HelpCircle}
          emoji="🎧"
          title="モードA：パンダか偽物か"
          subtitle="1つの音を聴いて本物のパンダか当ててね"
          onClick={() => navigate("/mode-a")}
        />
        <MenuCard
          icon={Scale}
          emoji="⚖️"
          title="モードB：どっちがパンダ？"
          subtitle="2つの音を聴き比べて本物を選ぼう"
          onClick={() => navigate("/mode-b")}
        />
        <MenuCard
          icon={Brain}
          emoji="🧠"
          title="モードC：音の神経衰弱"
          subtitle="同じ音のペアを見つけよう"
          onClick={() => navigate("/memory")}
        />
      </div>

      <div className="flex gap-3 flex-wrap justify-center mt-2">
        <button
          onClick={() => navigate("/encyclopedia")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border-2 border-primary/30 text-foreground font-bold text-sm shadow-sm hover:scale-105 active:scale-95 transition-transform"
        >
          <BookOpen size={16} className="text-primary" />
          鳴き声図鑑
        </button>
        <button
          onClick={() => navigate("/stats")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border-2 border-primary/30 text-foreground font-bold text-sm shadow-sm hover:scale-105 active:scale-95 transition-transform"
        >
          <BarChart3 size={16} className="text-primary" />
          成績スタジオ
        </button>
      </div>
    </div>
  );
};

export default Index;
