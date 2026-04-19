import pandaImg from "@/assets/animals/panda.png";
import pandaShoutImg from "@/assets/animals/panda-shout.png";
import babyPandaImg from "@/assets/animals/baby-panda.png";
import goatImg from "@/assets/animals/goat.png";
import sealionImg from "@/assets/animals/sealion.png";
import dogImg from "@/assets/animals/dog.png";
import puppyImg from "@/assets/animals/puppy.png";
import horseImg from "@/assets/animals/horse.png";
import birdImg from "@/assets/animals/bird.png";
import kittenImg from "@/assets/animals/kitten.png";
import ojisanImg from "@/assets/animals/ojisan.png";

// Real photographs for encyclopedia detail view
import pandaPhoto from "@/assets/photos/panda-real.jpg";
import goatPhoto from "@/assets/photos/goat-real.jpg";
import sealionPhoto from "@/assets/photos/sealion-real.jpg";
import dogPhoto from "@/assets/photos/dog-real.jpg";
import puppyPhoto from "@/assets/photos/puppy-real.jpg";
import horsePhoto from "@/assets/photos/horse-real.jpg";
import birdPhoto from "@/assets/photos/bird-real.jpg";
import ojisanPhoto from "@/assets/photos/ojisan-real.jpg";
import kittenPhoto from "@/assets/photos/kitten-real.jpg";

export interface QuizQuestion {
  id: number;
  audioUrl: string;
  isRealPanda: boolean;
  animalLabel: string;
  explanation: string;
  longDescription: string;
  emoji: string;
  imageUrl: string;
  /** Real photograph for the encyclopedia detail view (optional). */
  detailImageUrl?: string;
  /** Identifier shared between a panda voice and its lookalike animal (for ModeB pairing) */
  pairId: string;
  /** "panda" voice or the "fake" lookalike animal */
  type: "panda" | "fake";
  /** Optional special panda doctor reaction text on wrong answer */
  specialWrongReaction?: string;
}

