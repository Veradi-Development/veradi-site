"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingCart, Play } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { useMobileDetect } from "@/hooks/useMobileDetect";

// 상수 정의
const SCROLL_AMOUNT_RATIO = 0.8;
const CARD_HOVER_SCALE = 1.04;
const TITLE_ANIMATION_DURATION = 0.6;
const CONTAINER_ANIMATION_DURATION = 0.8;
const CARD_ANIMATION_DURATION = 0.6;

// 동영상 링크 (실제 동영상 URL로 교체 필요)
const GUIDE_VIDEO_URL = "https://youtu.be/your-video-link";

// 교재 시리즈 데이터 타입
type BookData = {
  title: string;
  subject: string;
  series: string;
  front: string | null;
  link: string;
};

const gridConcept: BookData[] = [
  {
    title: "물리학 GRID 개념편",
    subject: "물리학",
    series: "GRID 개념편",
    front: "/images/grid_kinetic_front.jpg",
    link: "https://smartstore.naver.com/veradi",
  },
  {
    title: "화학 GRID 개념편",
    subject: "화학",
    series: "GRID 개념편",
    front: "/images/grid_helios_front.jpg",
    link: "https://smartstore.naver.com/veradi",
  },
  {
    title: "생명과학 GRID 개념편",
    subject: "생명과학",
    series: "GRID 개념편",
    front: "/images/grid_bioneer_front.jpg",
    link: "https://smartstore.naver.com/veradi",
  },
  {
    title: "지구과학 GRID 개념편",
    subject: "지구과학",
    series: "GRID 개념편",
    front: "/images/grid_orca_front.jpg",
    link: "https://smartstore.naver.com/veradi",
  },
];

const gridSol: BookData[] = [
  {
    title: "물리학 GRID 필수기출편",
    subject: "물리학",
    series: "GRID 필수기출편",
    front: "/images/grid_kinetic_sol_front.jpg",
    link: "https://smartstore.naver.com/veradi",
  },
  {
    title: "화학 GRID 필수기출편",
    subject: "화학",
    series: "GRID 필수기출편",
    front: "/images/grid_helios_sol_front.jpg",
    link: "https://smartstore.naver.com/veradi",
  },
  {
    title: "생명과학 GRID 필수기출편",
    subject: "생명과학",
    series: "GRID 필수기출편",
    front: "/images/grid_bioneer_sol_front.jpg",
    link: "https://smartstore.naver.com/veradi",
  },
  {
    title: "지구과학 GRID 필수기출편",
    subject: "지구과학",
    series: "GRID 필수기출편",
    front: "/images/grid_orca_sol_front.jpg",
    link: "https://smartstore.naver.com/veradi",
  },
];

const gridN: BookData[] = [
  {
    title: "물리학 GRID N제",
    subject: "물리학",
    series: "GRID N제",
    front: null,
    link: "https://smartstore.naver.com/veradi",
  },
  {
    title: "화학 GRID N제",
    subject: "화학",
    series: "GRID N제",
    front: null,
    link: "https://smartstore.naver.com/veradi",
  },
  {
    title: "생명과학 GRID N제",
    subject: "생명과학",
    series: "GRID N제",
    front: null,
    link: "https://smartstore.naver.com/veradi",
  },
  {
    title: "지구과학 GRID N제",
    subject: "지구과학",
    series: "GRID N제",
    front: null,
    link: "https://smartstore.naver.com/veradi",
  },
];

const mathMock: BookData[] = [
  {
    title: "수학 모의고사 시리즈",
    subject: "수학",
    series: "모의고사",
    front: null,
    link: "https://smartstore.naver.com/veradi",
  },
];

const scienceMock: BookData[] = [
  {
    title: "과학탐구 모의고사 시리즈",
    subject: "과학탐구",
    series: "모의고사",
    front: null,
    link: "https://smartstore.naver.com/veradi",
  },
];

