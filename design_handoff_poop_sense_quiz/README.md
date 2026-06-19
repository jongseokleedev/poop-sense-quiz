# Handoff: 급똥 감(感)능력 테스트 (Urgent-Poop Sense Quiz)

## Overview
A lightweight, mobile-first **viral personality quiz** in the well-known Korean "테스트" share format. The user answers 8 yes/no statements one card at a time, and receives a "검사 리포트" (lab-report) style result classifying their "똥감지수" (poop-sense index) into one of four types. The result screen is built for sharing to KakaoTalk / Instagram Stories / copy-link, with a "내 친구는 어떤 유형?" hook to drive further shares.

Three screens: **Intro → Quiz (8 cards) → Result (report)**.

## About the Design Files
The file in this bundle (`급똥감능력테스트.dc.html`) is a **design reference created in HTML** — a working prototype showing the intended look, copy, and behavior. It is **not production code to copy directly**.

The task is to **recreate this design in the target codebase's existing environment** (React, Next.js, Vue, etc.) using its established component patterns, styling approach, and routing. If no environment exists yet, choose the most appropriate framework for a small shareable web quiz (a single-page React/Next app is a natural fit) and implement there.

> Note: it is authored as a "Design Component" (a streaming HTML format) — ignore the `<x-dc>`/`support.js` scaffolding and `{{ }}` template holes; they are an authoring convenience, not part of the spec. All logic is plain React-style class state and is described in full below.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions are all specified. Recreate the UI to match, using the target codebase's libraries where equivalents exist.

