"use client";

import { motion } from "framer-motion";
import { useMobileDetect } from "@/hooks/useMobileDetect";

const optimizedStyle = {
  willChange: 'transform, opacity',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden' as const
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const scrollButtonAnimation = {
  initial: { opacity: 0, scale: 0.8, y: 0 },
  animate: {
    opacity: 1,
    scale: 1,
    y: [0, 10, 0]
  }
};

export default function Hero() {
  const isMobile = useMobileDetect();
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-blue-950 px-4 sm:px-6 overflow-hidden pt-0 sm:pt-4"
      style={optimizedStyle}
    >
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 회사 로고 워터마크 - 최적화된 그림자 효과 */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ top: '15%' }}>
          <div
            className="select-none pointer-events-none w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] md:w-[1200px] md:h-[1200px] lg:w-[1500px] lg:h-[1500px]"
            style={{
              ...optimizedStyle,
              opacity: 0.28,
              filter: isMobile 
                ? 'brightness(0.3) sepia(1) saturate(5) hue-rotate(200deg)' 
                : 'brightness(0.3) sepia(1) saturate(5) hue-rotate(200deg) drop-shadow(0 0 60px rgba(96, 189, 250, 0.6)) drop-shadow(0 0 120px rgba(59, 130, 246, 0.4))',
              backgroundImage: 'url(/images/company-logo.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </div>

        {/* 그라데이션 원들 */}
        <div className="absolute top-1/4 -left-24 sm:-left-48 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/2 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-24 sm:-right-48 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/2 rounded-full blur-3xl" />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-2 sm:px-4">
        {/* 첫 번째 타이틀 - "고등 · 수능" */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mb-2 sm:mb-2.5 md:mb-3"
        >
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-semibold text-white">
            고등 · 수능
          </h2>
        </motion.div>

        {/* 두 번째 타이틀 - "zero to mastery" */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="mb-4 sm:mb-5 md:mb-6"
        >
          <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent leading-tight">
            Zero To Mastery
          </h1>
        </motion.div>

        {/* 세 번째 타이틀 - 메인 강조 */}
        <motion.p
          {...fadeInUp}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-blue-100 leading-tight px-2 sm:px-0"
        >
          1%의 풀이 로직이 당신에게로.
        </motion.p>
      </div>

      {/* 아래 스크롤 힌트 */}
      <motion.button
        {...scrollButtonAnimation}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
        }}
        aria-label="스크롤 다운"
      >
        <svg 
          className="w-7 h-7 sm:w-8 sm:h-8 text-white/50 hover:text-white transition-colors" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          viewBox="0 0 24 24"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
    </section>
  );
}

