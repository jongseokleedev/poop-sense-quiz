export type TierKey = "master" | "sangtachi" | "buhok" | "psycho";

export type Tier = {
  key: TierKey;
  name: string;
  emoji: string;
  accent: string;
  soft: string;
  top: string;
  description: string;
  metrics: { label: string; value: string }[];
};

export const TIERS: Record<TierKey, Tier> = {
  master: {
    key: "master",
    name: "급똥 마스터",
    emoji: "🚨",
    accent: "#E0452A",
    soft: "#FCE9E3",
    top: "상위 5%",
    description:
      "함께 있는 누군가가 똥 마렵다고 하면, 내가 마려운 게 아닌데도 심장이 빠르게 뛰고 식은땀이 흐를 확률이 높습니다. 똥 마려운 사람이 얼마나 괴롭고 외로운지 누구보다 잘 이해하고 있습니다.",
    metrics: [
      { label: "위급반응속도", value: "0.3초" },
      { label: "화장실 탐색력", value: "S 등급" },
      { label: "타인 공감 수용성", value: "98%" },
      { label: "휴지 상시 보유율", value: "100%" },
    ],
  },
  sangtachi: {
    key: "sangtachi",
    name: "똥감능력 상타치",
    emoji: "🧭",
    accent: "#E8A11C",
    soft: "#FBF0D7",
    top: "상위 33%",
    description:
      "누군가가 똥이 마려울 때 빠르게 화장실 위치를 스캔해줍니다. 상대방을 진심으로 걱정하고 응원하지만, 지금 나에게 닥친 위기는 아니기 때문에 마음은 평온합니다.",
    metrics: [
      { label: "위급반응속도", value: "1.2초" },
      { label: "화장실 탐색력", value: "A 등급" },
      { label: "타인 공감 수용성", value: "74%" },
      { label: "휴지 상시 보유율", value: "52%" },
    ],
  },
  buhok: {
    key: "buhok",
    name: "똥감능력 부족",
    emoji: "🌫️",
    accent: "#8A5A33",
    soft: "#F0E6D8",
    top: "상위 71%",
    description:
      "위급했던 순간이 분명 있었던 것 같은데 기억에서 많이 사라진 단계입니다. 또다시 급똥이 찾아올 수 있다는 생각이 들지 않고, 마치 남의 일처럼 느껴집니다.",
    metrics: [
      { label: "위급반응속도", value: "4.8초" },
      { label: "화장실 탐색력", value: "C 등급" },
      { label: "타인 공감 수용성", value: "41%" },
      { label: "휴지 상시 보유율", value: "12%" },
    ],
  },
  psycho: {
    key: "psycho",
    name: "싸이코패스",
    emoji: "🧊",
    accent: "#5B4B8A",
    soft: "#EAE6F5",
    top: "극희귀 0.6%",
    description:
      "최고로 건강한 장을 보유한 당신은 급똥을 경험해본 적조차 없는 기만자입니다. 상황의 위급성을 전혀 인지하지 못하며, 상대방에게 '아 그냥 좀만 참아'라는 폭언까지 휘두를 수 있습니다. 똥감수성을 키우기 위해 많은 노력과 공부가 필요합니다.",
    metrics: [
      { label: "위급반응속도", value: "측정불가" },
      { label: "화장실 탐색력", value: "F 등급" },
      { label: "타인 공감 수용성", value: "3%" },
      { label: "휴지 상시 보유율", value: "0%" },
    ],
  },
};

export const TIER_INDEX: Record<TierKey, number> = {
  psycho: 0,
  buhok: 38,
  sangtachi: 63,
  master: 100,
};
