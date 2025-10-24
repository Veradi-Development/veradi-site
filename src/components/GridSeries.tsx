"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { useMobileDetect } from "@/hooks/useMobileDetect";

// 상수 정의
const SCROLL_AMOUNT_RATIO = 0.4;
const CARD_HOVER_SCALE = 1.03;

type GridBook = {
  id: string;
  title: string;
  subject: string;
  main_image_url: string | null;
  sub_image_url: string | null;
  purchase_link: string | null;
};

export default function GridSeries() {
  const [isClient, setIsClient] = useState(false);
  const [subjects, setSubjects] = useState<GridBook[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMobileDetect();
  const { scrollRef, canScrollLeft, canScrollRight, scroll } = useHorizontalScroll({
    scrollAmountRatio: SCROLL_AMOUNT_RATIO,
  });

  useEffect(() => {
    setIsClient(true);
    
    // API에서 GRID 교재 가져오기
    const fetchGridBooks = async () => {
      try {
        const response = await fetch('/api/books?type=grid');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setSubjects(data);
          }
        }
      } catch (error) {
        console.error('Error fetching grid books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGridBooks();
  }, []);

  return (
    <section
      className="relative py-32 px-6 overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        backgroundPosition: "center center",
        backgroundColor: "#f8fafc",
      }}
    >
      <div className="max-w-[1400px] mx-auto relative px-4 md:px-8">
        {/* 상단 문구 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.2 }}
          transition={{ duration: isMobile ? 0 : 0.6, ease: "easeOut" }}
          className="text-left mb-24"
        >
          <h2 className="text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-[1.1]">
            GRID
          </h2>
          <p className="text-lg md:text-3xl text-gray-700 font-medium tracking-tight">
            :1%의 로직 - 실전 문제 풀이의 절대 기준선
          </p>
        </motion.div>

        {/* 화살표 버튼 */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex justify-between items-center z-20 px-6">
          <button
            onClick={() => scroll("left")}
            disabled={isClient && !canScrollLeft}
            className={`pointer-events-auto p-3 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
              !isClient || canScrollLeft
                ? "bg-white/80 hover:bg-white hover:shadow-xl hover:scale-110 cursor-pointer"
                : "bg-white/30 opacity-40 cursor-not-allowed"
            }`}
            aria-label="이전 슬라이드"
          >
            <ArrowLeft className={`w-6 h-6 transition-colors ${!isClient || canScrollLeft ? "text-gray-700" : "text-gray-400"}`} />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={isClient && !canScrollRight}
            className={`pointer-events-auto p-3 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
              !isClient || canScrollRight
                ? "bg-white/80 hover:bg-white hover:shadow-xl hover:scale-110 cursor-pointer"
                : "bg-white/30 opacity-40 cursor-not-allowed"
            }`}
            aria-label="다음 슬라이드"
          >
            <ArrowRight className={`w-6 h-6 transition-colors ${!isClient || canScrollRight ? "text-gray-700" : "text-gray-400"}`} />
          </button>
        </div>

        {/* 카드 컨테이너 */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">등록된 교재가 없습니다</p>
          </div>
        ) : (
          <motion.div
            ref={scrollRef}
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 50 }}
            whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px", amount: 0.2 }}
            transition={{ duration: isMobile ? 0 : 0.8, ease: "easeOut" }}
            className="flex gap-6 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 hide-scrollbar"
            style={{ willChange: 'transform' }}
          >
            {subjects.map((subject, idx) => (
              <motion.div
                key={subject.id}
                initial={isMobile ? { opacity: 1 } : { opacity: 0, x: 30 }}
                whileInView={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: isMobile ? 0 : 0.5, 
                  delay: isMobile ? 0 : idx * 0.08,
                  ease: "easeOut" 
                }}
                whileHover={isMobile ? {} : { scale: CARD_HOVER_SCALE }}
                className={`relative flex-shrink-0 w-[310px] sm:w-[410px] md:w-[510px] lg:w-[580px] xl:w-[630px] h-[280px] sm:h-[320px] md:h-[360px] lg:h-[440px] xl:h-[480px] bg-white rounded-3xl shadow-lg border border-gray-100 snap-center overflow-visible ${isMobile ? '' : 'hover:shadow-2xl transition-all duration-500'}`}
                style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
              >
                {/* 상단 텍스트 영역 */}
                <div className="pt-4 sm:pt-5 md:pt-6 lg:pt-7 pb-0 text-center">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
                    {subject.subject}
                  </h3>
                </div>

                {/* 교재 2권 */}
                <a
                  href={subject.purchase_link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/books h-[75%] mt-2 sm:mt-3 md:mt-4 flex items-center justify-center gap-3 sm:gap-4 md:gap-5 relative overflow-visible cursor-pointer ${isMobile ? 'pointer-events-auto' : ''}`}
                >
                  {/* 문제집 */}
                  {subject.main_image_url && (
                    <div className={`relative w-[130px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[240px] h-[180px] sm:h-[220px] md:h-[260px] lg:h-[320px] xl:h-[350px] overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.35)] bg-white border border-gray-200 ${isMobile ? '' : 'group-hover/books:shadow-[0_30px_60px_rgba(0,0,0,0.45)] transition-all duration-300 group-hover/books:scale-105'}`}
                      style={{ willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                    >
                      <Image
                        src={subject.main_image_url}
                        alt={`${subject.subject} 문제집`}
                        fill
                        sizes="(max-width: 640px) 130px, (max-width: 768px) 160px, (max-width: 1024px) 190px, (max-width: 1280px) 220px, 240px"
                        priority={idx === 0}
                        className="object-cover"
                        quality={85}
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  )}

                  {/* 구분선 */}
                  {subject.main_image_url && subject.sub_image_url && (
                    <div className="w-[1px] h-[180px] sm:h-[220px] md:h-[260px] lg:h-[320px] xl:h-[350px] bg-gray-200" />
                  )}

                  {/* 해설집 */}
                  {subject.sub_image_url && (
                    <div className={`relative w-[130px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[240px] h-[180px] sm:h-[220px] md:h-[260px] lg:h-[320px] xl:h-[350px] overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.3)] bg-white border border-gray-200 ${isMobile ? '' : 'group-hover/books:shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover/books:scale-105'}`}
                      style={{ willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                    >
                      <Image
                        src={subject.sub_image_url}
                        alt={`${subject.subject} 해설집`}
                        fill
                        sizes="(max-width: 640px) 130px, (max-width: 768px) 160px, (max-width: 1024px) 190px, (max-width: 1280px) 220px, 240px"
                        priority={idx === 0}
                        className="object-cover"
                        quality={85}
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  )}

                  {/* 가운데 구매하기 버튼 */}
                  {subject.purchase_link && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="opacity-0 group-hover/books:opacity-80 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold shadow-xl transform group-hover/books:scale-110 pointer-events-auto border border-gray-200">
                        구매하기
                      </span>
                    </div>
                  )}
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 섹션 하단 버튼 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px", amount: 0.2 }}
          transition={{ duration: isMobile ? 0 : 0.6, delay: isMobile ? 0 : 0.2, ease: "easeOut" }}
          className="mt-20 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6"
        >
          <button className="group flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl shadow-md hover:shadow-xl hover:border-gray-400 hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
            더 알아보기
          </button>
          <button className="group flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold text-white bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl shadow-lg hover:shadow-2xl hover:from-sky-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1">
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
            구입하기
          </button>
        </motion.div>
      </div>

      {/* 스크롤바 숨김 */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          overflow: -moz-scrollbars-none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>
    </section>
  );
}

