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
      <GridSeries />
      <GridSeries2 />
      <Subjects />
      <VeradiIntro />
      <Footer />
    </main>
  );
}

