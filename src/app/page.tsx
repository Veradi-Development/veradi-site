"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Subjects from "@/components/Subjects";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import GridSeries from "@/components/GridSeries";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main className="bg-white text-gray-900">
      <Navbar />
      <Hero />
      <GridSeries />
      <Subjects />
      <Team />
      <Footer />
    </main>
  );
}

