"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

export default function ValueProposition() {
  const [stage, setStage] = useState(0);
  const [offsetX, setOffsetX] = useState(12);
  const [offsetXDI, setOffsetXDI] = useState(12);
  const [mergeScale] = useState(1.4);
  const [spacingCount, setSpacingCount] = useState(1);

  useEffect(() => {
    // 단계별 타이밍 - 각 애니메이션이 완료된 후 다음 단계 시작
    const timer1 = setTimeout(() => setStage(1), 100);   // VERA 등장
    const timer2 = setTimeout(() => setStage(2), 700);   // DI 등장 (VERA 완료 후)
    const timer3 = setTimeout(() => setStage(3), 1400);  // VERADI로 합치기 (DI 완료 후)

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    // 화면 크기에 따른 offset 조정
    const updateOffset = () => {
      if (window.innerWidth < 350) {
        setOffsetX(44);
        setOffsetXDI(30);
        setSpacingCount(2);
      } else if (window.innerWidth < 370) {
        setOffsetX(48);
        setOffsetXDI(35);
        setSpacingCount(2);
      } else if (window.innerWidth < 380) {
        setOffsetX(52);
        setOffsetXDI(40);
        setSpacingCount(2);
      } else if (window.innerWidth < 400) {
        setOffsetX(60);
        setOffsetXDI(42);
        setSpacingCount(2);
      } else if (window.innerWidth < 420) {
        setOffsetX(64);
        setOffsetXDI(49);
        setSpacingCount(2);
      } else if (window.innerWidth < 450) {
        setOffsetX(70);
        setOffsetXDI(54);
        setSpacingCount(2);
      } else if (window.innerWidth < 480) {
        setOffsetX(66);
        setOffsetXDI(50);
        setSpacingCount(2);
      } else if (window.innerWidth < 500) {
        setOffsetX(66);
        setOffsetXDI(50);
        setSpacingCount(2);
      }else if (window.innerWidth < 520) {
        setOffsetX(83);
        setOffsetXDI(72);
        setSpacingCount(2);
      } else if (window.innerWidth < 540) {
        setOffsetX(87);
        setOffsetXDI(78);
        setSpacingCount(2);
      } else if (window.innerWidth < 580) {
        setOffsetX(95);
        setOffsetXDI(78);
        setSpacingCount(2);
      } else if (window.innerWidth < 640) {
        setOffsetX(92);
        setOffsetXDI(80);
        setSpacingCount(2);
      } else if (window.innerWidth < 768) {
        setOffsetX(78);
        setOffsetXDI(57);
        setSpacingCount(2);
      } else if (window.innerWidth < 1024) {
        setOffsetX(67);
        setOffsetXDI(32);
        setSpacingCount(2);
      } else if (window.innerWidth < 1440) {
        setOffsetX(65);
        setOffsetXDI(15);
        setSpacingCount(1);
      } else {
        setOffsetX(70);
        setOffsetXDI(12);
        setSpacingCount(1);
      }
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  // 애니메이션 설정 메모이제이션
  const glowAnimation = useMemo(() => ({
    filter: [
      'drop-shadow(0 0 8px rgba(14, 165, 233, 0.3))',
      'drop-shadow(0 0 12px rgba(14, 165, 233, 0.4))',
      'drop-shadow(0 0 8px rgba(14, 165, 233, 0.3))',
    ]
  }), []);

  const glowAnimationCyan = useMemo(() => ({
    filter: [
      'drop-shadow(0 0 8px rgba(6, 182, 212, 0.3))',
      'drop-shadow(0 0 12px rgba(6, 182, 212, 0.4))',
      'drop-shadow(0 0 8px rgba(6, 182, 212, 0.3))',
    ]
  }), []);

  const textGlowAnimation = useMemo(() => ({
    textShadow: [
      '0 0 8px rgba(14, 165, 233, 0.2)',
      '0 0 12px rgba(14, 165, 233, 0.3)',
      '0 0 8px rgba(14, 165, 233, 0.2)',
    ]
  }), []);

  const textGlowAnimationCyan = useMemo(() => ({
    textShadow: [
      '0 0 8px rgba(6, 182, 212, 0.2)',
      '0 0 12px rgba(6, 182, 212, 0.3)',
      '0 0 8px rgba(6, 182, 212, 0.2)',
    ]
  }), []);

  return (
    <section
      id="value-proposition"
      className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white text-gray-900 px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden flex items-center justify-center"
    >
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-sky-200/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-6xl mx-auto text-center relative">
        <div className="relative min-h-[60vh] flex items-start justify-center pt-20 sm:pt-24 md:pt-28 lg:pt-32">
          <div className="absolute inset-0 flex items-start justify-center pt-[42px] sm:pt-[58px] md:pt-[74px]">
            {/* 합쳐진 후 배경 빛 효과 */}
            {stage >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.5 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.165, 0.84, 0.44, 1]
                }}
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
              className="relative z-10 w-full flex items-center justify-center"
            >
              {/* VERA - 고정 너비 컨테이너 */}
              <div style={{ width: '200px', display: 'flex', justifyContent: 'center' }}>
                {stage >= 1 && (
                  <motion.div
                    initial={{ x: -200, opacity: 0 }}
                    animate={
                      stage >= 3
                        ? { x: offsetX, opacity: 1, scale: mergeScale }
                        : { x: 0, opacity: 1, scale: 1 }
                    }
                    transition={{ 
                      type: "tween",
                      duration: 0.5,
                      ease: [0.165, 0.84, 0.44, 1]
                    }}
                    className="text-center"
                    style={{ 
                      willChange: 'transform, opacity'
                    }}
                  >
                <motion.div 
                  className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-2 sm:mb-3 ${
                    stage >= 3
                      ? ""
                      : "text-sky-700"
                  }`}
                  style={stage >= 3 ? { color: '#121945' } : {}}
                  animate={stage >= 3 ? glowAnimation : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {'\u00A0'.repeat(spacingCount)}VERA
                </motion.div>
                <motion.div
                  animate={stage >= 3 ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm sm:text-base md:text-lg text-sky-600"
                >
                  VERITAS
                  <div className="text-xs sm:text-sm text-gray-600">진실</div>
                </motion.div>
                  </motion.div>
                )}
              </div>

              {/* + 기호 - 항상 80px 유지 */}
              <div 
                style={{ 
                  width: '80px',
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}
              >
                {stage >= 2 && stage < 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-400 font-light"
                    style={{ 
                      willChange: 'transform, opacity'
                    }}
                  >
                    +
                  </motion.div>
                )}
              </div>

              {/* DI - 고정 너비 컨테이너 */}
              <div style={{ width: '200px', display: 'flex', justifyContent: 'center' }}>
                {stage >= 2 && (
                  <motion.div
                    initial={{ x: 200, opacity: 0 }}
                    animate={
                      stage >= 3
                        ? { x: -offsetXDI, opacity: 1, scale: mergeScale }
                        : { x: 0, opacity: 1, scale: 1 }
                    }
                    transition={{ 
                      type: "tween",
                      duration: 0.5,
                      ease: [0.165, 0.84, 0.44, 1]
                    }}
                    className="text-center"
                    style={{ 
                      willChange: 'transform, opacity'
                    }}
                  >
                <motion.div 
                  className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-2 sm:mb-3 ${
                    stage >= 3
                      ? ""
                      : "text-cyan-600"
                  }`}
                  style={stage >= 3 ? { color: '#121945' } : {}}
                  animate={stage >= 3 ? glowAnimationCyan : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  DI
                </motion.div>
                <motion.div
                  animate={stage >= 3 ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm sm:text-base md:text-lg text-cyan-600"
                >
                  Data Intelligence
                  <div className="text-xs sm:text-sm text-gray-600">데이터 인텔리전스</div>
                </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* 설명 문구 */}
          <div className="absolute top-[160px] sm:top-[180px] md:top-[200px] left-0 right-0 text-center">
            {/* VERITAS × Data Intelligence 배지 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={stage >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.3,
                ease: [0.165, 0.84, 0.44, 1]
              }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 sm:gap-3 relative">
                <motion.span 
                  className="text-sky-600 font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-wider"
                  animate={textGlowAnimation}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  VERITAS
                </motion.span>
                <span className="text-gray-300 font-light text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">×</span>
                <motion.span 
                  className="text-cyan-600 font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-wider"
                  animate={textGlowAnimationCyan}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Data Intelligence
                </motion.span>
                {/* 밑줄 */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.5,
                    ease: [0.165, 0.84, 0.44, 1]
                  }}
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-sky-400/40 via-blue-400/40 to-cyan-400/40"
                  style={{ transformOrigin: 'center' }}
                />
              </div>
            </motion.div>

            {/* 설명 문구 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={stage >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.6,
                ease: [0.165, 0.84, 0.44, 1]
              }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-700 leading-relaxed max-w-3xl mx-auto px-4"
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
