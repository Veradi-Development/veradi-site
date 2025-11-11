"use client";

import { motion } from "framer-motion";
import { useMobileDetect } from "@/hooks/useMobileDetect";

export default function VeradiIntro() {
  const isMobile = useMobileDetect();

  return (
    <section className="relative bg-white py-24 sm:py-32 px-2 sm:px-4">
      <div className="max-w-[1300px] mx-auto px-2 md:px-4">
        {/* 제목 - 전체 너비 */}
        <motion.h2
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-16 leading-tight text-left"
        >
          진실(Vera)을 말하다(di), VERADI
        </motion.h2>

        {/* 4개 항목 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-x-60 lg:gap-y-12">
          {/* 1. '진짜' 콘텐츠를 만드는 곳 */}
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col"
          >
            <div className="space-y-4 text-gray-700">
              <div className="mb-4">
                <span className="text-2xl sm:text-3xl inline-block" style={{ filter: 'grayscale(100%) brightness(0)' }}>🌐</span>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold">
                &apos;진짜&apos; 콘텐츠를 만드는 곳
              </p>
              
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
                단순 양산형이 아닌 가장 교육과정에 입각한 수능스러운 콘텐츠를 만드는 곳
              </p>
            </div>
          </motion.div>

          {/* 2. 국내 최상위권 대학 진학자들로만 구성 */}
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: isMobile ? 0 : 0.1, ease: "easeOut" }}
            className="flex flex-col"
          >
            <div className="space-y-4 text-gray-700">
              <div className="mb-4">
                <span className="text-2xl sm:text-3xl inline-block" style={{ filter: 'grayscale(100%) brightness(0)' }}>🎓</span>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold">
                국내 최상위권 대학 진학자들로만 구성
              </p>
              
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
                의치한수약 전문직 계열과 SKY 등 상위권 대학 출신 인재들로만 구성된 최상위 교육 R&D 팀
              </p>
            </div>
          </motion.div>

          {/* 3. 1% 최상위권의 논리 구조 */}
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: isMobile ? 0 : 0.2, ease: "easeOut" }}
            className="flex flex-col"
          >
            <div className="space-y-4 text-gray-700">
              <div className="mb-4">
                <span className="text-2xl sm:text-3xl inline-block" style={{ filter: 'grayscale(100%) brightness(0)' }}>🔒</span>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold">
                1% 최상위권의 논리 구조
              </p>
              
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
                1% 최상위권의 논리 구조를 분해하여 모두 담아내고 체화시키는 유일무이한 콘텐츠, 95% 이상의 만족도
              </p>
            </div>
          </motion.div>

          {/* 4. 출제 9년차, 검증된 전문성 */}
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: isMobile ? 0 : 0.3, ease: "easeOut" }}
            className="flex flex-col"
          >
            <div className="space-y-4 text-gray-700">
              <div className="mb-4">
                <span className="text-2xl sm:text-3xl inline-block" style={{ filter: 'grayscale(100%) brightness(0)' }}>🔬</span>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold">
                검증된 전문성과 특화된 연구진
              </p>
              
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
                출제 9년차, 검증된 전문성과 고등 학습·입시에 특화된 연구진
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