export const quizData: QuizQuestion[] = [
  // Goat pair
  {
    id: 1,
    audioUrl: "/audio/panda-goat.mp3",
    isRealPanda: true,
    animalLabel: "パンダ（ヤギ声）",
    emoji: "🐼",
    imageUrl: pandaImg,
    detailImageUrl: pandaPhoto,
    pairId: "goat",
    type: "panda",
    explanation:
      "これはパンダが仲間を呼ぶ時の声だよ！ヤギのような「メェー」という声を出すんだパフ。赤ちゃんパンダは特にこの声をよく出すよ！",
    longDescription:
      "ジャイアントパンダは、仲間とコミュニケーションを取る時にヤギに似た「メェー」という高い声を出すパフ。特に赤ちゃんパンダはお母さんを呼ぶ時にこの声を頻繁に使うんだよ。野生のパンダは単独行動が多いけど、繁殖期にはこの声でお互いの位置を確認し合うんだパフ。中国の保護施設では、この声を録音して研究に活用しているよ！",
  },
  {
    id: 2,
    audioUrl: "/audio/goat.mp3",
    isRealPanda: false,
    animalLabel: "ヤギ",
    emoji: "🐐",
    imageUrl: goatImg,
    detailImageUrl: goatPhoto,
    pairId: "goat",
    type: "fake",
    explanation:
      "これはヤギの声だったパフ！パンダの声と似ているけど、ヤギの方がもっと力強い声を出すんだよ。",
    longDescription:
      "ヤギは世界最古の家畜の一つで、約1万年前から人間と暮らしているパフ。「メェー」という鳴き声は感情によって変化し、空腹、寂しさ、喜びなどを表現するんだよ。面白いことに、ヤギの鳴き声には「方言」があって、同じ群れで育ったヤギは似た声になるんだパフ！パンダの声と比べると、ヤギの方が太くてはっきりした声なんだよ。",
  },
  // Sea lion pair
  {
    id: 3,
    audioUrl: "/audio/panda-sealion.mp3",
    isRealPanda: true,
    animalLabel: "パンダ（オットセイ声）",
    emoji: "🐼",
    imageUrl: pandaShoutImg,
    detailImageUrl: pandaPhoto,
    pairId: "sealion",
    type: "panda",
    explanation:
      "パンダはオットセイのような「アウアウ」という声も出せるんだパフ！これは威嚇や興奮した時に使う声なんだよ。",
    longDescription:
      "パンダが怒ったり興奮したりすると、オットセイに似た「アウアウ」という低い唸り声を出すんだパフ。この声は主に縄張り争いや、他のパンダに近づかれた時に使われるよ。大人のオスパンダが特にこの声を出すことが多く、動物園の飼育員さんも最初は驚くんだって！パンダは見た目は可愛いけど、実はとても力強い声を持っているんだパフ。",
  },
  {
    id: 4,
    audioUrl: "/audio/sealion.mp3",
    isRealPanda: false,
    animalLabel: "オットセイ",
    emoji: "🦭",
    imageUrl: sealionImg,
    detailImageUrl: sealionPhoto,
    pairId: "sealion",
    type: "fake",
    explanation:
      "これはオットセイの声だったパフ。パンダの威嚇の声とよく似ているけど、オットセイの方がもっと太い声を出すんだよ！",
    longDescription:
      "オットセイは海の哺乳類で、水中と陸上の両方で生活するパフ。あの特徴的な「アウアウ」という声は、主にオスが縄張りを主張したり、メスにアピールする時に使うんだよ。オットセイの声は最大で120デシベル（飛行機のエンジン並み！）にもなるパフ。パンダの声と比べると、より持続的で力強い声が特徴なんだよ！",
  },
  // Dog pair
  {
    id: 5,
    audioUrl: "/audio/panda-dog.mp3",
    isRealPanda: true,
    animalLabel: "パンダ（犬声）",
    emoji: "🐼",
    imageUrl: pandaShoutImg,
    detailImageUrl: pandaPhoto,
    pairId: "dog",
    type: "panda",
    explanation:
      "パンダは犬のような「ワンワン」に近い声も出すんだパフ！怒った時や驚いた時にこの声を出すことがあるよ。",
    longDescription:
      "パンダが急に驚かされたり、強い怒りを感じた時に、犬の吠え声に似た声を出すことがあるパフ。この声は短く鋭い「ワッ」という音で、相手を威嚇する効果があるんだよ。野生のパンダがこの声を出すのは主に他の動物と遭遇した時で、見た目のイメージとは裏腹にかなり迫力があるパフ！動物園では飼育員さんが急に現れた時に聞けることがあるよ。",
  },
  {
    id: 6,
    audioUrl: "/audio/dog.mp3",
    isRealPanda: false,
    animalLabel: "犬",
    emoji: "🐕",
    imageUrl: dogImg,
    detailImageUrl: dogPhoto,
    pairId: "dog",
    type: "fake",
    explanation:
      "これは犬の声だったパフ！パンダの声と比べると、犬の方がもっとはっきりした声を出すんだよ。",
    longDescription:
      "犬は約1万5千年前からの人間の親友パフ！吠え声は犬種によって大きく異なり、小型犬は高い声、大型犬は低い声を出す傾向があるよ。犬は40種類以上の異なる鳴き声を使い分けて、感情や意図を伝えるんだパフ。パンダの声と比べると、犬の方がバリエーション豊かで、明確なコミュニケーション手段として発達しているんだよ！",
  },
  // Puppy pair
  {
    id: 7,
    audioUrl: "/audio/panda-puppy.mp3",
    isRealPanda: true,
    animalLabel: "パンダ（子犬声）",
    emoji: "🐼",
    imageUrl: babyPandaImg,
    detailImageUrl: pandaPhoto,
    pairId: "puppy",
    type: "panda",
    explanation:
      "赤ちゃんパンダは子犬のような甘えた声を出すんだパフ！お母さんパンダに甘える時によくこの声を使うよ。",
    longDescription:
      "生まれたばかりの赤ちゃんパンダは、体重わずか100〜200gで、まるで子犬のような甘い「クゥーン」という声を出すパフ。この声はお母さんパンダに「お腹が空いた」「寒い」「寂しい」と伝えるための大切な手段なんだよ。赤ちゃんパンダは生後数ヶ月間、ほぼ24時間お母さんに抱かれて過ごし、この声でずっとコミュニケーションを取っているパフ。成長すると徐々にこの声は出さなくなるんだよ。",
  },
  {
    id: 8,
    audioUrl: "/audio/puppy.mp3",
    isRealPanda: false,
    animalLabel: "子犬",
    emoji: "🐶",
    imageUrl: puppyImg,
    detailImageUrl: puppyPhoto,
    pairId: "puppy",
    type: "fake",
    explanation:
      "これは子犬の声だったパフ。赤ちゃんパンダの甘え声とそっくりだけど、子犬の方がもっとキュンキュンした声なんだよ！",
    longDescription:
      "子犬は生まれてから数週間は目が見えず、鳴き声がお母さん犬との唯一のコミュニケーション手段なんだパフ。「クゥーン」「キュンキュン」という甘い声は、空腹や不安、甘えたい気持ちを表現しているよ。赤ちゃんパンダの声と本当によく似ているのは、哺乳類の赤ちゃんに共通する「親を呼ぶ声」の特徴を持っているからだパフ。生後8週間くらいから徐々に吠える練習を始めるんだよ！",
  },
  // Horse pair
  {
    id: 9,
    audioUrl: "/audio/panda-horse.mp3",
    isRealPanda: true,
    animalLabel: "パンダ（馬声）",
    emoji: "🐼",
    imageUrl: pandaShoutImg,
    detailImageUrl: pandaPhoto,
    pairId: "horse",
    type: "panda",
    explanation:
      "パンダは馬のいななきのような声も出せるんだパフ！これはとても珍しい鳴き方で、興奮した時に出すことがあるよ。",
    longDescription:
      "パンダが非常に興奮したり、繁殖期に異性にアピールする時に、馬のいななきに似た長い鳴き声を出すことがあるパフ。これはパンダの鳴き声の中でも最も珍しいもので、動物園の飼育員でも滅多に聞けない貴重な声なんだよ。この声は他の鳴き声と比べて音域が広く、遠くまで届くのが特徴パフ。野生のパンダが広い竹林の中でパートナーを見つけるための、大切な「ラブコール」なんだよ！",
  },
  {
    id: 10,
    audioUrl: "/audio/horse.mp3",
    isRealPanda: false,
    animalLabel: "馬",
    emoji: "🐴",
    imageUrl: horseImg,
    detailImageUrl: horsePhoto,
    pairId: "horse",
    type: "fake",
    explanation:
      "これは馬の声だったパフ！パンダの声と比べると、馬の方がずっと力強くて長い声を出すんだよ。",
    longDescription:
      "馬のいななきは、喜び、不安、仲間への呼びかけなど、様々な感情を表現するパフ。馬は30種類以上の異なる声を使い分けることができ、その社会性の高さを示しているよ。いななきの音は最大で1km先まで届くこともあるパフ！パンダの声と比べると、馬の声の方がより力強く、リズミカルで、持続時間も長いのが特徴なんだよ。馬は約6000年前に家畜化されて以来、人間との深い絆を築いてきたパフ。",
  },
  // Bird pair
  {
    id: 11,
    audioUrl: "/audio/panda-bird.mp3",
    isRealPanda: true,
    animalLabel: "パンダ（小鳥声）",
    emoji: "🐼",
    imageUrl: pandaImg,
    detailImageUrl: pandaPhoto,
    pairId: "bird",
    type: "panda",
    explanation:
      "パンダは小鳥のような可愛らしい鳴き声も出すんだパフ！穏やかな気持ちの時にチュンチュンと囀ることがあるよ。",
    longDescription:
      "驚くことに、パンダは小鳥のような高くて可愛らしい囀り声を出すこともあるパフ。これは主にリラックスしている時や、子どもと優しくコミュニケーションを取る時に聞かれる声なんだよ。竹林の中で響くこの声は、本当に小鳥と聞き間違えてしまうほどそっくりパフ！パンダの声のレパートリーの広さを物語る、貴重な鳴き声の一つだよ。",
  },
  {
    id: 12,
    audioUrl: "/audio/bird.mp3",
    isRealPanda: false,
    animalLabel: "小鳥",
    emoji: "🐦",
    imageUrl: birdImg,
    detailImageUrl: birdPhoto,
    pairId: "bird",
    type: "fake",
    explanation:
      "これは本物の小鳥の声だったパフ！パンダの囀りと本当によく似ているけど、小鳥の方がリズミカルなんだよ。",
    longDescription:
      "小鳥の囀りは、縄張りの主張やパートナーへのアピール、仲間への合図など、様々な目的で使われるパフ。鳥の種類によって囀りのパターンは大きく異なり、約1万種類もの鳥がそれぞれ独自の歌を持っているんだよ。朝の「夜明けの大合唱」は、世界中の自然界で最も豊かな音楽の一つパフ。パンダの小鳥っぽい声と聞き比べると、本物の小鳥はより複雑なメロディーを奏でているんだよ！",
  },
  // Kitten pair
  {
    id: 13,
    audioUrl: "/audio/panda-kitten.mp3",
    isRealPanda: true,
    animalLabel: "子パンダ（子猫声）",
    emoji: "🐼",
    imageUrl: babyPandaImg,
    detailImageUrl: pandaPhoto,
    pairId: "kitten",
    type: "panda",
    explanation:
      "赤ちゃんパンダは子猫のような「ニャー」に近い甘え声も出すんだパフ！本当に子猫みたいで可愛いよね。",
    longDescription:
      "赤ちゃんパンダの鳴き声のバリエーションはとても豊かで、時に子猫の「ニャー」という声にそっくりな鳴き方をするパフ。この声はお母さんパンダに「抱っこして」「もっとそばにいて」とおねだりする時に出すことが多いんだよ。動物園の飼育員さんも、赤ちゃんパンダの部屋から子猫の声が聞こえてきて二度見することがあるんだって！パンダの可愛さがあふれる、貴重な鳴き声パフ。",
  },
  {
    id: 14,
    audioUrl: "/audio/kitten.mp3",
    isRealPanda: false,
    animalLabel: "子猫",
    emoji: "🐱",
    imageUrl: kittenImg,
    detailImageUrl: kittenPhoto,
    pairId: "kitten",
    type: "fake",
    explanation:
      "これは本物の子猫の声だったパフ！子パンダの甘え声とそっくりで、博士でも間違えそうになるパフ💦",
    longDescription:
      "子猫は生後2〜3週間で「ニャー」と鳴き始めるパフ。この声はお母さん猫に空腹や寒さ、不安を伝えるための大切なサインなんだよ。面白いことに、大人になった猫が「ニャー」と鳴くのは、ほぼ人間に対してだけ。猫同士はあまりこの声を使わないんだパフ。子パンダの甘え声とそっくりなのは、哺乳類の赤ちゃんに共通する「親を呼ぶ周波数」の鳴き声だからなんだよ！",
  },
  // Ojisan pair (the funny one!)
  {
    id: 15,
    audioUrl: "/audio/panda-ojisan.mp3",
    isRealPanda: true,
    animalLabel: "パンダ（おじさん声）",
    emoji: "🐼",
    imageUrl: pandaShoutImg,
    detailImageUrl: pandaPhoto,
    pairId: "ojisan",
    type: "panda",
    explanation:
      "信じられないかもしれないけど、これは本物のパンダの声なんだパフ！おじさんが咳払いしてるみたいだよね😂",
    longDescription:
      "驚愕パフ！パンダはなんと、人間のおじさんが咳払いや唸り声をあげているような、低くて渋い声を出すことがあるんだパフ。これは大人のオスパンダが縄張りを主張したり、不機嫌な気持ちを表現する時の声なんだよ。初めて聞いた人は必ず「人間が混じってる！？」と二度見するくらいそっくり。パンダの声の不思議さを最も体現する、伝説の鳴き声パフ！",
  },
  {
    id: 16,
    audioUrl: "/audio/ojisan.mp3",
    isRealPanda: false,
    animalLabel: "おじさん",
    emoji: "🧔",
    imageUrl: ojisanImg,
    detailImageUrl: ojisanPhoto,
    pairId: "ojisan",
    type: "fake",
    specialWrongReaction: "それはただの人間パフ！おじさんに騙されちゃダメパフ〜😂",
    explanation:
      "これは本物の人間のおじさんの声だったパフ！パンダの声とそっくりで、博士もよく騙されるパフ…🧔",
    longDescription:
      "正解はおじさんパフ！人間の中年男性が出す咳払いや唸り声は、なぜか大人のオスパンダの低い唸り声と驚くほど似ているんだよ。これは「低い周波数で威厳を示す」という哺乳類共通の音声表現の特徴なんだパフ。動物園で「あれ、どこかでおじさんの声が…」と思ったら、実はパンダだった！というエピソードも実際にあるんだって。生き物の声って本当に奥深いパフ。",
  },
];
