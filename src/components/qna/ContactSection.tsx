"use client";

import Image from "next/image";

export default function ContactSection() {
  return (
    <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden bg-[#3a4854]">
      <div className="relative max-w-3xl mx-auto text-left text-white py-20 sm:py-28 px-6 sm:px-8 space-y-10">
        <div className="space-y-2">
          <p className="text-2xl sm:text-3xl font-medium">
            자주 묻는 질문에 내가 궁금한 점에 대한 답변이 없다면
          </p>
          <p className="text-2xl sm:text-3xl font-medium">언제든 연락주세요.</p>
        </div>

        <div className="space-y-1 text-base sm:text-lg font-normal tracking-wide text-white/90">
          <p>
            <span className="mr-2 text-white">카카오톡</span> | veradi
          </p>
          <p>
            <span className="mr-2 text-white">인스타그램</span> | veradi_contents
          </p>
          <p>
            <span className="mr-2 text-white">이메일</span> | veradicontents@gmail.com
          </p>
        </div>
      </div>
      <div className="hidden lg:block pointer-events-none absolute right-20 bottom-0">
        <Image
          src="/images/contact.png"
          alt="Contact illustration"
          width={420}
          height={520}
          className="block translate-y-6"
          priority
        />
      </div>
    </section>
  );
}

