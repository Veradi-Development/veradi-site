"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Navbar />
      <main className="bg-white text-gray-900 relative" style={{ position: 'relative', zIndex: 10 }}>
        {/* 추가 콘텐츠 */}
      </main>
      <div className="relative" style={{ zIndex: 10 }}>
        <Footer />
      </div>
    </>
  );
}

