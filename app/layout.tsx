import type { Metadata, Viewport } from "next";
import "./globals.css";

const description = "24 个日常小现场，测出你的行动节奏、社交电量、计划偏好和决策方式，再认识一只和你很像的真实鸟类。";

export const metadata: Metadata = {
  metadataBase: new URL("https://wbti.site"),
  title: "WBTI 鸟格测试｜今天的你是哪一只鸟？",
  description,
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: "WBTI 鸟格测试｜今天的你是哪一只鸟？",
    description,
    url: "https://wbti.site",
    siteName: "WBTI 鸟格测试",
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630 }],
    locale: "zh_CN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4ecd8",
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
