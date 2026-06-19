import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { PosthogProvider } from "./analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "급똥 감(感)능력 테스트",
  description: "당신은 급똥의 위기를 얼마나 예민하게 감지하나요?",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PosthogProvider />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
