import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
  authors: [{ name: "VERADI" }],
  creator: "VERADI",
  publisher: "VERADI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "VERADI | 1% 로직을 당신의 것으로",
    description: "국내 최상위권 연구진이 만드는 검증된 교육 콘텐츠",
    type: "website",
    locale: "ko_KR",
    siteName: "VERADI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '', // Google Search Console 인증 코드
    // other: '', // 다른 검색 엔진 인증 코드
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
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

