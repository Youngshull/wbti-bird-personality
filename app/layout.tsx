import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WBTI 鸟格测试｜今天你是哪一种鸟？",
  description: "回答 32 道生活情境题，发现藏在性格里的鸟格特质。",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
