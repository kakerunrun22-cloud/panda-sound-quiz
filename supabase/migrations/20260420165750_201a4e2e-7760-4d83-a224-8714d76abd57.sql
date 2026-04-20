CREATE TABLE public.memory_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL DEFAULT 'ゲスト',
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','hard')),
  time_sec INTEGER NOT NULL CHECK (time_sec >= 0),
  misses INTEGER NOT NULL CHECK (misses >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.memory_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rankings"
  ON public.memory_rankings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert rankings"
  ON public.memory_rankings FOR INSERT
  WITH CHECK (
    char_length(nickname) BETWEEN 1 AND 20
    AND time_sec <= 36000
    AND misses <= 9999
  );

CREATE INDEX idx_memory_rankings_diff_time ON public.memory_rankings (difficulty, time_sec ASC);
CREATE INDEX idx_memory_rankings_diff_misses ON public.memory_rankings (difficulty, misses ASC);