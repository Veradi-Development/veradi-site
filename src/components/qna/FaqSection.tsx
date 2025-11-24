"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "Q 문제 풀이에 대해 질문하고 싶을 땐 어떻게 해야 하나요?",
    answer:
      "카카오톡 (@veradi) / 인스타그램(@veradi_contents) / 네이버 포만한 카페((https://cafe.naver.com/pnmath)의 베라디’s Q&A 게시판을 이용해주세요.",
  },
  {
    question: "Q 교재 정오 사항 제보는 어디로 하나요?",
    answer:
      "카카오톡 (@veradi) / 인스타그램(@veradi_contents) / 네이버 포만한 카페((https://cafe.naver.com/pnmath)의 베라디’s Q&A 게시판을 이용해주세요.",
  },
  {
    question: "Q 교재 출간 일정이 어떻게 되나요?",
    answer:
      "자세한 교재 출간 일정은 본 사이트의 공지사항 탭 또는 네이버 포만한 카페(https://cafe.naver.com/pnmath) 를 통해 확인 바랍니다.",
  },
  {
    question: "Q 베라디의 저작권이 침해당한 것 같은데 어디로 제보하면 될까요?",
    answer:
      "veradicontents@gmail.com 으로 제보 부탁드립니다.",
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full space-y-8 px-4 sm:px-6">
      <div className="space-y-3 pl-0 sm:pl-1 pr-0 relative">
        <div className="w-full h-px bg-[#bfbfbb] absolute inset-x-0 -top-8" />
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">자주 묻는 질문</h2>
      </div>

      <div className="divide-y divide-gray-200 border-t border-b border-gray-200 space-y-0">
        {faqs.map((faq, index) => {
          const isActive = activeIndex === index;
          const match = faq.question.match(/^(Q)([\s.]*)(.*)$/i);
          const leading = match ? match[1] : "";
          const remainder = match ? match[3]?.trimStart() : faq.question;
          return (
            <div key={faq.question}>
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between py-4 text-left gap-4 pl-6 pr-4 sm:pl-10 sm:pr-6"
              >
                <span className="text-lg sm:text-xl font-semibold text-gray-500 flex items-baseline gap-3">
                  {leading && (
                    <span className="text-[2.2rem] sm:text-[2.4rem] font-[GmarketSansBold] leading-none" style={{ color: "#a2a2a0" }}>
                      {leading}
                    </span>
                  )}
                  <span className="text-[#a2a2a0]">{remainder}</span>
                </span>
                <span
                  className={`text-xl font-bold transition-transform duration-300 ${
                    isActive ? "rotate-45 text-gray-900" : "text-gray-400"
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isActive ? "max-h-48 pb-3 pl-16 pr-4 sm:pl-20 sm:pr-6" : "max-h-0 pl-16 pr-4 sm:pl-20 sm:pr-6"
                }`}
              >
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

