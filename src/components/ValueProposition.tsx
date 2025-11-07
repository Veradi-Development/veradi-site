"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useMobileDetect } from "@/hooks/useMobileDetect";

export default function ValueProposition() {
  const [stage, setStage] = useState(0);
  const [marginValue, setMarginValue] = useState("-25px");
  const [spacingCount, setSpacingCount] = useState(1);
  const isMobile = useMobileDetect();

  useEffect(() => {
    // 단계별 타이밍
    const timer1 = setTimeout(() => setStage(1), 800);   // VERA 등장
    const timer2 = setTimeout(() => setStage(2), 1600);  // DI 등장
    const timer3 = setTimeout(() => setStage(3), 2800);  // VERADI로 합치기

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    // 화면 크기에 따른 margin 조정
    const updateMargin = () => {
      if (window.innerWidth < 640) {
        setMarginValue("-33.5px");
        setSpacingCount(2);
      } else if (window.innerWidth < 768) {
        setMarginValue("-33px");
        setSpacingCount(2);
      } else if (window.innerWidth < 1024) {
        setMarginValue("-32px");
        setSpacingCount(2);
      } else if (window.innerWidth < 1440) {
        setMarginValue("-27px");
        setSpacingCount(1);
      } else {
        setMarginValue("-25px");
        setSpacingCount(1);
      }
    };

    updateMargin();
    window.addEventListener("resize", updateMargin);
    return () => window.removeEventListener("resize", updateMargin);
  }, []);

  // 애니메이션 설정 메모이제이션
  const glowAnimation = useMemo(() => ({
    filter: isMobile ? [] : [
      'drop-shadow(0 0 8px rgba(14, 165, 233, 0.3))',
      'drop-shadow(0 0 12px rgba(14, 165, 233, 0.4))',
      'drop-shadow(0 0 8px rgba(14, 165, 233, 0.3))',
    ]
  }), [isMobile]);

  const glowAnimationCyan = useMemo(() => ({
    filter: isMobile ? [] : [
      'drop-shadow(0 0 8px rgba(6, 182, 212, 0.3))',
      'drop-shadow(0 0 12px rgba(6, 182, 212, 0.4))',
      'drop-shadow(0 0 8px rgba(6, 182, 212, 0.3))',
    ]
  }), [isMobile]);

  const textGlowAnimation = useMemo(() => ({
    textShadow: isMobile ? [] : [
      '0 0 8px rgba(14, 165, 233, 0.2)',
      '0 0 12px rgba(14, 165, 233, 0.3)',
      '0 0 8px rgba(14, 165, 233, 0.2)',
    ]
  }), [isMobile]);

  const textGlowAnimationCyan = useMemo(() => ({
    textShadow: isMobile ? [] : [
      '0 0 8px rgba(6, 182, 212, 0.2)',
      '0 0 12px rgba(6, 182, 212, 0.3)',
      '0 0 8px rgba(6, 182, 212, 0.2)',
    ]
  }), [isMobile]);

  return (
    <section
      id="value-proposition"
      className="bg-gradient-to-b from-white via-blue-50/30 to-white text-gray-900 px-4 sm:px-6 pt-4 sm:pt-6 pb-20 sm:pb-28 md:pb-36 relative overflow-hidden"
    >
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-sky-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto text-center relative">
        <div className="relative h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* 합쳐진 후 배경 빛 효과 */}
            {stage >= 3 && !isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.5 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div 
                  className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-3xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 100%)'
                  }}
                />
              </motion.div>
            )}

            {/* VERA + DI가 합쳐지는 컨테이너 */}
            <motion.div
              className="flex items-center justify-center relative z-10 w-full"
              animate={{
                scale: stage >= 3 ? 1.2 : 1
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ 
                gap: stage >= 2 
                  ? (stage >= 3 ? "0px" : "48px") 
                  : "96px"
              }}
            >
              {/* VERA */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={stage >= 1 ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center"
                style={{
                  marginRight: stage >= 3 ? marginValue : "0px",
                  transition: "margin-right 0.8s ease-out"
                }}
              >
                <motion.div 
                  className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-2 sm:mb-3 transition-all duration-700 ${
                    stage >= 3
                      ? "bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent"
                      : "text-sky-700"
                  }`}
                  animate={stage >= 3 ? glowAnimation : {}}
                  transition={{
                    duration: 2,
                    repeat: isMobile ? 0 : Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {'\u00A0'.repeat(spacingCount)}VERA
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={stage >= 3 ? { opacity: 0, height: 0 } : { opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                  className="text-sm sm:text-base md:text-lg text-sky-600 overflow-hidden"
                >
                  VERITAS
                  <div className="text-xs sm:text-sm text-gray-600">진실</div>
                </motion.div>
              </motion.div>

              {/* + 기호 */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  stage >= 2
                    ? stage >= 3
                      ? { opacity: 0, scale: 0, width: 0, marginLeft: 0, marginRight: 0 }
                      : { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0 }
                }
                transition={{ duration: 0.4 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-400 font-light mx-2 sm:mx-4"
              >
                +
              </motion.div>

              {/* DI */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={stage >= 2 ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center"
              >
                <motion.div 
                  className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-2 sm:mb-3 transition-all duration-700 ${
                    stage >= 3
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                      : "text-cyan-600"
                  }`}
                  animate={stage >= 3 ? glowAnimationCyan : {}}
                  transition={{
                    duration: 2,
                    repeat: isMobile ? 0 : Infinity,
                    ease: "easeInOut"
                  }}
                >
                  DI
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={stage >= 3 ? { opacity: 0, height: 0 } : { opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                  className="text-sm sm:text-base md:text-lg text-cyan-600 overflow-hidden"
                >
                  Data Intelligence
                  <div className="text-xs sm:text-sm text-gray-600">데이터 인텔리전스</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* 설명 문구 */}
          <div className="absolute bottom-0 left-0 right-0 text-center">
            {/* VERITAS × Data Intelligence 배지 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={stage >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 sm:gap-3 relative">
                <motion.span 
                  className="text-sky-600 font-bold text-xs sm:text-sm md:text-base lg:text-lg tracking-wider"
                  animate={textGlowAnimation}
                  transition={{
                    duration: 2,
                    repeat: isMobile ? 0 : Infinity,
                    ease: "easeInOut"
                  }}
                >
                  VERITAS
                </motion.span>
                <span className="text-gray-300 font-light text-sm sm:text-base md:text-lg lg:text-xl">×</span>
                <motion.span 
                  className="text-cyan-600 font-bold text-xs sm:text-sm md:text-base lg:text-lg tracking-wider"
                  animate={textGlowAnimationCyan}
                  transition={{
                    duration: 2,
                    repeat: isMobile ? 0 : Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Data Intelligence
                </motion.span>
                {/* 밑줄 */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-sky-400/40 via-blue-400/40 to-cyan-400/40"
                  style={{ transformOrigin: 'center' }}
                />
              </div>
            </motion.div>

            {/* 설명 문구 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={stage >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto px-4"
            >
              체계적인 데이터 기반의 검증 과정을 통해
              <br />
              <span className="font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">진실된 콘텐츠</span>만을 선보입니다
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
