"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useMobileDetect } from "@/hooks/useMobileDetect";

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
  price?: string;
};

export default function Subjects() {
  const [teams, setTeams] = useState<SubjectBook[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMobileDetect();

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
      className="relative bg-gradient-to-b from-white to-blue-50 py-16 sm:py-24 md:py-32 px-2 sm:px-4 overflow-visible"
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
      <div className="max-w-[1400px] mx-auto px-2 md:px-4">
        {/* 제목 */}
        <motion.h2
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.2 }}
          transition={{ duration: isMobile ? 0 : 0.6, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl text-left font-bold text-gray-900 mb-16 leading-tight tracking-tight"
        >
          Subjects & Series
        </motion.h2>

        {/* 그리드 컨테이너 */}
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
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px", amount: 0.2 }}
          transition={{ duration: isMobile ? 0 : 0.5, ease: "easeOut" }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 md:gap-20 lg:gap-24"
        >
            {teams.map((team, idx) => (
              <motion.div
                key={team.id}
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
                  href={team.purchase_link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-5 perspective-[1200px] overflow-visible group"
                >
                  {team.front_image_url ? (
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
                      <div className="relative w-full h-full overflow-hidden rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.4)] transition-shadow duration-300">
                        <Image
                          src={team.front_image_url}
                          alt={`${team.subject} ${team.title}`}
                          fill
                          sizes="(max-width: 640px) 300px, (max-width: 768px) 350px, 400px"
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
                    {team.title} ({team.subject}) 모의고사
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {team.description || '교재 설명'}
                  </p>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mt-1">
                    {team.price || '가격 문의'}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

