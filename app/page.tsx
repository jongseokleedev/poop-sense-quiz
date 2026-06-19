import type { Metadata } from "next";
import Quiz from "./Quiz";
import { TIERS, type TierKey } from "./tiers";

const SITE = "https://poop-sense-quiz.vercel.app";

type Props = { searchParams: { r?: string } };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const raw = searchParams?.r;
  const isTier = (k: string): k is TierKey =>
    k === "master" || k === "sangtachi" || k === "buhok" || k === "psycho";
  const tier = raw && isTier(raw) ? TIERS[raw] : null;

  const title = tier
    ? `${tier.emoji} ${tier.name} | 급똥 감(感)능력 테스트`
    : "급똥 감(感)능력 테스트";
  const description = tier
    ? `친구의 결과: "${tier.name}" — 나의 똥감 유형도 확인해보세요!`
    : "지하철에서, 데이트 중에, 시험장에서. 당신은 급똥의 위기를 얼마나 예민하게 감지하나요?";
  const ogUrl = tier ? `${SITE}/api/og?tier=${tier.key}&v=2` : `${SITE}/api/og?v=2`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: tier ? `${SITE}/?r=${tier.key}` : SITE,
      siteName: "대한급똥감수성연구소",
      images: [{ url: ogUrl, width: 1200, height: 1200 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default function Page() {
  return <Quiz />;
}
