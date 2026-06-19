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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const t = searchParams.get("tier");
    const tier = isTier(t) ? TIERS[t] : null;
    const fontData = await loadFont();

    const fonts = [
      { name: "Pretendard", data: fontData, style: "normal" as const, weight: 700 as const },
    ];
    const opts = { width: 1200, height: 630, fonts, emoji: "twemoji" as const };

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
            }}
          >
            <div style={{ fontSize: 200, marginBottom: 20 }}>💩</div>
            <div style={{ fontSize: 72, color: "#2A2018", letterSpacing: "-0.03em" }}>
              급똥 감(感)능력 테스트
            </div>
            <div style={{ fontSize: 28, color: "#6E4B2A", marginTop: 20 }}>
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
            background: "#E7D2AE",
            padding: 60,
            fontFamily: "Pretendard",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "#FBF4E6",
              borderRadius: 32,
              padding: 56,
              border: "3px solid #E7DCC6",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 22,
                color: "#6E4B2A",
                borderBottom: "2px dashed #E0D4BC",
                paddingBottom: 20,
              }}
            >
              <div>🔬 대한급똥감수성연구소</div>
              <div style={{ color: "#A9997F" }}>REPORT</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 40 }}>
              <div style={{ fontSize: 160, lineHeight: 1 }}>{tier.emoji}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 24, color: "#A9997F" }}>최종 판정</div>
                <div
                  style={{
                    fontSize: 72,
                    color: tier.accent,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    marginTop: 6,
                  }}
                >
                  {tier.name}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: tier.soft,
                borderRadius: 20,
                padding: 28,
                marginTop: 36,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div style={{ fontSize: 26, color: "#6A5A47" }}>똥감지수</div>
                <div style={{ fontSize: 64, color: tier.accent, display: "flex", alignItems: "baseline" }}>
                  {idx}
                  <span style={{ fontSize: 32 }}>%</span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 28,
              }}
            >
              <div style={{ fontSize: 26, color: "#6A5A47" }}>나의 똥감 유형은? 👉</div>
              <div
                style={{
                  border: `4px solid ${tier.accent}`,
                  color: tier.accent,
                  fontSize: 26,
                  padding: "10px 22px",
                  borderRadius: 12,
                  transform: "rotate(-7deg)",
                }}
              >
                {tier.top}
              </div>
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
