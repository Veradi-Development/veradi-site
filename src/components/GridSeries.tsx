"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, memo } from "react";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { useMobileDetect } from "@/hooks/useMobileDetect";

const SCROLL_AMOUNT_RATIO = 0.4;
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

const BookCard = memo(({ subject, idx, isMobile }: { subject: GridBook, idx: number, isMobile: boolean }) => {
  const cardBgs = [
    'linear-gradient(135deg, rgb(29, 78, 216) 0%, rgb(30, 64, 175) 50%, rgb(37, 99, 235) 100%)',
    'linear-gradient(135deg, rgb(154, 52, 18) 0%, rgb(194, 65, 12) 50%, rgb(234, 88, 12) 100%)',
    'linear-gradient(135deg, rgb(20, 83, 45) 0%, rgb(22, 101, 52) 50%, rgb(21, 128, 61) 100%)',
    'linear-gradient(135deg, rgb(30, 27, 75) 0%, rgb(49, 46, 129) 50%, rgb(67, 56, 202) 100%)',
  ];
  
  const bg = cardBgs[idx % 4];

  return (
    <div
      key={subject.id}
      className={`relative flex-shrink-0 snap-start overflow-visible rounded-3xl`}
      style={{
        ...optimizedStyle,
        width: '480px',
        height: '420px',
        scrollSnapAlign: 'start',
      }}
    >
      {/* 카드 배경 */}
      <div 
        className={`absolute inset-0 transition-all duration-300`}
        style={{
          background: bg,
          backdropFilter: 'blur(4px)',
          borderRadius: '32px',
        }}
      />
      {/* 윤기 효과 */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 15% 15%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 20%, transparent 45%)',
          borderRadius: '32px',
        }}
      />
    {/* 단일 테두리 - 흰색 */}
    <div 
      className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
        isMobile ? '' : 'group-hover:border-blue-400'
      }`}
      style={{
        border: '2px solid rgb(255, 255, 255)',
        borderRadius: '32px',
      }}
    />

    <a
      href={subject.purchase_link || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer ${isMobile ? 'pointer-events-auto' : ''}`}
    >
      {/* 과목명 - 가운데 */}
      <h3 className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl font-bold text-black z-30" style={{ textShadow: '0 1px 3px rgba(255,255,255,0.2)' }}>
        {subject.subject}
      </h3>

      {/* 책 이미지 컨테이너 - 겹치게 배치, 함께 움직임 */}
      <motion.div 
        className="relative flex items-center justify-center h-full" 
        style={{ marginTop: '40px' }}
        whileHover={isMobile ? {} : { y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {subject.sub_image_url && (
          <div 
            className={`relative overflow-hidden bg-white border-2 border-gray-200 ${isMobile ? '' : 'group-hover:border-blue-400 transition-all duration-300'}`}
            style={{
              ...optimizedStyle,
              width: '200px',
              height: '280px',
              boxShadow: '0 30px 70px rgba(0,0,0,0.7), 0 20px 40px rgba(0,0,0,0.6), 0 10px 20px rgba(0,0,0,0.5)',
              zIndex: 1,
            }}
          >
            <Image
              src={subject.sub_image_url}
              alt={`${subject.subject} 해설집`}
              fill
              sizes="200px"
              className="object-cover"
              quality={75}
              loading={idx < 2 ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            />
          </div>
        )}

        {subject.main_image_url && (
          <div 
            className={`relative overflow-hidden bg-white border-2 border-gray-200 ${isMobile ? '' : 'group-hover:border-blue-400 transition-all duration-300'}`}
            style={{
              ...optimizedStyle,
              width: '200px',
              height: '280px',
              boxShadow: '0 40px 90px rgba(0,0,0,0.8), 0 30px 60px rgba(0,0,0,0.7), 0 20px 40px rgba(0,0,0,0.6)',
              zIndex: 2,
              marginLeft: '-80px',
              marginTop: '-50px'
            }}
          >
            <Image
              src={subject.main_image_url}
              alt={`${subject.subject} 문제집`}
              fill
              sizes="200px"
              className="object-cover"
              quality={75}
              loading={idx < 2 ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            />
          </div>
        )}
      </motion.div>

      {/* 구입하기 버튼 - 호버 시 표시 */}
      {subject.purchase_link && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 backdrop-blur-sm text-gray-900 px-8 py-3 rounded-lg text-base font-bold shadow-2xl pointer-events-auto border-2 border-gray-800">
            구입하기
          </span>
        </div>
      )}
    </a>
  </div>
  );
});

