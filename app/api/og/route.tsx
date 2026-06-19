import { ImageResponse } from "next/og";
import { TIERS, TIER_INDEX, type TierKey } from "../../tiers";

export const runtime = "edge";

const isTier = (k: string | null): k is TierKey =>
  k === "master" || k === "sangtachi" || k === "buhok" || k === "psycho";

const FONT_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf";

let fontCache: ArrayBuffer | null = null;
async function loadFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;
  const res = await fetch(FONT_URL);
  fontCache = await res.arrayBuffer();
  return fontCache;
}

const SIZE = 1200;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const t = searchParams.get("tier");
    const tier = isTier(t) ? TIERS[t] : null;
    const fontData = await loadFont();

    const fonts = [
      { name: "Pretendard", data: fontData, style: "normal" as const, weight: 700 as const },
    ];
    const opts = { width: SIZE, height: SIZE, fonts, emoji: "twemoji" as const };

    if (!tier) {
      return new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#E7D2AE",
              fontFamily: "Pretendard",
              gap: 32,
            }}
          >
            <div style={{ fontSize: 460, lineHeight: 1, display: "flex" }}>💩</div>
            <div
              style={{
                fontSize: 96,
                color: "#2A2018",
                letterSpacing: "-0.03em",
                display: "flex",
                textAlign: "center",
              }}
            >
              급똥 감(感)능력 테스트
            </div>
            <div style={{ fontSize: 36, color: "#6E4B2A", display: "flex" }}>
              🔬 대한급똥감수성연구소
            </div>
          </div>
        ),
        opts
      );
    }

    const idx = TIER_INDEX[tier.key];

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: tier.soft,
            fontFamily: "Pretendard",
            padding: 80,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 60,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              fontSize: 36,
              color: "#6E4B2A",
            }}
          >
            🔬 대한급똥감수성연구소
          </div>

          <div
            style={{
              fontSize: 560,
              lineHeight: 1,
              display: "flex",
              marginBottom: 20,
            }}
          >
            {tier.emoji}
          </div>

          <div
            style={{
              fontSize: 120,
              color: tier.accent,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              display: "flex",
              marginTop: 20,
            }}
          >
            {tier.name}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              marginTop: 36,
            }}
          >
            <div style={{ fontSize: 44, color: "#6A5A47", display: "flex" }}>똥감지수</div>
            <div
              style={{
                fontSize: 110,
                color: tier.accent,
                display: "flex",
                alignItems: "baseline",
                lineHeight: 1,
              }}
            >
              {idx}
              <span style={{ fontSize: 56 }}>%</span>
            </div>
            <div
              style={{
                display: "flex",
                border: `5px solid ${tier.accent}`,
                color: tier.accent,
                fontSize: 34,
                padding: "10px 22px",
                borderRadius: 14,
                transform: "rotate(-7deg)",
                background: "#FBF4E6",
                marginLeft: 8,
              }}
            >
              {tier.top}
            </div>
          </div>
        </div>
      ),
      opts
    );
  } catch (e) {
    return new Response(`OG error: ${(e as Error).message}`, { status: 500 });
  }
}
