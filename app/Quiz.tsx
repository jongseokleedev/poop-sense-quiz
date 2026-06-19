"use client";

import { useEffect, useRef, useState } from "react";
import { TIERS, type Tier, type TierKey } from "./tiers";
import { track } from "./analytics";

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (opts: object) => void;
      };
    };
  }
}

const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";

const QUESTIONS = [
  "지하철을 탈 때, 개찰구 안쪽에 화장실이 있는 역이 어딘지 체크한 적이 있다.",
  "위급 상황에서 사람들 눈치 보지 않고 화장실로 전속력으로 달려간 적이 있다.",
  "고속버스에서 기사님께 차를 세워달라고 간청한 적이 있다.",
  "중요한 약속이 있는 전날엔 자극적인 음식을 먹지 않는다.",
  "신께 '이번만 넘어가주시면 앞으로 진짜 적당히 먹고 착하게 살게요' 빌어본 적이 있다.",
  "데이트에서 똥 마려운 티를 내지 않으려고 기를 쓰며 노력한 적이 있다.",
  "언제 어디서든 위급상황이 올 수 있어서 항상 휴지를 챙겨다닌다.",
  "시험을 보다가 감독관과 함께 화장실에 간 적이 있다.",
];

function pickTier(score: number): Tier {
  if (score >= 7) return TIERS.master;
  if (score >= 4) return TIERS.sangtachi;
  if (score >= 1) return TIERS.buhok;
  return TIERS.psycho;
}

type Screen = "intro" | "quiz" | "result";

