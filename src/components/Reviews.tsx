"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useState, useEffect } from "react";
import { useMobileDetect } from "@/hooks/useMobileDetect";

type Review = {
  id: string;
  name: string;
  school: string;
  content: string;
  rating: number;
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMobileDetect();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setReviews(data);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);
  return (
    <section className="relative bg-gradient-to-b from-blue-50 via-white to-blue-50/50 py-20 sm:py-28 md:py-36 px-4 sm:px-6 overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-10 left-10 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 섹션 제목 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: isMobile ? 0 : 0.5, ease: "easeOut" }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              학생 후기
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            VERADI와 함께한 학생들의 진솔한 이야기
          </p>
        </motion.div>

        {/* 후기 슬라이더 (모바일) / 그리드 (데스크톱) */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">등록된 후기가 없습니다</p>
          </div>
        ) : (
          <div className="relative">
            {/* 모바일: 가로 스크롤 */}
            <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-4 pb-4">
                {reviews.map((review, idx) => (
                <motion.div
                  key={review.name}
                  initial={isMobile ? { opacity: 1 } : { opacity: 0, x: 50 }}
                  whileInView={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: isMobile ? 0 : 0.4, 
                    delay: isMobile ? 0 : Math.min(idx * 0.05, 0.2),
                    ease: "easeOut" 
                  }}
                  className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex-shrink-0 w-[85vw] max-w-[340px]"
                >
                  {/* 따옴표 아이콘 */}
                  <div className="absolute top-4 right-4 text-sky-200">
                    <Quote className="w-10 h-10" />
                  </div>

                  {/* 별점 */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>

                  {/* 후기 내용 */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 relative z-10 min-h-[60px]">
                    &ldquo;{review.content}&rdquo;
                  </p>

                  {/* 학생 정보 */}
                  <div className="pt-3 border-t border-gray-100">
                    <p className="font-bold text-gray-900 text-base">
                      {review.name}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {review.school}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 데스크톱: 그리드 */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.name}
                initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 50 }}
                whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: isMobile ? 0 : 0.4, 
                  delay: isMobile ? 0 : Math.min(idx * 0.08, 0.24),
                  ease: "easeOut" 
                }}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-200 border border-gray-100"
              >
                {/* 따옴표 아이콘 */}
                <div className="absolute top-4 right-4 text-sky-200">
                  <Quote className="w-12 h-12" />
                </div>

                {/* 별점 */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* 후기 내용 */}
                <p className="text-gray-700 text-base leading-relaxed mb-6 relative z-10">
                  &ldquo;{review.content}&rdquo;
                </p>

                {/* 학생 정보 */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-bold text-gray-900 text-lg">
                    {review.name}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {review.school}
                  </p>
                </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 하단 문구 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: isMobile ? 0 : 0.4, ease: "easeOut" }}
          className="text-center mt-16 sm:mt-20"
        >
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium">
            당신도 VERADI와 함께 <span className="text-sky-600 font-bold">1%의 성공</span>을 경험하세요
          </p>
        </motion.div>
      </div>
    </section>
  );
}

