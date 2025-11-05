"use client";

import { motion } from "framer-motion";
import { useMobileDetect } from "@/hooks/useMobileDetect";

const highlights = [
  {
    title: "SKY/의치한약수, 최상위권 대학 출신 팀원들로 구성",
    desc: "검증된 전문성, 고등 입시/교육 통합 R&D팀"
  },
];

export default function Team() {
  const isMobile = useMobileDetect();
  
  return (
    <section className="bg-white px-6 py-28">
      <div className="max-w-6xl mx-auto">
        {/* 헤드라인 */}
        <motion.h2
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0 : 0.5 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold mb-6 leading-snug text-left"
        >
          국내 최상위권 연구진이 만드는, <br className="hidden md:block" />
          가장 신뢰할 수 있는 교육 콘텐츠
        </motion.h2>

        <motion.p
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ delay: isMobile ? 0 : 0.1, duration: isMobile ? 0 : 0.5 }}
          viewport={{ once: true }}
          className="text-gray-600 text-lg mb-20 max-w-3xl leading-relaxed text-left"
        >
          의대·치대·한의대·수의대·약대 등 전문직 계열과 <br />
          서울대·연세대·고려대 등 SKY 및 상위권 대학 출신 인재 다수.
          <br />
          입시 경험과 학문적 깊이를 동시에 제공하는 교육 콘텐츠 팀.
        </motion.p>

        {/* 하이라이트 */}
        <div className="flex justify-start mb-20">
          {highlights.map((h, idx) => (
            <motion.div
              key={idx}
              initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 40 }}
              whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0 : Math.min(idx * 0.1, 0.2), duration: isMobile ? 0 : 0.5 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow text-center max-w-2xl w-full"
            >
              <p className="text-base md:text-lg text-gray-900">
                {h.title}
              </p>
              <p className="text-base md:text-lg text-gray-900">{h.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* 숫자 강조 */}
        <div className="grid grid-cols-2 gap-10 md:gap-20 text-center mb-20 max-w-2xl">
          <div>
            <div className="text-4xl font-extrabold text-sky-600">23</div>
            <p className="text-gray-600 mt-2">의료 및 전문직 출신 연구진</p>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-sky-600">25</div>
            <p className="text-gray-600 mt-2">SKY·상위권 출신 연구진</p>
          </div>
        </div>
      </div>
    </section>
  );
}