export default function Page() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(8).fill(null));
  const [toast, setToast] = useState("");
  const [reportId, setReportId] = useState("");
  const [reportDate, setReportDate] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setReportId(String(Math.floor(1000 + Math.random() * 9000)));
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    setReportDate(`${y}.${m}.${day}`);

    const params = new URLSearchParams(window.location.search);
    const r = params.get("r");
    if (r && (r === "master" || r === "sangtachi" || r === "buhok" || r === "psycho")) {
      track("result_view_from_share", { referred_tier: r });
    }

    const key = process.env.NEXT_PUBLIC_KAKAO_KEY;
    if (!key || typeof document === "undefined") return;
    if (document.getElementById("kakao-sdk")) return;
    const s = document.createElement("script");
    s.id = "kakao-sdk";
    s.src = KAKAO_SDK_URL;
    s.async = true;
    s.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(key);
      }
    };
    document.head.appendChild(s);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2100);
  };

  const start = () => {
    setAnswers(Array(8).fill(null));
    setStep(0);
    setScreen("quiz");
    track("quiz_start");
  };

  const answer = (val: boolean) => {
    const next = [...answers];
    next[step] = val;
    setAnswers(next);
    track("question_answered", { step: step + 1, answer: val });
    if (step < 7) {
      setStep(step + 1);
    } else {
      const finalScore = next.filter((a) => a === true).length;
      const finalTier = pickTier(finalScore);
      track("quiz_completed", {
        tier: finalTier.key,
        score: finalScore,
        idx: Math.round((finalScore / 8) * 100),
      });
      setScreen("result");
    }
  };

  const back = () => {
    if (step === 0) {
      setScreen("intro");
    } else {
      setStep(step - 1);
    }
  };

  const restart = () => {
    track("restart_click", { from_tier: tier.key });
    setAnswers(Array(8).fill(null));
    setStep(0);
    setScreen("intro");
  };

  const score = answers.filter((a) => a === true).length;
  const idx = Math.round((score / 8) * 100);
  const tier = pickTier(score);

  const resultUrl = (channel: "kakao" | "copy") => {
    if (typeof window === "undefined") return "";
    const u = new URL(window.location.href);
    u.search = "";
    u.searchParams.set("r", tier.key);
    u.searchParams.set("v", "2");
    u.searchParams.set("utm_source", channel);
    u.searchParams.set("utm_medium", channel === "kakao" ? "social" : "referral");
    u.searchParams.set("utm_campaign", "result_share");
    u.searchParams.set("utm_content", tier.key);
    return u.toString();
  };

  const shareKakao = () => {
    track("share_click", { channel: "kakao", tier: tier.key });
    const url = resultUrl("kakao");
    const ogImage = `${window.location.origin}/api/og?tier=${tier.key}&v=2`;
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      showToast("카카오 SDK가 아직 로드되지 않았어요");
      return;
    }
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${tier.emoji} ${tier.name}`,
        description: `친구의 똥감지수: ${idx}%`,
        imageUrl: ogImage,
        imageWidth: 1200,
        imageHeight: 1200,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [
        { title: "테스트하기", link: { mobileWebUrl: url, webUrl: url } },
      ],
    });
  };
  const shareLink = async () => {
    track("share_click", { channel: "link", tier: tier.key });
    try {
      await navigator.clipboard.writeText(resultUrl("copy"));
    } catch {}
    showToast("🔗 링크가 복사됐어요!");
  };

  return (
    <div className="app">
      {screen === "intro" && (
        <div className="intro">
          <div className="lab-badge">🔬 대한급똥감수성연구소</div>
          <div className="hero">
            <div className="hero-emoji">💩</div>
            <div className="kicker">URGENT POOP TEST</div>
            <h1 className="title">
              급똥 감(感)능력
              <br />
              테스트
            </h1>
            <p className="subhead">
              지하철에서, 데이트 중에, 시험장에서.
              <br />
              당신은 급똥의 위기를 얼마나 예민하게 감지하나요?
            </p>
          </div>
          <div className="meta-row">
            <span>📋 문항 8개</span>
            <span className="divider">|</span>
            <span>⏱ 약 30초</span>
          </div>
          <button className="cta" onClick={start}>
            테스트 시작하기
          </button>
          <p className="fine-print">본 테스트는 의학적 근거가 1도 없습니다 🤫</p>
        </div>
      )}

      {screen === "quiz" && (
        <div className="quiz">
          <div className="q-header">
            <button className="back-btn" onClick={back} aria-label="back">
              ←
            </button>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${((step + 1) / 8) * 100}%` }}
              />
            </div>
            <div className="counter mono">{step + 1}/8</div>
          </div>
          <div className="card-body">
            <div className="question-block" key={step}>
              <div className="q-num mono">Q.{step + 1}</div>
              <div className="lead-in">나는...</div>
              <h2 className="statement">{QUESTIONS[step]}</h2>
            </div>
          </div>
          <div className="answers">
            <button className="answer yes" onClick={() => answer(true)}>
              <span>🙋</span>
              <span>네, 그래요</span>
            </button>
            <button className="answer no" onClick={() => answer(false)}>
              <span>🙅</span>
              <span>아니요</span>
            </button>
          </div>
        </div>
      )}

      {screen === "result" && (
        <div className="result">
          <div className="result-header">
            <div className="lab-label">🔬 대한급똥감수성연구소</div>
            <div className="lab-title">검사 결과가 나왔어요</div>
          </div>

          <div className="report-card">
            <div className="report-meta mono">
              <span>REPORT No.{reportId}</span>
              <span>{reportDate}</span>
            </div>

            <div className="type-header">
              <div className="tier-emoji">{tier.emoji}</div>
              <div>
                <div className="type-meta-label">최종 판정</div>
                <div className="tier-name" style={{ color: tier.accent }}>
                  {tier.name}
                </div>
              </div>
            </div>

            <div className="index-block" style={{ background: tier.soft }}>
              <div className="index-row">
                <span className="index-label">똥감지수</span>
                <span className="index-value mono" style={{ color: tier.accent }}>
                  {idx}
                  <span className="pct">%</span>
                </span>
              </div>
              <div className="percentile-wrap">
                <div className="percentile-bar">
                  <div className="percentile-marker" style={{ left: `${idx}%` }} />
                </div>
                <div className="scale-labels">
                  <span>싸이코패스</span>
                  <span>부족</span>
                  <span>상타치</span>
                  <span>마스터</span>
                </div>
              </div>
            </div>

            <div>
              {tier.metrics.map((m) => (
                <div className="metric-row" key={m.label}>
                  <span className="metric-label">{m.label}</span>
                  <span className="metric-value mono">{m.value}</span>
                </div>
              ))}
            </div>

            <div
              className="stamp"
              style={{ borderColor: tier.accent, color: tier.accent }}
            >
              {tier.name} 판정
            </div>
            <div style={{ clear: "both" }} />
          </div>

          <div className="diagnosis">
            <h3 style={{ color: tier.accent }}>📖 진단 소견</h3>
            <p>{tier.description}</p>
          </div>

          <div className="friend-hook">
            <div className="emoji">🤔</div>
            <div className="heading">
              내 친구는 싸이코패스일까,
              <br />
              급똥 마스터일까?
            </div>
            <div className="sub">테스트를 공유하고 친구의 똥감 유형도 확인해보세요 👇</div>
          </div>

          <div className="share-row">
            <button className="share-btn share-kakao" onClick={shareKakao}>
              💬 카카오톡
            </button>
            <button className="share-btn share-link share-link-inline" onClick={shareLink}>
              🔗 링크 복사
            </button>
          </div>

          <button className="restart" onClick={restart}>
            🔄 다시 테스트하기
          </button>
          <div className="footer">대한급똥감수성연구소 · 공유는 사랑입니다 💛</div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
