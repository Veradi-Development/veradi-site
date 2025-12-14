"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useMobileDetect } from "@/hooks/useMobileDetect";

// 교재 데이터 타입
type BookData = {
  id: string;
  subject: string;
  image_url: string | null;
  link: string;
  display_order: number;
};

export default function Publications() {
  const isMobile = useMobileDetect();
  const [allBooks, setAllBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 데이터 로드
    const fetchData = async () => {
      try {
        // 교재 로드 (type='publication')
        const booksRes = await fetch('/api/books');
        if (booksRes.ok) {
          const booksData = await booksRes.json();
          if (Array.isArray(booksData)) {
            const books: BookData[] = booksData.map((book: {
              id: string;
              subject: string;
              image_url: string | null;
              purchase_link?: string;
              display_order?: number;
            }) => ({
              id: book.id,
              subject: book.subject,
              image_url: book.image_url,
              link: book.purchase_link || '#',
              display_order: book.display_order || 0,
            }));
            
            // display_order로 정렬
            books.sort((a, b) => a.display_order - b.display_order);
            setAllBooks(books);
          }
        }
      } catch (error) {
        console.error('Error fetching publications data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="bg-white text-gray-900 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">로딩 중...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="text-gray-900 min-h-screen" style={{ backgroundColor: '#f1f0ec' }}>
      <Navbar />
      
      {/* 5열 책 그리드 섹션 */}
      {allBooks.length > 0 && (
        <section className="pt-24 pb-16 px-4 sm:px-6 md:px-8 relative overflow-hidden">
          <div className="w-full relative z-0">
            <motion.div
              initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0 : 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 relative"
            >
              {allBooks.map((book, idx) => {
                return (
                <motion.div
                  key={book.id}
                  initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: isMobile ? 0 : 0.4, delay: isMobile ? 0 : idx * 0.05 }}
                  className="relative z-0 group"
                >
                  {/* 카드 */}
                  <div className="w-full aspect-[4/5] border border-gray-300 overflow-hidden relative transition-colors duration-300 group-hover:bg-gray-300" style={{ backgroundColor: '#f1f0ec' }}>
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full h-full items-center justify-center p-3 sm:p-4"
                    >
                      <div className="relative w-full h-full max-w-[92%] max-h-[92%]">
                        {book.image_url ? (
                          <Image
                            src={book.image_url}
                            alt={book.subject}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                            quality={75}
                            loading={idx < 10 ? "eager" : "lazy"}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            이미지 없음
                          </div>
                        )}
                      </div>
                    </a>

                    {/* 오버레이 */}
                    <div className="absolute inset-0 bg-gray-900/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between items-center px-5 py-6">
                      <p className="text-white text-2xl sm:text-[1.7rem] font-semibold tracking-tight text-center mt-6">
                        {book.subject}
                      </p>
                      <span className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold text-base rounded-full shadow-lg mb-3">
                        구매하기
                      </span>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