BookCard.displayName = 'BookCard';

export default function GridSeries() {
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
    <div style={{ 
      paddingLeft: "60px", 
      paddingRight: "40px", 
      paddingBottom: "120px",
      marginLeft: "30px",
    }}>
      <div className="flex gap-8 items-start">
        {/* 텍스트 카드 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.2 }}
          transition={{ duration: isMobile ? 0 : 0.6, ease: "easeOut" }}
          className="flex-shrink-0"
          style={{ width: "360px", marginLeft: "-30px" }}
        >
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-[1.1]">
              GRID
            </h2>
            <p className="text-lg md:text-xl text-gray-300 font-medium tracking-tight mb-6">
              개념&로직 [물1/화1/생1/지1]
            </p>

            {/* 버튼 영역 */}
            <div className="flex" style={{ gap: '12px' }}>
              <button className="flex items-center justify-center text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl" style={{ width: '120px', height: '48px', boxSizing: 'border-box', backgroundColor: 'rgb(0, 0, 0)', border: '2px solid rgb(255, 255, 255)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(31, 41, 55)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(0, 0, 0)'}>
                구입하기
              </button>
              <button className="flex items-center justify-center text-sm font-semibold text-gray-700 hover:shadow-md hover:text-gray-900 transition-all duration-200 rounded-xl border-2 border-gray-300" style={{ width: '120px', height: '48px', boxSizing: 'border-box', backgroundColor: 'rgb(255, 255, 255)' }}>
                더 알아보기
              </button>
            </div>
          </div>
        </motion.div>

        {/* 슬라이드 영역 */}
        <div className="relative overflow-visible flex-1" style={{ 
          minWidth: '0',
          marginLeft: '30px',
          marginRight: '9px'
        }}>
            {/* 화살표 버튼 */}
            {/* 왼쪽 화살표 */}
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`absolute p-2 sm:p-3 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 z-20 ${
                canScrollLeft
                  ? "bg-white/80 hover:bg-white hover:shadow-xl hover:scale-110 cursor-pointer"
                  : "bg-white/30 opacity-40 cursor-not-allowed"
              }`}
              style={{
                left: '-20px',
                top: '210px',
                transform: 'translateY(-50%)',
              }}
              aria-label="이전 슬라이드"
            >
              <ArrowLeft className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${canScrollLeft ? "text-gray-700" : "text-gray-400"}`} />
            </button>

            {/* 오른쪽 화살표 */}
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`absolute p-2 sm:p-3 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 z-20 ${
                canScrollRight
                  ? "bg-white/80 hover:bg-white hover:shadow-xl hover:scale-110 cursor-pointer"
                  : "bg-white/30 opacity-40 cursor-not-allowed"
              }`}
              style={{
                right: '-20px',
                top: '210px',
                transform: 'translateY(-50%)',
              }}
              aria-label="다음 슬라이드"
            >
              <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${canScrollRight ? "text-gray-700" : "text-gray-400"}`} />
            </button>

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
                initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
                whileInView={isMobile ? { opacity: 1 } : { opacity: 1 }}
                viewport={{ once: true, margin: "-50px", amount: 0.2 }}
                transition={{ duration: isMobile ? 0 : 0.6, ease: "easeOut" }}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 hide-scrollbar"
                style={{
                  ...optimizedStyle,
                  gap: '30px',
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
    </div>
  );
}
