"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Subjects from "@/components/Subjects";
import Footer from "@/components/Footer";
import GridSeries from "@/components/GridSeries";
import GridSeries2 from "@/components/GridSeries2";
import VeradiIntro from "@/components/VeradiIntro";

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      <Navbar />
      <Hero />
      <section
        className="relative pt-20 md:pt-[240px] pb-32 md:pb-[180px]"
        style={{
          background: "linear-gradient(to bottom, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)",
          overflow: "visible",
        }}
      >
        {/* 단일 선 그리드 패턴 - 흰색 */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            backgroundPosition: "60px 0",
          }}
        />
        <div className="relative z-10">
          <GridSeries />
          <GridSeries2 />
        </div>
      </section>
      <Subjects />
      <VeradiIntro />
      <Footer />
    </main>
  );
}

