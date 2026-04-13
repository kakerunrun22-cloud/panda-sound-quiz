import { Volume2 } from "lucide-react";

interface AudioPlayerButtonProps {
  isPlaying: boolean;
  onPlay: () => void;
}

const AudioPlayerButton = ({ isPlaying, onPlay }: AudioPlayerButtonProps) => {
  return (
    <button
      onClick={onPlay}
      className={`relative w-28 h-28 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 ${isPlaying ? "ripple-animation" : ""}`}
      aria-label="音声を再生"
    >
      <Volume2 size={48} strokeWidth={2.5} />
      {isPlaying && (
        <>
          <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-30" />
        </>
      )}
    </button>
  );
};

export default AudioPlayerButton;
