'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Announcement } from '@/lib/supabase';
import Link from 'next/link';
import { use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useMobileDetect } from '@/hooks/useMobileDetect';

export default function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isMobile = useMobileDetect();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`/api/announcements/${id}`);
        if (!response.ok) {
          throw new Error('공지사항을 찾을 수 없습니다.');
        }
        const data = await response.json();
        setAnnouncement(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : '오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !announcement) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-300 p-12 text-center">
              <p className="text-red-600 mb-6">{error || '공지사항을 찾을 수 없습니다.'}</p>
              <Link
                href="/notice"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                목록으로
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-4xl mx-auto">
        {/* 상단 제목 영역 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0 : 0.5, ease: "easeOut" }}
          className="bg-white border border-gray-300 mb-4"
        >
          <div className="border-b border-gray-300 bg-gray-50 px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {announcement.title}
            </h1>
          </div>
          <div className="px-8 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex gap-6 text-sm text-gray-600">
              <div>
                <span className="font-semibold">작성일:</span> {formatDate(announcement.created_at)}
              </div>
              {announcement.updated_at !== announcement.created_at && (
                <div>
                  <span className="font-semibold">수정일:</span> {formatDate(announcement.updated_at)}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 내용 영역 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0 : 0.5, delay: isMobile ? 0 : 0.1, ease: "easeOut" }}
          className="bg-white border border-gray-300 mb-4"
        >
          <div className="px-8 py-12 min-h-[400px]">
            <div 
              className="text-gray-800 leading-relaxed mb-8 prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            />

            {/* 첨부파일 */}
            {announcement.attachments && announcement.attachments.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">첨부파일</h3>
                <div className="space-y-2">
                  {announcement.attachments.map((file, index) => {
                    // Supabase Storage URL에 download 파라미터 추가
                    const downloadUrl = `${file.url}?download=${encodeURIComponent(file.name)}`;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={isMobile ? { opacity: 1 } : { opacity: 0, x: -20 }}
                        animate={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
                        transition={{
                          duration: isMobile ? 0 : 0.3,
                          delay: isMobile ? 0 : 0.2 + index * 0.05,
                          ease: "easeOut"
                        }}
                        className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded"
                      >
                        <span className="text-xl">
                          {file.type.startsWith('image/') ? '🖼️' : '📄'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                        <a
                          href={downloadUrl}
                          className="text-blue-600 text-sm hover:text-blue-700 px-3 py-1 border border-blue-600 rounded hover:bg-blue-50 transition-colors duration-200 whitespace-nowrap"
                        >
                          다운로드
                        </a>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* 하단 버튼 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0 : 0.4, delay: isMobile ? 0 : 0.2, ease: "easeOut" }}
          className="flex justify-center gap-3"
        >
          <Link
            href="/notice"
            className="px-8 py-2.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
          >
            목록
          </Link>
        </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

