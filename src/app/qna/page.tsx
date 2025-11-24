import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/qna/FaqSection";
import ContactSection from "@/components/qna/ContactSection";

export default function QnAPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f1f0ec] pt-28 pb-0 px-4 sm:px-6 lg:px-8">
        <div className="w-full space-y-20">
          <FaqSection />
          <ContactSection />
        </div>
      </main>
      <Footer />
    </>
  );
}

