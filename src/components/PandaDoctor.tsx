import pandaDoctor from "@/assets/panda-doctor.png";
import pandaHappy from "@/assets/panda-happy.png";
import pandaSad from "@/assets/panda-sad.png";

type PandaState = "neutral" | "happy" | "sad";

interface PandaDoctorProps {
  state: PandaState;
  message: string;
}

const PandaDoctor = ({ state, message }: PandaDoctorProps) => {
  const image = state === "happy" ? pandaHappy : state === "sad" ? pandaSad : pandaDoctor;
  const animClass = state === "happy" ? "panda-roll" : state === "sad" ? "panda-sulk" : "panda-bounce";

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={image}
        alt="パンダ博士"
        width={140}
        height={140}
        className={`${animClass} drop-shadow-lg`}
      />
      <div className="relative max-w-xs rounded-2xl bg-card px-5 py-3 shadow-md border border-border">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-card border-l border-t border-border" />
        <p className="text-sm font-semibold text-foreground text-center relative z-10">{message}</p>
      </div>
    </div>
  );
};

export default PandaDoctor;
