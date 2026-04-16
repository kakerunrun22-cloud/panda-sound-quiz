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
    audioUrl: "/audio/panda-goat.mp3",
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
    audioUrl: "/audio/panda-sealion.mp3",
    isRealPanda: true,
    animalLabel: "パンダの鳴き声",
    explanation:
      "パンダはオットセイのような「アウアウ」という声も出せるんだパフ！これは威嚇や興奮した時に使う声なんだよ。",
  },
  {
    id: 4,
    audioUrl: "/audio/sealion.mp3",
    isRealPanda: false,
    animalLabel: "オットセイの鳴き声",
    explanation:
      "これはオットセイの声だったパフ。パンダの威嚇の声とよく似ているけど、オットセイの方がもっと太い声を出すんだよ！",
  },
  {
    id: 5,
    audioUrl: "/audio/panda-dog.mp3",
    isRealPanda: true,
    animalLabel: "パンダの鳴き声",
    explanation:
      "パンダは犬のような「ワンワン」に近い声も出すんだパフ！怒った時や驚いた時にこの声を出すことがあるよ。",
  },
  {
    id: 6,
    audioUrl: "/audio/dog.mp3",
    isRealPanda: false,
    animalLabel: "犬の鳴き声",
    explanation:
      "これは犬の声だったパフ！パンダの声と比べると、犬の方がもっとはっきりした声を出すんだよ。",
  },
  {
    id: 7,
    audioUrl: "/audio/panda-puppy.mp3",
    isRealPanda: true,
    animalLabel: "パンダの鳴き声",
    explanation:
      "赤ちゃんパンダは子犬のような甘えた声を出すんだパフ！お母さんパンダに甘える時によくこの声を使うよ。",
  },
  {
    id: 8,
    audioUrl: "/audio/puppy.mp3",
    isRealPanda: false,
    animalLabel: "子犬の鳴き声",
    explanation:
      "これは子犬の声だったパフ。赤ちゃんパンダの甘え声とそっくりだけど、子犬の方がもっとキュンキュンした声なんだよ！",
  },
  {
    id: 9,
    audioUrl: "/audio/panda-horse.mp3",
    isRealPanda: true,
    animalLabel: "パンダの鳴き声",
    explanation:
      "パンダは馬のいななきのような声も出せるんだパフ！これはとても珍しい鳴き方で、興奮した時に出すことがあるよ。",
  },
  {
    id: 10,
    audioUrl: "/audio/horse.mp3",
    isRealPanda: false,
    animalLabel: "馬の鳴き声",
    explanation:
      "これは馬の声だったパフ！パンダの声と比べると、馬の方がずっと力強くて長い声を出すんだよ。",
  },
];