## Tech notes
- **Mobile-first.** Designed for a single phone-width column, `max-width: 430px`, centered on a caramel backdrop (`#E7D2AE`). The app surface is warm paper (`#FBF4E6`).
- **Korean-first copy.** All UI text is Hangul; preserve exactly as written.
- **Fonts:** [Pretendard](https://github.com/orioncactus/pretendard) for all UI text; **DM Mono** (Google Fonts, weights 400/500) for numeric/lab data (Q counter, report numbers, 똥감지수, metric values).
- **Emoji** are used intentionally as the visual language (no custom icon set). Keep them.

---

## Screens / Views

### 1. Intro
- **Purpose:** Hook the user and start the test.
- **Layout:** Full-height vertical flex, padding `48px 28px 32px`. Top: centered pill badge. Middle (flex:1, centered): hero. Bottom: meta row + CTA + fine print.
- **Components:**
  - **Lab badge** (top, centered): white pill, `1.5px solid #E7DCC6`, padding `7px 14px`, radius `999px`, `12.5px / 700`, color `#6E4B2A`. Text: `🔬 대한급똥감수성연구소`.
  - **Hero emoji** `💩` at `96px`, gentle bob animation (`rb-bob`, 2.6s ease-in-out infinite: translateY 0→-10px and rotate -3deg→3deg).
  - **Kicker:** `URGENT POOP TEST`, `13px / 800`, color `#E0452A`, letter-spacing `.14em`.
  - **Title** `<h1>`: `급똥 감(感)능력<br>테스트`, `42px / 800`, line-height `1.14`, letter-spacing `-.03em`, color `#2A2018`.
  - **Subhead** `<p>`: `지하철에서, 데이트 중에, 시험장에서.<br>당신은 급똥의 위기를 얼마나 예민하게 감지하나요?`, `15.5px`, line-height `1.65`, color `#6A5A47`, `word-break: keep-all`, max-width `320px`.
  - **Meta row:** `📋 문항 8개` · divider `|` (`#D8CAB0`) · `⏱ 약 30초`, `13px / 600`, color `#8A7860`.
  - **Start CTA** (full width): bg `#2A2018`, text `#FBF4E6`, `18px / 800`, padding `18px`, radius `16px`, **drop "shadow" `box-shadow: 0 6px 0 #6E4B2A`** (solid offset, button-press look). Active: `scale(.97)` + `brightness(.96)`. Text: `테스트 시작하기`.
  - **Fine print:** `본 테스트는 의학적 근거가 1도 없습니다 🤫`, `12px`, color `#A9997F`.

### 2. Quiz (one card per question, 8 total)
- **Purpose:** Collect 8 yes/no answers, advancing automatically on each tap.
- **Layout:** Full-height vertical flex, padding `20px 24px 28px`. Header row (back + progress bar + counter), then card body (flex:1) with statement at top and answer buttons pinned to bottom.
- **Components:**
  - **Header row** (flex, gap `12px`, align center):
    - **Back button** `←`, `22px`, color `#6A5A47`, transparent. Goes to previous question, or back to Intro from Q1.
    - **Progress track:** flex:1, height `8px`, bg `#ECE0C8`, radius `999px`. **Fill:** bg `#E0452A`, width = `((step+1)/8)*100%`, `transition: width .35s cubic-bezier(.4,0,.2,1)`.
    - **Counter:** `{n}/8`, DM Mono `13px / 700`, color `#6A5A47`, min-width `36px`, right-aligned.
  - **Card body** (re-mounts per question via React `key={step}`, animates in with `rb-up`: opacity 0→1, translateY 16px→0, `.35s ease`):
    - **Q number:** `Q.{n}`, DM Mono `14px / 500`, color `#E0452A`, letter-spacing `.04em`.
    - **Lead-in:** `나는...`, `13px / 700`, color `#B07A3A`.
    - **Statement** `<h2>`: `25px / 800`, line-height `1.42`, letter-spacing `-.02em`, color `#2A2018`, `word-break: keep-all`.
    - **Answer buttons** (flex **row**, gap `12px`, each flex:1):
      - **네, 그래요** (LEFT): bg `#2A2018`, text `#FBF4E6`, no border. Records `true`.
      - **아니요** (RIGHT): bg `#FFFFFF`, `2px solid #DBCDAF`, text `#6A5A47`. Records `false`.
      - Both: `17px / 800`, padding `18px`, radius `14px`, centered with `🙋` / `🙅` emoji (gap `8px`). Active: `scale(.97)` + `brightness(.96)`.

**The 8 statements** (exact copy, asked in order):
1. `지하철을 탈 때, 개찰구 안쪽에 화장실이 있는 역이 어딘지 체크한 적이 있다.`
2. `위급 상황에서 사람들 눈치 보지 않고 화장실로 전속력으로 달려간 적이 있다.`
3. `고속버스에서 기사님께 차를 세워달라고 간청한 적이 있다.`
4. `중요한 약속이 있는 전날엔 자극적인 음식을 먹지 않는다.`
5. `신께 '이번만 넘어가주시면 앞으로 진짜 적당히 먹고 착하게 살게요' 빌어본 적이 있다.`
6. `데이트에서 똥 마려운 티를 내지 않으려고 기를 쓰며 노력한 적이 있다.`
7. `언제 어디서든 위급상황이 올 수 있어서 항상 휴지를 챙겨다닌다.`
8. `시험을 보다가 감독관과 함께 화장실에 간 적이 있다.`

### 3. Result (lab report)
- **Purpose:** Show the user's type + index, then prompt sharing.
- **Layout:** Vertical flex, gap `18px`, padding `32px 22px 36px`. Animates in with `rb-pop` (opacity 0→1, scale .92→1, `.4s ease`). Sections top→bottom: header → report card → 진단 소견 → friend hook → share buttons → restart → footer.
- **Header:** centered. `🔬 대한급똥감수성연구소` (`12.5px / 700`, `#6E4B2A`) over `검사 결과가 나왔어요` (`21px / 800`, `#2A2018`).
- **Report card** — white, `1.5px solid #E7DCC6`, radius `18px`, padding `22px`, `box-shadow: 0 6px 20px rgba(80,50,20,.07)`:
  - **Meta row:** `REPORT No.{id}` (left) / `{date}` (right). DM Mono `11.5px`, color `#A9997F`, `1px dashed #E0D4BC` bottom border, padding-bottom `12px`. `id` = random 4-digit `1000–9999`, generated once per session. `date` = today as `YYYY.MM.DD`.
  - **Type header** (flex, gap `12px`): tier emoji at `46px`; right column = `최종 판정` label (`12px / 700`, `#A9997F`) over tier name (`24px / 800`, letter-spacing `-.02em`, color = **tier accent**).
  - **Index block** — bg = **tier soft color**, radius `12px`, padding `16px`:
    - Row: `똥감지수` (`13px / 700`, `#6A5A47`) and big value `{idx}%` (DM Mono `30px / 500`, color = tier accent; the `%` at `16px`).
    - **Percentile bar:** height `12px`, radius `999px`, bg `linear-gradient(90deg, #C9BBA0 0%, #E8A11C 50%, #E0452A 100%)`. **Marker:** `20px` circle, bg `#2A2018`, `3px solid #FFFFFF`, `box-shadow: 0 1px 4px rgba(0,0,0,.3)`, positioned `left: {idx}%`, `translateX(-50%)`, `top: -4px`.
    - **Scale labels** under bar (space-between, `10.5px / 600`, `#A9997F`): `싸이코패스` · `부족` · `상타치` · `마스터`.
  - **Metric rows** (one per tier metric): label (`13.5px`, `#6A5A47`) left / value (DM Mono `14px / 500`, `#2A2018`) right, each with `1px solid #F0E8D8` bottom border, padding `11px 0`.
  - **Stamp:** bottom-right, `2.5px solid` tier accent, color tier accent, `13px / 800`, padding `6px 14px`, radius `8px`, `transform: rotate(-7deg)`, opacity `.9`. Text: `{tier name} 판정`.
- **진단 소견 (diagnosis):** white card, `1.5px solid #E7DCC6`, radius `16px`, padding `20px`. Heading `📖 진단 소견` (`13px / 800`, tier accent). Body = tier description (`14.5px`, line-height `1.72`, color `#4A3E30`, `word-break: keep-all`).
- **Friend hook:** dark card bg `#2A2018`, radius `16px`, padding `20px`, centered, text `#FBF4E6`. `🤔` (`28px`) / `내 친구는 싸이코패스일까,<br>급똥 마스터일까?` (`16px / 800`, line-height `1.4`) / `테스트를 공유하고 친구의 똥감 유형도 확인해보세요 👇` (`13px`, `#C7B79E`).
- **Share buttons:**
  - Row (flex, gap `10px`, each flex:1): **카카오톡** — bg `#FEE500`, text `#3A1D1D`, `💬 카카오톡`; **인스타 스토리** — bg `linear-gradient(105deg, #F9CE34, #EE2A7B 48%, #6228D7)`, text `#FFFFFF`, `📸 인스타 스토리`.
  - Full-width below: **링크 복사하기** — `2px solid #DBCDAF`, white bg, text `#6A5A47`, `🔗 링크 복사하기`.
  - All: `14.5px / 800`, radius `13px`, padding ~`14–15px`. Active: `scale(.97)`+`brightness(.96)`.
- **Restart:** text button `🔄 다시 테스트하기`, transparent, `14px / 700`, color `#A9997F`.
- **Footer:** `대한급똥감수성연구소 · 공유는 사랑입니다 💛`, `11.5px`, `#BBAB91`, centered.
- **Toast** (fixed, bottom `36px`, centered): bg `#2A2018`, text `#FBF4E6`, `13.5px / 700`, padding `13px 22px`, radius `999px`, `box-shadow: 0 8px 24px rgba(0,0,0,.25)`. Auto-shows ~2.1s with `rb-toast` (fade/slide in & out).

---

## Result tiers (scoring)
`score` = count of `네, 그래요` answers (0–8). `똥감지수 (idx)` = `round(score / 8 * 100)`.

| score | key | 이름 (name) | emoji | accent | soft bg | 상위(top) |
|---|---|---|---|---|---|---|
| 7–8 | master | 급똥 마스터 | 🚨 | `#E0452A` | `#FCE9E3` | 상위 5% |
| 4–6 | sangtachi | 똥감능력 상타치 | 🧭 | `#E8A11C` | `#FBF0D7` | 상위 33% |
| 1–3 | buhok | 똥감능력 부족 | 🌫️ | `#8A5A33` | `#F0E6D8` | 상위 71% |
| 0 | psycho | 싸이코패스 | 🧊 | `#5B4B8A` | `#EAE6F5` | 0.6% (극희귀) |

> `top` is fabricated flavor text (the playful "상위 N%"). It is **not** currently rendered in the report layout (it was used by removed result styles) — keep it available if you later add a card/share-image variant, otherwise it can be dropped.

**Descriptions** (exact copy):
- **급똥 마스터:** `함께 있는 누군가가 똥 마렵다고 하면, 내가 마려운 게 아닌데도 심장이 빠르게 뛰고 식은땀이 흐를 확률이 높습니다. 똥 마려운 사람이 얼마나 괴롭고 외로운지 누구보다 잘 이해하고 있습니다.`
- **똥감능력 상타치:** `누군가가 똥이 마려울 때 빠르게 화장실 위치를 스캔해줍니다. 상대방을 진심으로 걱정하고 응원하지만, 지금 나에게 닥친 위기는 아니기 때문에 마음은 평온합니다.`
- **똥감능력 부족:** `위급했던 순간이 분명 있었던 것 같은데 기억에서 많이 사라진 단계입니다. 또다시 급똥이 찾아올 수 있다는 생각이 들지 않고, 마치 남의 일처럼 느껴집니다.`
- **싸이코패스:** `최고로 건강한 장을 보유한 당신은 급똥을 경험해본 적조차 없는 기만자입니다. 상황의 위급성을 전혀 인지하지 못하며, 상대방에게 '아 그냥 좀만 참아'라는 폭언까지 휘두를 수 있습니다. 똥감수성을 키우기 위해 많은 노력과 공부가 필요합니다.`

**Metric rows per tier** (label → value):

| metric | master | sangtachi | buhok | psycho |
|---|---|---|---|---|
| 위급반응속도 | 0.3초 | 1.2초 | 4.8초 | 측정불가 |
| 화장실 탐색력 | S 등급 | A 등급 | C 등급 | F 등급 |
| 타인 공감 수용성 | 98% | 74% | 41% | 3% |
| 휴지 상시 보유율 | 100% | 52% | 12% | 0% |

---

## Interactions & Behavior
- **Tap an answer** → record `true`/`false` into `answers[step]`; if `step < 7` advance to next card, else compute result and go to Result. Auto-advance (no separate "next" button).
- **Back** → previous question; from Q1 returns to Intro.
- **Restart** → reset to Intro with a fresh empty `answers` array.
- **Share buttons** are demo-only (no real SDK wired): each shows a toast.
  - 카카오톡 → toast `카카오톡 공유창을 여는 중... (데모)`
  - 인스타 스토리 → toast `인스타 스토리로 공유합니다 (데모)`
  - 링크 복사 → `navigator.clipboard.writeText(location.href)` (wrapped in try/catch) + toast `🔗 링크가 복사됐어요!`
  - **In production:** wire 카카오톡 to the Kakao JS SDK `Kakao.Share.sendDefault` (custom feed template with the result type/index as OG image), Instagram to a downloadable/shareable story image, and link-copy to the canonical quiz URL (optionally with a `?r={type}` param for a tailored OG preview).
- **Animations:** `rb-up` (card entrance, .35s), `rb-pop` (result entrance, .4s), `rb-bob` (intro emoji loop, 2.6s), `rb-toast` (toast in/out, 2.2s). Button press = `scale(.97)` + `brightness(.96)` on `:active`.
- **Responsive:** single fixed-width column (max 430px) centered; backdrop fills the rest. No desktop layout — treat as a mobile web page / webview.

## State Management
- `screen`: `'intro' | 'quiz' | 'result'`
- `step`: `0–7` (current question index)
- `answers`: `(boolean|null)[8]`
- `toast`: string (`''` = hidden); auto-cleared after ~2.1s via timeout
- `reportId`: 4-digit string, generated once on mount
- `reportDate`: `YYYY.MM.DD`, set once on mount
- **Derived:** `score = answers.filter(a => a===true).length`; `idx = round(score/8*100)`; `tier` chosen by score thresholds (7+/4+/1+/else).
- No data fetching. Fully client-side.

## Design Tokens
**Colors**
- Backdrop `#E7D2AE` · Paper surface `#FBF4E6` · Ink/primary text `#2A2018`
- Secondary text `#6A5A47` · Muted `#8A7860` / `#A9997F` / `#BBAB91` · Brown `#6E4B2A` / `#B07A3A`
- Borders `#E7DCC6` (hairline), `#DBCDAF` (button outline), `#E0D4BC` / `#F0E8D8` (dividers), `#ECE0C8` (track)
- Primary accent / progress / urgent `#E0452A`
- Tier accents: `#E0452A`, `#E8A11C`, `#8A5A33`, `#5B4B8A` (+ soft bgs `#FCE9E3`, `#FBF0D7`, `#F0E6D8`, `#EAE6F5`)
- Brand: Kakao `#FEE500` / text `#3A1D1D`; Instagram gradient `#F9CE34 → #EE2A7B → #6228D7`

**Typography**
- UI: Pretendard. Sizes used: 42 / 25 / 24 / 21 / 18 / 17 / 16 / 15.5 / 14.5 / 13.5 / 13 / 12.5 / 12 / 11.5 / 10.5 px. Weights: 600 / 700 / 800. Display letter-spacing `-.02em`–`-.03em`. Korean body uses `word-break: keep-all`.
- Data/numbers: DM Mono (400/500). Sizes 30 / 14 / 13 / 11.5 px.

**Radius:** 8 (stamp) · 12 (index block / progress track) · 13 (share btns) · 14 (answer btns) · 16 (CTA / diagnosis / hook) · 18 (report card) · 999 (pills/badges/bar/toast).

**Shadows:** `0 6px 0 #6E4B2A` (CTA solid offset) · `0 6px 20px rgba(80,50,20,.07)` (report card) · `0 8px 24px rgba(0,0,0,.25)` (toast) · `0 1px 4px rgba(0,0,0,.3)` (percentile marker).

**Spacing:** screen padding 22–28px horizontal; section gaps 12–18px; card padding 16–22px.

## Assets
- **No image assets.** All graphics are emoji (`💩 🔬 📋 ⏱ 🙋 🙅 🚨 🧭 🌫️ 🧊 📖 🤔 👇 💬 📸 🔗 🔄 💛 🤫`).
- **Fonts** load from CDNs: Pretendard (`cdn.jsdelivr.net/gh/orioncactus/pretendard`), DM Mono (Google Fonts). In production, prefer self-hosting / your app's font pipeline.
- If you add real share previews, you'll need an OG image per result type (server-rendered or static).

## Files
- `급똥감능력테스트.dc.html` — the full design reference (intro + quiz + result, all logic and copy). Open in a browser to interact with the live prototype.
