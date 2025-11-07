"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, memo } from "react";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { useMobileDetect } from "@/hooks/useMobileDetect";

// 상수 정의
const SCROLL_AMOUNT_RATIO = 0.4;
const CARD_HOVER_SCALE = 1.02;
const optimizedStyle = {
  willChange: 'transform' as const,
  backfaceVisibility: 'hidden' as const,
  transform: 'translateZ(0)'
};

type GridBook = {
  id: string;
  title: string;
  subject: string;
  main_image_url: string | null;
  sub_image_url: string | null;
  purchase_link: string | null;
};

const BookCard = memo(({ subject, idx, isMobile }: { subject: GridBook, idx: number, isMobile: boolean }) => (
  <motion.div
    key={subject.id}
    initial={isMobile ? { opacity: 1 } : { opacity: 0, x: 30 }}
    whileInView={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ 
      duration: isMobile ? 0 : 0.4, 
      delay: isMobile ? 0 : Math.min(idx * 0.06, 0.3),
      ease: "easeOut" 
    }}
    whileHover={isMobile ? {} : { scale: CARD_HOVER_SCALE }}
    className={`relative flex-shrink-0 w-[280px] sm:w-[340px] md:w-[400px] lg:w-[460px] h-[240px] sm:h-[280px] md:h-[320px] lg:h-[360px] bg-white rounded-2xl shadow-lg border border-gray-100 snap-center overflow-visible ${isMobile ? '' : 'hover:shadow-2xl transition-shadow duration-300'}`}
    style={optimizedStyle}
  >
    <div className="pt-3 sm:pt-4 md:pt-5 pb-0 text-center">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1">
        {subject.subject}
      </h3>
    </div>

    <a
      href={subject.purchase_link || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`group/books h-[75%] mt-2 flex items-center justify-center gap-2 sm:gap-3 relative overflow-visible cursor-pointer ${isMobile ? 'pointer-events-auto' : ''}`}
    >
      {subject.main_image_url && (
        <div className={`relative w-[110px] sm:w-[135px] md:w-[160px] lg:w-[185px] h-[155px] sm:h-[185px] md:h-[215px] lg:h-[245px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.35)] bg-white border border-gray-200 ${isMobile ? '' : 'group-hover/books:shadow-[0_25px_50px_rgba(0,0,0,0.4)] transition-shadow duration-300'}`}
          style={optimizedStyle}
        >
          <Image
            src={subject.main_image_url}
            alt={`${subject.subject} 문제집`}
            fill
            sizes="(max-width: 640px) 110px, (max-width: 768px) 135px, (max-width: 1024px) 160px, 185px"
            className="object-cover"
            quality={75}
            loading={idx < 2 ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          />
        </div>
      )}

      {subject.main_image_url && subject.sub_image_url && (
        <div className="w-[1px] h-[155px] sm:h-[185px] md:h-[215px] lg:h-[245px] bg-gray-200" />
      )}

      {subject.sub_image_url && (
        <div className={`relative w-[110px] sm:w-[135px] md:w-[160px] lg:w-[185px] h-[155px] sm:h-[185px] md:h-[215px] lg:h-[245px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)] bg-white border border-gray-200 ${isMobile ? '' : 'group-hover/books:shadow-[0_25px_50px_rgba(0,0,0,0.35)] transition-shadow duration-300'}`}
          style={optimizedStyle}
        >
          <Image
            src={subject.sub_image_url}
            alt={`${subject.subject} 해설집`}
            fill
            sizes="(max-width: 640px) 110px, (max-width: 768px) 135px, (max-width: 1024px) 160px, 185px"
            className="object-cover"
            quality={75}
            loading={idx < 2 ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          />
        </div>
      )}

      {subject.purchase_link && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="opacity-0 group-hover/books:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold shadow-xl pointer-events-auto border border-gray-200">
            구매하기
          </span>
        </div>
      )}
    </a>
  </motion.div>
));

BookCard.displayName = 'BookCard';

export default function GridSeries2() {
  const [subjects, setSubjects] = useState<GridBook[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMobileDetect();
  const { scrollRef, canScrollLeft, canScrollRight, scroll, recheckScroll } = useHorizontalScroll({
    scrollAmountRatio: SCROLL_AMOUNT_RATIO,
  });

  useEffect(() => {
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

  // 데이터 로드 후 스크롤 상태 재체크
  useEffect(() => {
    if (subjects.length > 0) {
      const timeouts = [
        setTimeout(() => recheckScroll(), 100),
        setTimeout(() => recheckScroll(), 300),
        setTimeout(() => recheckScroll(), 500),
      ];
      return () => timeouts.forEach(t => clearTimeout(t));
    }
  }, [subjects, recheckScroll]);

  return (
    <section
      className="relative pt-16 pb-32 px-2 sm:px-4 overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        backgroundPosition: "center center",
        backgroundColor: "#f8fafc",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-2 md:px-4">
        {/* 좌우 레이아웃 - 순서 반대 */}
        <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-8 items-center lg:items-start">
          {/* 오른쪽: 텍스트 및 버튼 영역 */}
          <div className="w-full lg:w-[30%] flex-shrink-0 lg:pl-20">
             <motion.div
              initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px", amount: 0.2 }}
              transition={{ duration: isMobile ? 0 : 0.6, ease: "easeOut" }}
              className="text-left"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-[1.1]">
                GRID
              </h2>
              <p className="text-xl md:text-2xl text-gray-500 font-medium tracking-tight mb-8">
                기출&N제 [물1/화1/생1/지1]
              </p>

              {/* 버튼 영역 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-black hover:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  <ShoppingCart className="w-5 h-5" />
                  구입하기
                </button>
                <button className="group flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl shadow-md hover:shadow-lg hover:border-gray-400 hover:text-gray-900 transition-all duration-200">
                  <BookOpen className="w-5 h-5" />
                  더 알아보기
                </button>
              </div>
            </motion.div>
          </div>

          {/* 왼쪽: 슬라이드 영역 */}
          <div className="w-full lg:w-[70%] relative">
            {/* 화살표 버튼 */}
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex justify-between items-center z-20 px-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`pointer-events-auto p-2 sm:p-3 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
                  canScrollLeft
                    ? "bg-white/80 hover:bg-white hover:shadow-xl hover:scale-110 cursor-pointer"
                    : "bg-white/30 opacity-40 cursor-not-allowed"
                }`}
                aria-label="이전 슬라이드"
              >
                <ArrowLeft className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${canScrollLeft ? "text-gray-700" : "text-gray-400"}`} />
              </button>

              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`pointer-events-auto p-2 sm:p-3 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
                  canScrollRight
                    ? "bg-white/80 hover:bg-white hover:shadow-xl hover:scale-110 cursor-pointer"
                    : "bg-white/30 opacity-40 cursor-not-allowed"
                }`}
                aria-label="다음 슬라이드"
              >
                <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${canScrollRight ? "text-gray-700" : "text-gray-400"}`} />
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
                initial={isMobile ? { opacity: 1 } : { opacity: 0, x: -30 }}
                whileInView={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px", amount: 0.2 }}
                transition={{ duration: isMobile ? 0 : 0.5, ease: "easeOut" }}
                className="flex gap-6 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 hide-scrollbar"
                style={{
                  ...optimizedStyle,
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {subjects.map((subject, idx) => (
                  <BookCard key={subject.id} subject={subject} idx={idx} isMobile={isMobile} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 스크롤바 숨김 */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

