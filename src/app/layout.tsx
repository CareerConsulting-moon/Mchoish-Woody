import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/nav";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "700"],
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif-kr",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "WOODY | 나무로 공간의 의미를 짓다",
  description: "목조 건축, 인테리어, 전통 건축 및 종교 목공 포트폴리오 중심 홈페이지 샘플",
  openGraph: {
    title: "WOODY | 나무로 공간의 의미를 짓다",
    description: "목조 건축·인테리어·전통 목공 전문업체 포트폴리오 샘플",
    images: [
      {
        url: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "목조 건축 포트폴리오 대표 이미지",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKr.variable} ${notoSerifKr.variable} bg-zinc-50 text-zinc-900 antialiased`}
      >
        <SiteNav />
        <main className="mx-auto min-h-[calc(100vh-60px)] max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
