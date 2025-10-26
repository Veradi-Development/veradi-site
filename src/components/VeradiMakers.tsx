"use client";

import { motion } from "framer-motion";
import { useMobileDetect } from "@/hooks/useMobileDetect";

// 핵심 멤버 데이터 (이미지 + 역할 표시)
const coreMembers = [
  {
    name: "김대민",
    image: "/images/team/member1.png",
    role: "Founder & CEO",
    education: "서울대학교 경영학과",
    hasImage: true
  },
  {
    name: "이지수",
    image: "/images/team/member2.png",
    role: "Chief Education Officer",
    education: "연세대학교 수학교육학과",
    hasImage: true
  },
  {
    name: "박준영",
    image: "/images/team/member3.png",
    role: "Lead Developer",
    education: "KAIST 전산학부",
    hasImage: true
  },
  {
    name: "최서현",
    image: "/images/team/member4.png",
    role: "Content Director",
    education: "서울대학교 국어교육학과",
    hasImage: true
  }
];

// 일반 멤버 데이터 (이름 + 학벌만)
const teamMembers = [
  { name: "강민지", education: "고려대학교 화학교육학과", hasImage: false },
  { name: "윤태희", education: "서울대학교 물리학과", hasImage: false },
  { name: "정수빈", education: "연세대학교 생명과학과", hasImage: false },
  { name: "한지원", education: "KAIST 화학과", hasImage: false },
  { name: "오현우", education: "서울대학교 지구과학교육학과", hasImage: false },
  { name: "임채영", education: "고려대학교 수학교육학과", hasImage: false },
  { name: "신예린", education: "연세대학교 통계학과", hasImage: false },
  { name: "조민석", education: "성균관대학교 수학과", hasImage: false },
  { name: "배지훈", education: "한양대학교 교육학과", hasImage: false },
  { name: "서유진", education: "이화여대 수학교육학과", hasImage: false }
];

export default function VeradiMakers() {
  const isMobile = useMobileDetect();

  return (
    <section className="relative bg-white py-20 sm:py-28 md:py-36 px-4 sm:px-6 overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(56, 189, 248, 0.5) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.5) 0%, transparent 70%)' }}
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
              VERADI Makers
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            진실된 콘텐츠를 만들어가는 사람들
          </p>
        </motion.div>

        {/* 핵심 인물 그리드 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 40 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: isMobile ? 0 : 0.5, ease: "easeOut" }}
          className="mb-8 sm:mb-12"
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {coreMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={isMobile ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                whileInView={isMobile ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: isMobile ? 0 : 0.4, 
                  delay: isMobile ? 0 : Math.min(idx * 0.05, 0.15),
                  ease: "easeOut" 
                }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 text-center group p-6 sm:p-8"
              >
                {/* 이미지 - 빈 공간 */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300 relative">
                  {/* 빈 공간 */}
                </div>

                {/* 이름 플레이스홀더 */}
                <div className="flex justify-center mb-2">
                  <div className="h-5 sm:h-6 w-20 sm:w-24 bg-gray-300 rounded-full"></div>
                </div>

                {/* 역할 플레이스홀더 */}
                <div className="flex justify-center mb-2">
                  <div className="h-4 sm:h-5 w-24 sm:w-32 bg-gray-200 rounded-full"></div>
                </div>

                {/* 학벌 플레이스홀더 */}
                <div className="flex justify-center">
                  <div className="h-4 w-32 sm:w-40 bg-gray-200 rounded-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 일반 멤버 그리드 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 40 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: isMobile ? 0 : 0.5, ease: "easeOut" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={isMobile ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                whileInView={isMobile ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: isMobile ? 0 : 0.4, 
                  delay: isMobile ? 0 : Math.min(idx * 0.05, 0.3),
                  ease: "easeOut" 
                }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 text-center group p-4"
              >
                {/* 이름 플레이스홀더 */}
                <div className="flex justify-center mb-2">
                  <div className="h-4 sm:h-5 w-16 sm:w-20 bg-gray-300 rounded-full"></div>
                </div>

                {/* 학벌 플레이스홀더 */}
                <div className="flex justify-center">
                  <div className="h-3 w-24 sm:w-32 bg-gray-200 rounded-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

