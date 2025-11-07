"use client";

import { motion } from "framer-motion";
import { optimizedStyle } from "@/constants/animations";

export default function Hero() {
  return (
    <section 
      className="relative flex items-start justify-center px-4 sm:px-6 overflow-hidden pt-40 sm:pt-48 md:pt-56"
      style={{
        minHeight: '100vh',
        ...optimizedStyle,
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: '100% auto',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1f1f1f'
      }}
    >
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-2 sm:px-4">
        {/* 첫 번째 타이틀 */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="mb-4 sm:mb-5 md:mb-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight" style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}>
            1% 로직을 당신의 것으로.
          </h1>
        </motion.div>

        {/* 두 번째 타이틀 */}
        <motion.p 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl lg:text-3xl font-semibold text-white drop-shadow-lg leading-tight px-2 sm:px-0"
        >
          고등 · 수능 zero to mastery
        </motion.p>
      </div>
    </section>
  );
}

