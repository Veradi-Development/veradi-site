"use client";

import Navbar from "@/components/Navbar";
import ValueProposition from "@/components/ValueProposition";
import VeradiMakers from "@/components/VeradiMakers";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <main className="bg-white text-gray-900" style={{ scrollBehavior: 'smooth' }}>
      <Navbar />
      <ValueProposition />
      <VeradiMakers />
      <Footer />
    </main>
  );
}

