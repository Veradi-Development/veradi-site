"use client";

import { motion } from "framer-motion";
import { GraduationCap, Stethoscope, Users } from "lucide-react";
import { useMobileDetect } from "@/hooks/useMobileDetect";

const highlights = [
  {
    icon: GraduationCap,
    title: "이공계열 최상위권",
    desc: "전문직 계열 팀장·팀원 다수",
  },
  {
    icon: Stethoscope,
    title: "의·치·한·수·약 집중",
    desc: "의료 및 전문직 계열 중심",
  },
  {
    icon: Users,
    title: "입시 + 학문적 깊이",
    desc: "경험과 연구를 겸비한 콘텐츠",
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {highlights.map((h, idx) => {
            const Icon = h.icon;
            return (
              <motion.div
                key={idx}
                initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 40 }}
                whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ delay: isMobile ? 0 : Math.min(idx * 0.1, 0.2), duration: isMobile ? 0 : 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {h.title}
                </h3>
                <p className="text-gray-600 text-base">{h.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 숫자 강조 (중앙 정렬 유지) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center mb-20">
          <div>
            <div className="text-4xl font-extrabold text-sky-600">23</div>
            <p className="text-gray-600 mt-2">의료 및 전문직 출신 연구진</p>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-sky-600">25</div>
            <p className="text-gray-600 mt-2">SKY·상위권 출신 연구진</p>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-sky-600">100%</div>
            <p className="text-gray-600 mt-2">실전 지향 콘텐츠</p>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-sky-600">∞</div>
            <p className="text-gray-600 mt-2">학문적 깊이</p>
          </div>
        </div>
      </div>
    </section>
  );
}

