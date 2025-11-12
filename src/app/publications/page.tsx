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
const CARD_HOVER_SCALE = 1.03;
const optimizedStyle = {
  willChange: 'transform' as const,
  backfaceVisibility: 'hidden' as const
};

// 교재 시리즈 데이터 타입
type BookData = {
  id: string;
  title: string;
  subject: string;
  main_image_url: string | null; // 문제집 이미지
  sub_image_url: string | null; // 해설집 이미지
  link: string;
  display_order: number;
};

type PublicationGuide = {
  main_title: string;
  hero_title: string;
  video_url: string | null;
  hero_image_url: string | null;
};

type PublicationSection = {
  category: string;
  title: string;
  guide_url: string | null;
  use_subjects_background: boolean;
};

// 교재 섹션 컴포넌트 (GridSeries 스타일)
function BookSeriesSection({
  title,
  books,
  guideUrl,
  useSubjectsBackground = false,
  isFirstSection = false
}: {
  title: string;
  books: BookData[];
  guideUrl?: string | null;
  useSubjectsBackground?: boolean;
  isFirstSection?: boolean;
}) {
  const isMobile = useMobileDetect();
  const { scrollRef, canScrollLeft, canScrollRight, scroll, recheckScroll } = useHorizontalScroll({
    scrollAmountRatio: SCROLL_AMOUNT_RATIO,
  });
  
  if (books.length === 0) return null;

  // 카드 배경 색상 (GridSeries 스타일)
  const cardBgs = [
    'linear-gradient(135deg, rgb(29, 78, 216) 0%, rgb(30, 64, 175) 50%, rgb(37, 99, 235) 100%)',
    'linear-gradient(135deg, rgb(154, 52, 18) 0%, rgb(194, 65, 12) 50%, rgb(234, 88, 12) 100%)',
    'linear-gradient(135deg, rgb(20, 83, 45) 0%, rgb(22, 101, 52) 50%, rgb(21, 128, 61) 100%)',
    'linear-gradient(135deg, rgb(30, 27, 75) 0%, rgb(49, 46, 129) 50%, rgb(67, 56, 202) 100%)',
  ];

  // 배경 스타일 선택
  const backgroundStyle = useSubjectsBackground ? {
    // 크림 배경 (Subjects.tsx와 동일)
    background: 'linear-gradient(to bottom, #f5f1eb 0%, #ede8e1 50%, #e8e3dc 100%)',
  } : {}; // 그리드 배경은 section에 직접 적용

  return (
    <section 
      className="relative overflow-x-hidden overflow-y-visible"
      style={useSubjectsBackground ? backgroundStyle : {
        background: "linear-gradient(to bottom, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)",
      }}
    >
      {/* 그리드 배경일 때만 그리드 패턴 표시 */}
      {!useSubjectsBackground && (
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            backgroundPosition: "60px 0",
          }}
        />
      )}
      
      {/* 레이아웃: 크림 배경은 세로, 그리드 배경은 좌우 */}
      <div className={`pb-20 md:pb-[120px] ${
        isFirstSection 
          ? 'pt-32 sm:pt-36 md:pt-40 lg:pt-28' // 첫 번째 섹션: md 이하에서 간격 더 넓게
          : 'pt-12 sm:pt-16 md:pt-20 lg:pt-28' // 나머지 섹션: md 이하에서 간격 좁게
      } ${useSubjectsBackground ? '' : 'pl-6 lg:pl-0'}`}>
        <div className={`flex flex-col ${
          useSubjectsBackground 
            ? 'gap-4 sm:gap-6 md:gap-8 md:flex-col px-4 sm:px-6 md:px-8 lg:px-12' // 크림: md 이하에서 넓게
            : 'gap-4 sm:gap-4 md:gap-4 lg:gap-8 lg:flex-row lg:items-start lg:pl-[60px] lg:pr-0 lg:ml-[30px]' // 그리드: md 이하에서 좁게
        }`}>
          {/* 텍스트 카드 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.2 }}
            transition={{ duration: isMobile ? 0 : 0.6, ease: "easeOut" }}
            className={`flex-shrink-0 w-full ${
              useSubjectsBackground 
                ? '' // 크림: 전체 너비
                : 'lg:w-[360px] lg:-ml-[60px]' // 그리드: 고정 너비 + 왼쪽으로
            }`}
            style={{ marginBottom: "0" }}
        >
            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-4">
              <h2 className={`font-bold tracking-tight leading-[1.1] ${
                useSubjectsBackground 
                  ? 'text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl' // 크림: 400px 이하에서 작게
                  : 'text-white text-2xl sm:text-3xl md:text-4xl lg:text-[45px]' // 그리드: 400px 이하에서 작게
              }`}>
            {title}
          </h2>
          
          {/* 더 알아보기 링크 */}
          {guideUrl && (
            <a
              href={guideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 text-sm md:text-base font-medium group transition-colors whitespace-nowrap ${
                useSubjectsBackground 
                  ? 'text-sky-600 hover:text-sky-700'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              더 알아보기
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
            </div>
        </motion.div>

          {/* 슬라이드 또는 그리드 영역 */}
          {useSubjectsBackground ? (
            // 크림 배경: 그리드 레이아웃 (Subjects.tsx 스타일)
            <motion.div
              initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px", amount: 0.2 }}
              transition={{ duration: isMobile ? 0 : 0.5, ease: "easeOut" }}
              className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-20 lg:gap-24 mt-2 sm:mt-4 md:mt-6 lg:mt-8"
            >
          {books.map((book, idx) => (
            <motion.div
              key={book.id}
                  initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
                  whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: isMobile ? 0 : 0.4, 
                    delay: isMobile ? 0 : Math.min(idx * 0.08, 0.4),
                ease: "easeOut" 
              }}
                  className="relative flex flex-col overflow-visible"
                  style={{paddingTop: '40px', marginTop: '-40px'}}
                >
              {/* 이미지 영역 */}
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-5 perspective-[1200px] overflow-visible group"
                  >
                    {book.main_image_url ? (
                  <motion.div
                    initial={{ rotateY: 0 }}
                    whileHover={isMobile ? {} : { rotateY: 20 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="relative w-full aspect-[3/4] transform-style-preserve-3d"
                    style={{
                      ...optimizedStyle,
                      transformOrigin: "center center"
                    }}
                  >
                        <div className="relative w-full h-full overflow-hidden rounded-lg shadow-[0_25px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-shadow duration-300">
                      <Image
                            src={book.main_image_url}
                            alt={`${book.subject}`}
                        fill
                            sizes="(max-width: 640px) 260px, (max-width: 768px) 280px, 300px"
                            className="object-cover group-hover:invert transition-all duration-300"
                        quality={75}
                        loading={idx < 2 ? "eager" : "lazy"}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                      />
                    </div>
                        
                        {/* 구입하기 오버레이 */}
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform group-hover:translate-y-0 translate-y-2">
                          <span className="bg-white text-black px-4 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-lg border border-gray-200">
                            구입하기
                          </span>
                    </div>
                  </motion.div>
                ) : (
                      <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs shadow-lg">
                        이미지 없음
                      </div>
                    )}
                  </a>

                  {/* 텍스트 정보 */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-tight">
                      {book.subject}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // 그리드 배경: 슬라이드 레이아웃
            <div className="relative overflow-visible flex-1 mt-4 sm:mt-4 md:mt-4 lg:mt-0 lg:ml-[30px]" style={{ 
              minWidth: '0',
              marginLeft: '0',
              marginRight: '0'
            }}>
              {/* 화살표 버튼 */}
              {!isMobile && (
                <>
                  <button
                    onClick={() => scroll("left")}
                    disabled={!canScrollLeft}
                    className={`hidden lg:block absolute p-2 sm:p-3 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 z-20 ${
                      canScrollLeft
                        ? "bg-white/80 hover:bg-white hover:shadow-xl hover:scale-110 cursor-pointer"
                        : "bg-white/30 opacity-40 cursor-not-allowed"
                    }`}
                    style={{
                      left: '-20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                    aria-label="이전 슬라이드"
                  >
                    <ArrowLeft className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${canScrollLeft ? "text-gray-700" : "text-gray-400"}`} />
                  </button>

                  <button
                    onClick={() => scroll("right")}
                    disabled={!canScrollRight}
                    className={`hidden lg:block absolute p-2 sm:p-3 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 z-20 ${
                      canScrollRight
                        ? "bg-white/80 hover:bg-white hover:shadow-xl hover:scale-110 cursor-pointer"
                        : "bg-white/30 opacity-40 cursor-not-allowed"
                    }`}
                    style={{
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                    aria-label="다음 슬라이드"
                  >
                    <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${canScrollRight ? "text-gray-700" : "text-gray-400"}`} />
                  </button>
                </>
              )}

              {/* 슬라이드 컨테이너 */}
              <motion.div
                ref={scrollRef}
                initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
                whileInView={isMobile ? { opacity: 1 } : { opacity: 1 }}
                viewport={{ once: true, margin: "-50px", amount: 0.2 }}
                transition={{ duration: isMobile ? 0 : 0.6, ease: "easeOut" }}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 hide-scrollbar gap-5 md:gap-[30px]"
                style={{
                  ...optimizedStyle,
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {books.map((book, idx) => {
                  const bg = cardBgs[idx % 4];
                  
                  return (
                    <div
                      key={book.id}
                      className="relative flex-shrink-0 snap-start overflow-visible rounded-3xl w-[300px] sm:w-[400px] md:w-[480px] h-[350px] sm:h-[380px] md:h-[420px]"
                      style={{
                        ...optimizedStyle,
                        scrollSnapAlign: 'start',
                      }}
                    >
                      {/* 카드 배경 */}
                      <div 
                        className="absolute inset-0 transition-all duration-300"
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
                      
                      {/* 테두리 */}
                      <div 
                        className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
                          isMobile ? '' : 'group-hover:border-blue-400'
                        }`}
                        style={{
                          border: '2px solid rgb(255, 255, 255)',
                          borderRadius: '32px',
                        }}
                      />

                      {/* 그리드 배경: GridSeries 스타일 */}
                <a
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                        className={`group relative w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer ${isMobile ? 'pointer-events-auto' : ''}`}
                      >
                    {/* 과목명 */}
                    <h3 className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 text-lg sm:text-xl md:text-2xl font-bold text-black z-30" style={{ textShadow: '0 1px 3px rgba(255,255,255,0.2)' }}>
                      {book.subject}
                    </h3>

                    {/* 책 이미지 컨테이너 - 겹치게 배치 */}
                    <motion.div 
                      className="relative flex items-center justify-center h-full" 
                      style={{ marginTop: '30px' }}
                      whileHover={isMobile ? {} : { y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* 해설집 (뒤쪽) */}
                      {book.sub_image_url && (
                        <div 
                          className={`relative overflow-hidden bg-white border-2 border-gray-200 ${isMobile ? '' : 'group-hover:border-blue-400 transition-all duration-300'} w-[165px] h-[230px] sm:w-[160px] sm:h-[220px] md:w-[200px] md:h-[280px]`}
                          style={{
                            ...optimizedStyle,
                            boxShadow: '0 30px 70px rgba(0,0,0,0.7), 0 20px 40px rgba(0,0,0,0.6), 0 10px 20px rgba(0,0,0,0.5)',
                            zIndex: 1,
                          }}
                        >
                          <Image
                            src={book.sub_image_url}
                            alt={`${book.subject} 해설집`}
                            fill
                            sizes="(max-width: 640px) 165px, (max-width: 768px) 160px, 200px"
                            className="object-cover"
                            quality={75}
                            loading={idx < 2 ? "eager" : "lazy"}
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                            onLoad={() => recheckScroll()}
                          />
                        </div>
                      )}

                      {/* 문제집 (앞쪽) */}
                      {book.main_image_url && (
                        <div 
                          className={`relative overflow-hidden bg-white border-2 border-gray-200 ${isMobile ? '' : 'group-hover:border-blue-400 transition-all duration-300'} w-[165px] h-[230px] sm:w-[160px] sm:h-[220px] md:w-[200px] md:h-[280px] ${book.sub_image_url ? '-ml-[85px] sm:-ml-[60px] md:-ml-[80px] -mt-[45px] sm:-mt-[35px] md:-mt-[50px]' : ''}`}
                          style={{
                            ...optimizedStyle,
                            boxShadow: '0 40px 90px rgba(0,0,0,0.8), 0 30px 60px rgba(0,0,0,0.7), 0 20px 40px rgba(0,0,0,0.6)',
                            zIndex: 2,
                          }}
                        >
                          <Image
                            src={book.main_image_url}
                            alt={`${book.subject} 문제집`}
                            fill
                            sizes="(max-width: 640px) 165px, (max-width: 768px) 160px, 200px"
                            className="object-cover"
                            quality={75}
                            loading={idx < 2 ? "eager" : "lazy"}
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                            onLoad={() => recheckScroll()}
                          />
                        </div>
                      )}
                    </motion.div>

                        {/* 구입하기 버튼 - 호버 시 표시 */}
                        {book.link && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 backdrop-blur-sm text-gray-900 px-8 py-3 rounded-lg text-base font-bold shadow-2xl pointer-events-auto border-2 border-gray-800">
                              구입하기
                            </span>
                          </div>
                        )}
                </a>
              </div>
                  );
                })}
            </motion.div>
            </div>
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
    </section>
  );
}

export default function Publications() {
  const isMobile = useMobileDetect();
  const [guide, setGuide] = useState<PublicationGuide | null>(null);
  const [sections, setSections] = useState<PublicationSection[]>([]);
  const [booksByCategory, setBooksByCategory] = useState<Record<string, BookData[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 데이터 로드
    const fetchData = async () => {
      try {
        // 가이드 섹션 로드
        const guideRes = await fetch('/api/publication-guide');
        if (guideRes.ok) {
          const guideData = await guideRes.json();
          setGuide(guideData);
        }

        // 섹션 설정 로드
        const sectionsRes = await fetch('/api/publication-sections');
        if (sectionsRes.ok) {
          const sectionsData = await sectionsRes.json();
          if (Array.isArray(sectionsData)) {
            setSections(sectionsData);
          }
        }

        // 교재 로드 (type='publication')
        const booksRes = await fetch('/api/books?type=publication');
        if (booksRes.ok) {
          const booksData = await booksRes.json();
          if (Array.isArray(booksData)) {
            // 카테고리별로 그룹화
            const grouped: Record<string, BookData[]> = {};
            booksData.forEach((book: {
              id: string;
              title: string;
              subject: string;
              main_image_url: string | null;
              sub_image_url: string | null;
              purchase_link?: string;
              display_order?: number;
              category?: string;
            }) => {
              if (book.category) {
                const category = book.category;
                if (!grouped[category]) {
                  grouped[category] = [];
                }
                grouped[category].push({
                  id: book.id,
                  title: book.title,
                  subject: book.subject,
                  main_image_url: book.main_image_url,
                  sub_image_url: book.sub_image_url,
                  link: book.purchase_link || '#',
                  display_order: book.display_order || 0,
                });
              }
            });
            
            // 각 카테고리 내에서 display_order로 정렬
            Object.keys(grouped).forEach(category => {
              grouped[category].sort((a, b) => a.display_order - b.display_order);
            });
            
            setBooksByCategory(grouped);
          }
        }
      } catch (error) {
        console.error('Error fetching publications data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="bg-white text-gray-900 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">로딩 중...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      <Navbar />
      
      {/* Apple 스타일 히어로 섹션 - 완벽활용가이드 */}
      <section id="guide-section" className="pt-24 px-4 sm:px-6 md:px-4 lg:px-6 bg-gradient-to-b from-gray-50 to-white lg:min-h-screen lg:flex lg:items-center lg:pt-0">
        <div className="max-w-[1400px] mx-auto w-full py-0 lg:py-0">
          {/* 제목 */}
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.5 }}
            className="text-left mb-8 sm:mb-12 md:mb-8 lg:mb-2"
          >
            <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              {guide?.main_title || '완벽활용가이드'}
            </h1>
          </motion.div>

          {/* 메인 이미지 + 텍스트 오버레이 섹션 */}
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.5, delay: isMobile ? 0 : 0.1 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 sm:mb-24 md:mb-16 lg:mb-0"
          >
            {/* 배경 이미지 - 책 들고 있는 사람 */}
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[70vh]">
              {guide?.hero_image_url ? (
                <Image 
                  src={guide.hero_image_url} 
                  alt="VERADI 완벽활용가이드"
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
                  <div className="absolute inset-0 flex items-center justify-end pr-8 sm:pr-16 md:pr-24 lg:pr-32">
                    <div className="text-gray-400 text-center">
                      <div className="text-6xl sm:text-8xl mb-4">📚</div>
                      <p className="text-sm sm:text-base">책 들고 있는 사진<br/>(준비 중)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 왼쪽 텍스트 + 버튼 오버레이 */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full max-w-xl px-6 sm:px-12 md:px-16 lg:px-20">
                  <motion.div
                    initial={isMobile ? { opacity: 1 } : { opacity: 0, x: -30 }}
                    animate={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    transition={{ duration: isMobile ? 0 : 0.5, delay: isMobile ? 0 : 0.2 }}
                    className="space-y-4 sm:space-y-6 text-center"
                  >
                    <div>
                      <h2 
                        className="text-lg sm:text-xl md:text-[1.75rem] lg:text-3xl font-bold text-gray-900 leading-tight"
                        dangerouslySetInnerHTML={{ __html: guide?.hero_title || 'VERADI 교재,<br />제대로 활용하기' }}
                      />
                    </div>

                    {/* 동영상 보기 버튼 */}
                    {guide?.video_url && (
                      <div className="flex justify-center">
                        <a
                          href={guide.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-xl group text-xs sm:text-sm md:text-base"
                        >
                          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" />
                          <span>동영상 보기</span>
                        </a>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 각 교재 시리즈 섹션 - 동적으로 생성 */}
      {sections.map((section, index) => (
        <BookSeriesSection
          key={section.category}
          title={section.title}
          books={booksByCategory[section.category] || []}
          guideUrl={section.guide_url}
          useSubjectsBackground={section.use_subjects_background}
          isFirstSection={index === 0}
        />
      ))}

      <Footer />
    </main>
  );
}

