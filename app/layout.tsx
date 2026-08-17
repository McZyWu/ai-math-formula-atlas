import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 数学公式图谱｜从高数到大模型与强化学习",
  description: "可搜索、可推导、可计算、可交互的 AI 数学公式库，覆盖高数、线代、概率统计、ESL、深度学习、Transformer、MoE 与强化学习。",
  openGraph: {
    title: "AI 数学公式图谱",
    description: "从高数到大模型与强化学习 · 148 条逐步推导",
    type: "website",
    locale: "zh_CN",
    images: [{ url: "/og.png", width: 1792, height: 921, alt: "AI 数学公式图谱" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 数学公式图谱",
    description: "从高数到大模型与强化学习 · 148 条逐步推导",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
