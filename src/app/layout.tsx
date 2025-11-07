import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "VERADI | 1% 로직을 당신의 것으로",
  description: "고등·수능 zero to mastery. 국내 최상위권 연구진이 만드는 검증된 교육 콘텐츠. GRID 개념&로직, 기출&N제, Subjects 모의고사.",
  keywords: ["VERADI", "수능", "고등교육", "GRID", "모의고사", "교육콘텐츠", "SKY", "의치한약수"],
  openGraph: {
    title: "VERADI | 1% 로직을 당신의 것으로",
    description: "국내 최상위권 연구진이 만드는 검증된 교육 콘텐츠",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link 
          rel="preload" 
          href="/images/company-logo.png" 
          as="image"
          type="image/png"
        />
        <link 
          rel="preload" 
          href="/images/veradi-logo.png" 
          as="image"
          type="image/png"
        />
        <link 
          rel="preload" 
          href="/images/background.png" 
          as="image"
          type="image/png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

