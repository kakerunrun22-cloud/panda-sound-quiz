import { useState, useRef, useCallback } from "react";

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    // For now, use a placeholder oscillator tone since audio files don't exist yet
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      // Different frequencies for different "animals"
      const hash = url.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      osc.frequency.value = 300 + (hash % 400);
      osc.type = "sine";
      gain.gain.value = 0.3;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setIsPlaying(true);
      setTimeout(() => {
        osc.stop();
        ctx.close();
        setIsPlaying(false);
      }, 2000);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  return { isPlaying, play, stop };
};
