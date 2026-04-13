export interface QuizQuestion {
  id: number;
  audioUrl: string;
  isRealPanda: boolean;
  animalLabel: string;
  explanation: string;
}

export const quizData: QuizQuestion[] = [
  {
    id: 1,
    audioUrl: "/audio/panda-bleat.mp3",
    isRealPanda: true,
    animalLabel: "パンダの鳴き声",
    explanation:
      "これはパンダが仲間を呼ぶ時の声だよ！ヤギのような「メェー」という声を出すんだパフ。赤ちゃんパンダは特にこの声をよく出すよ！",
  },
  {
    id: 2,
    audioUrl: "/audio/goat.mp3",
    isRealPanda: false,
    animalLabel: "ヤギの鳴き声",
    explanation:
      "これはヤギの声だったパフ！パンダの声と似ているけど、ヤギの方がもっと力強い声を出すんだよ。",
  },
  {
    id: 3,
    audioUrl: "/audio/panda-chirp.mp3",
    isRealPanda: true,
    animalLabel: "パンダの鳴き声",
    explanation:
      "パンダは小鳥のような「チュンチュン」という声も出せるんだパフ！これは求愛の時に使う特別な声なんだよ。",
  },
  {
    id: 4,
    audioUrl: "/audio/bird.mp3",
    isRealPanda: false,
    animalLabel: "小鳥の鳴き声",
    explanation:
      "これは小鳥の声だったパフ。パンダの求愛の声とよく似ているけど、小鳥の方がもっと高い音を出すんだよ！",
  },
  {
    id: 5,
    audioUrl: "/audio/panda-honk.mp3",
    isRealPanda: true,
    animalLabel: "パンダの鳴き声",
    explanation:
      "パンダは怒った時に「ガーッ」というクラクションのような声を出すパフ！体は大きいけど、普段はとても穏やかな動物なんだよ。",
  },
];