// 교재 섹션 컴포넌트
function BookSeriesSection({ 
  title, 
  books,
  useSubjectsBackground = false
}: { 
  title: string; 
  books: BookData[];
  useSubjectsBackground?: boolean;
}) {
  const [isClient, setIsClient] = useState(false);
  const isMobile = useMobileDetect();
  const { scrollRef, canScrollLeft, canScrollRight, scroll } = useHorizontalScroll({
    scrollAmountRatio: SCROLL_AMOUNT_RATIO,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 배경 스타일 선택
  const backgroundStyle = useSubjectsBackground ? {
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.015) 1px, transparent 1px),
      radial-gradient(circle at 60% 70%, rgba(0, 0, 0, 0.012) 1px, transparent 1px),
      radial-gradient(circle at 40% 50%, rgba(0, 0, 0, 0.01) 1px, transparent 1px),
      radial-gradient(circle at 80% 10%, rgba(0, 0, 0, 0.013) 1px, transparent 1px),
      radial-gradient(circle at 15% 80%, rgba(0, 0, 0, 0.011) 1px, transparent 1px),
      linear-gradient(to bottom, white, rgb(239, 246, 255))
    `,
    backgroundSize: '3px 3px, 5px 5px, 4px 4px, 6px 6px, 5px 5px, 100% 100%',
    backgroundPosition: '0 0, 1px 1px, 2px 2px, 3px 3px, 4px 4px, 0 0'
  } : {
    backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)",
    backgroundSize: "80px 80px",
    backgroundPosition: "center center",
    backgroundColor: "#f8fafc",
  };

  return (
    <section 
      className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-visible"
      style={backgroundStyle}
    >
      <div className="max-w-7xl mx-auto relative overflow-visible">
        {/* 제목 + 더 알아보기 링크 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.2 }}
          transition={{ duration: isMobile ? 0 : TITLE_ANIMATION_DURATION, ease: "easeOut" }}
          className="flex items-center justify-between mb-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            {title}
          </h2>
          
          {/* 더 알아보기 링크 */}
          <a
            href={GUIDE_VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:text-sky-700 text-sm sm:text-base font-medium whitespace-nowrap flex items-center gap-1 group transition-colors"
          >
            더 알아보기
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>

        {/* 화살표 버튼 */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex justify-between items-center z-20 px-2 sm:px-4 md:px-6">
          <button
            onClick={() => scroll("left")}
            disabled={isClient ? !canScrollLeft : false}
            className={`pointer-events-auto p-2 sm:p-3 rounded-full shadow-md backdrop-blur-sm transition ${
              isClient && !canScrollLeft
                ? "bg-gray-200/50 cursor-not-allowed opacity-40"
                : "bg-white/70 hover:bg-white hover:shadow-lg"
            }`}
            aria-label="이전"
          >
            <ArrowLeft className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isClient && !canScrollLeft ? "text-gray-400" : "text-gray-700"
            }`} />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={isClient ? !canScrollRight : false}
            className={`pointer-events-auto p-2 sm:p-3 rounded-full shadow-md backdrop-blur-sm transition ${
              isClient && !canScrollRight
                ? "bg-gray-200/50 cursor-not-allowed opacity-40"
                : "bg-white/70 hover:bg-white hover:shadow-lg"
            }`}
            aria-label="다음"
          >
            <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isClient && !canScrollRight ? "text-gray-400" : "text-gray-700"
            }`} />
          </button>
        </div>

        {/* 수평 스크롤 카드 컨테이너 */}
        <motion.div
          ref={scrollRef}
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 50 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px", amount: 0.2 }}
          transition={{ duration: isMobile ? 0 : CONTAINER_ANIMATION_DURATION, ease: "easeOut" }}
          className="flex gap-6 sm:gap-8 md:gap-10 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 overflow-visible"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            willChange: 'transform',
          }}
        >
          {books.map((book, idx) => (
            <motion.div
              key={book.title}
              initial={isMobile ? { opacity: 1 } : { opacity: 0, x: 30 }}
              whileInView={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: isMobile ? 0 : CARD_ANIMATION_DURATION * 0.8, 
                delay: isMobile ? 0 : idx * 0.08,
                ease: "easeOut" 
              }}
              whileHover={isMobile ? {} : { scale: CARD_HOVER_SCALE }}
              className={`relative flex-shrink-0 w-[320px] sm:w-[360px] md:w-[400px] lg:w-[420px]
                         bg-white rounded-3xl shadow-lg border border-gray-100
                         overflow-visible snap-center flex flex-col ${isMobile ? '' : 'hover:shadow-2xl transition-all duration-500'}`}
              style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
            >
              {/* 상단 텍스트 영역 */}
              <div className="flex-shrink-0 p-6 sm:p-8 pb-4 sm:pb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  {book.subject}{" "}
                  <span className="text-sky-600">{book.series}</span>
                </h3>
              </div>

              {/* 이미지 영역 */}
              <div className="flex-1 min-h-[240px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-[380px] py-4 sm:py-6 flex items-center justify-center relative perspective-[1200px] overflow-visible z-10">
                {book.front ? (
                  <motion.div
                    initial={{ rotateY: 0 }}
                    whileHover={isMobile ? {} : { rotateY: 20 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="relative w-40 h-56 sm:w-52 sm:h-72 md:w-60 md:h-80 lg:w-64 lg:h-[22rem] transform-style-preserve-3d overflow-visible"
                    style={{
                      transformOrigin: "center center",
                      willChange: 'transform',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    {/* 앞표지 */}
                    <div
                      className="absolute inset-0 bg-white rounded-md overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.45)]"
                      style={{ transform: "translateZ(0px)" }}
                    >
                      <Image
                        src={book.front}
                        alt={`${book.subject} 앞표지`}
                        fill
                        sizes="(max-width: 640px) 160px, (max-width: 768px) 208px, (max-width: 1024px) 240px, 256px"
                        priority={idx === 0}
                        className="object-cover"
                        quality={85}
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-gray-100 w-40 h-56 sm:w-52 sm:h-72 md:w-60 md:h-80 lg:w-64 lg:h-[22rem] flex items-center justify-center text-gray-400 text-xs sm:text-sm rounded-md">
                    {book.subject} 교재 이미지
                  </div>
                )}
              </div>

              {/* 하단 버튼 */}
              <div className="flex-shrink-0 flex justify-center items-center gap-3 px-6 sm:px-8 py-4 sm:py-6 border-t border-gray-100 bg-white/70 backdrop-blur-sm rounded-b-3xl">
                <a
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>구입하기</span>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 스크롤바 숨김 */}
      <style jsx global>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>
    </section>
  );
}

export default function Publications() {
  const isMobile = useMobileDetect();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      <Navbar />
      
      {/* Apple 스타일 히어로 섹션 - 완벽활용가이드 */}
      <section id="guide-section" className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* 제목 */}
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.6 }}
            className="text-left mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              완벽활용가이드
            </h1>
          </motion.div>

          {/* 메인 이미지 + 텍스트 오버레이 섹션 */}
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 50 }}
            animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.8, delay: isMobile ? 0 : 0.2 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* 배경 이미지 - 책 들고 있는 사람 */}
            <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px]">
              {/* 임시 배경 - 실제 이미지로 교체 예정 */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
                {/* 실제 이미지를 사용할 때는 아래처럼 교체:
                <Image 
                  src="/images/guide-hero.jpg" 
                  alt="VERADI 교재를 들고 있는 사람"
                  fill
                  className="object-cover"
                  priority
                /> */}
                <div className="absolute inset-0 flex items-center justify-end pr-8 sm:pr-16 md:pr-24 lg:pr-32">
                  <div className="text-gray-400 text-center">
                    <div className="text-6xl sm:text-8xl mb-4">📚</div>
                    <p className="text-sm sm:text-base">책 들고 있는 사진<br/>(준비 중)</p>
                  </div>
                </div>
              </div>

              {/* 왼쪽 텍스트 + 버튼 오버레이 */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full max-w-xl px-6 sm:px-12 md:px-16 lg:px-20">
                  <motion.div
                    initial={isMobile ? { opacity: 1 } : { opacity: 0, x: -30 }}
                    animate={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    transition={{ duration: isMobile ? 0 : 0.8, delay: isMobile ? 0 : 0.4 }}
                    className="space-y-5 sm:space-y-6 text-center"
                  >
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                        VERADI 교재,<br />
                        제대로 활용하기
                      </h2>
                    </div>

                    {/* 동영상 보기 버튼 */}
                    <div className="flex justify-center">
                      <a
                        href={GUIDE_VIDEO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105 group"
                      >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                        <span className="text-sm sm:text-base">동영상 보기</span>
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 각 교재 시리즈 섹션 */}
      {/* GRID 시리즈 - 모두 그리드 패턴 배경으로 통일 */}
      <BookSeriesSection title="GRID 개념편" books={gridConcept} />
      <BookSeriesSection title="GRID 필수기출편" books={gridSol} />
      <BookSeriesSection title="GRID N제" books={gridN} />
      
      {/* 모의고사 시리즈 - 블루 그라데이션 배경 */}
      <BookSeriesSection title="수학 모의고사" books={mathMock} useSubjectsBackground={true} />
      <BookSeriesSection title="과학탐구 모의고사" books={scienceMock} useSubjectsBackground={true} />

      <Footer />
    </main>
  );
}

