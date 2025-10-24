"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-blue-950 px-4 sm:px-6 overflow-hidden pt-0 sm:pt-4"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 회사 로고 워터마크 */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ top: '15%' }}>
          <div
            className="select-none pointer-events-none w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] md:w-[1200px] md:h-[1200px] lg:w-[1500px] lg:h-[1500px]"
            style={{
              opacity: 0.28,
              filter: 'brightness(0.3) sepia(1) saturate(5) hue-rotate(200deg) drop-shadow(0 0 90px rgba(96, 189, 250, 1)) drop-shadow(0 0 140px rgba(139, 92, 246, 1)) drop-shadow(0 0 210px rgba(59, 130, 246, 1)) drop-shadow(0 0 280px rgba(96, 189, 250, 0.7))',
              backgroundImage: 'url(/images/company-logo.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              willChange: 'opacity, filter',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>

        {/* 그라데이션 원들 - 거의 제거 */}
        <div className="absolute top-1/4 -left-24 sm:-left-48 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/2 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-24 sm:-right-48 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/2 rounded-full blur-3xl" />
        
        {/* 그리드 패턴 - 거의 안 보이게 */}
        <div 
          className="absolute inset-0 opacity-[0.01] sm:hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.01] hidden sm:block"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-2 sm:px-4">
        {/* 첫 번째 타이틀 - "고등 · 수능" */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-2 sm:mb-2.5 md:mb-3"
          style={{
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-semibold text-white">
            고등 · 수능
          </h2>
        </motion.div>

        {/* 두 번째 타이틀 - "zero to mastery" */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-4 sm:mb-5 md:mb-6"
          style={{
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent leading-tight">
            zero to mastery
          </h1>
        </motion.div>

        {/* 세 번째 타이틀 - 메인 강조 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-blue-100 leading-tight px-2 sm:px-0"
          style={{
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          1%의 풀이 로직이 당신에게로.
        </motion.p>
      </div>

      {/* 아래 스크롤 힌트 */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: [0, 10, 0] 
        }}
        transition={{ 
          opacity: { duration: 0.8, delay: 1.2 },
          scale: { duration: 0.4, delay: 1.2 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.6 }
        }}
        whileHover={{ 
          scale: 1.2,
          filter: "drop-shadow(0 0 8px rgba(96, 165, 250, 0.6))"
        }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 
                   cursor-pointer transition-all duration-300"
        style={{
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
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

