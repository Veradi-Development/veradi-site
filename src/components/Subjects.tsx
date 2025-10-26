"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Users, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { useMobileDetect } from "@/hooks/useMobileDetect";

// 상수 정의
const SCROLL_AMOUNT_RATIO = 0.8;
const CARD_HOVER_SCALE = 1.03;
const optimizedStyle = {
  willChange: 'transform' as const,
  backfaceVisibility: 'hidden' as const
};

type SubjectBook = {
  id: string;
  title: string;
  subject: string;
  description: string | null;
  front_image_url: string | null;
  purchase_link: string | null;
};

export default function Subjects() {
  const [teams, setTeams] = useState<SubjectBook[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMobileDetect();
  const { scrollRef, canScrollLeft, canScrollRight, scroll } = useHorizontalScroll({
    scrollAmountRatio: SCROLL_AMOUNT_RATIO,
  });

  useEffect(() => {
    // API에서 Subjects 교재 가져오기
    const fetchSubjectBooks = async () => {
      try {
        const response = await fetch('/api/books?type=subject');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setTeams(data);
          }
        }
      } catch (error) {
        console.error('Error fetching subject books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectBooks();
  }, []);

  return (
    // ✅ 섹션의 overflow-visible로 변경
    <section 
      className="relative bg-gradient-to-b from-white to-blue-50 py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-visible"
      style={{
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
      }}
    >
      <div className="max-w-7xl mx-auto relative overflow-visible">
        {/* 제목 */}
        <motion.h2
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.2 }}
          transition={{ duration: isMobile ? 0 : 0.6, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl text-left font-bold text-gray-900 mb-4 leading-tight tracking-tight"
        >
          VERADI Subjects & Series
        </motion.h2>

        {/* 🔹 화살표 버튼 */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex justify-between items-center z-20 px-2 sm:px-4 md:px-6">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`pointer-events-auto p-2 sm:p-3 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
              canScrollLeft
                ? "bg-white/70 hover:bg-white hover:shadow-lg hover:scale-110"
                : "bg-gray-200/50 cursor-not-allowed opacity-40"
            }`}
            aria-label="이전"
          >
            <ArrowLeft className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
              canScrollLeft ? "text-gray-700" : "text-gray-400"
            }`} />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`pointer-events-auto p-2 sm:p-3 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
              canScrollRight
                ? "bg-white/70 hover:bg-white hover:shadow-lg hover:scale-110"
                : "bg-gray-200/50 cursor-not-allowed opacity-40"
            }`}
            aria-label="다음"
          >
            <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
              canScrollRight ? "text-gray-700" : "text-gray-400"
            }`} />
          </button>
        </div>

        {/* 🔹 수평 스크롤 카드 컨테이너 */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">등록된 교재가 없습니다</p>
          </div>
        ) : (
        <motion.div
          ref={scrollRef}
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px", amount: 0.2 }}
          transition={{ duration: isMobile ? 0 : 0.5, ease: "easeOut" }}
          className="flex gap-6 sm:gap-8 md:gap-10 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 hide-scrollbar overflow-visible"
          style={{
            ...optimizedStyle,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
            {teams.map((team, idx) => (
              <motion.div
                key={team.id}
                initial={isMobile ? { opacity: 1 } : { opacity: 0, x: 30 }}
                whileInView={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: isMobile ? 0 : 0.4, 
                  delay: isMobile ? 0 : Math.min(idx * 0.06, 0.3),
                  ease: "easeOut" 
                }}
                whileHover={isMobile ? {} : { scale: CARD_HOVER_SCALE }}
                className={`relative flex-shrink-0 w-[320px] sm:w-[360px] md:w-[400px] lg:w-[420px]
                           bg-white rounded-3xl shadow-lg border border-gray-100
                           overflow-visible snap-center flex flex-col ${isMobile ? '' : 'hover:shadow-2xl transition-shadow duration-300'}`}
                style={optimizedStyle}
              >
                {/* 상단 텍스트 영역 */}
                <div className="flex-shrink-0 p-6 sm:p-8 pb-4 sm:pb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                    {team.subject}{" "}
                    <span className="text-sky-600">{team.title}</span>
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {team.description || ''}
                  </p>
                </div>

                {/* 🔹 이미지 영역 (입체적 회전 효과 — 모든 교재 동일) */}
                <div className="flex-1 min-h-[240px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-[380px] py-4 sm:py-6 flex items-center justify-center relative perspective-[1200px] overflow-visible z-10">
                  {team.front_image_url ? (
                    <motion.div
                      initial={{ rotateY: 0 }}
                      whileHover={isMobile ? {} : { rotateY: 20 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="relative w-40 h-56 sm:w-52 sm:h-72 md:w-60 md:h-80 lg:w-64 lg:h-[22rem] transform-style-preserve-3d overflow-visible"
                      style={{
                        ...optimizedStyle,
                        transformOrigin: "center center"
                      }}
                    >
                      {/* 앞표지 */}
                      <div
                        className="absolute inset-0 bg-white rounded-md overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.45)]"
                        style={{ transform: "translateZ(0px)" }}
                      >
                        <Image
                          src={team.front_image_url}
                          alt={`${team.subject} 앞표지`}
                          fill
                          sizes="(max-width: 640px) 160px, (max-width: 768px) 208px, (max-width: 1024px) 240px, 256px"
                          className="object-cover"
                          quality={75}
                          loading={idx < 2 ? "eager" : "lazy"}
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-gray-100 w-40 h-56 sm:w-52 sm:h-72 md:w-60 md:h-80 lg:w-64 lg:h-[22rem] flex items-center justify-center text-gray-400 text-xs sm:text-sm rounded-md">
                      {team.subject} 교재 이미지
                    </div>
                  )}
                </div>

                {/* 하단 버튼 */}
                <div className="flex-shrink-0 flex justify-between items-center gap-3 px-6 sm:px-8 py-4 sm:py-6 border-t border-gray-100 bg-white/70 backdrop-blur-sm rounded-b-3xl">
                  <button className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>팀 소개</span>
                  </button>
                  <a
                    href={team.purchase_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>구입하기</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* 스크롤바 숨김 */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

