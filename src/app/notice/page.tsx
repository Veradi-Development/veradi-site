'use client';

import { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Announcement } from '@/lib/supabase';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useMobileDetect } from '@/hooks/useMobileDetect';

// 공지사항 아이템 컴포넌트 메모이제이션
const AnnouncementItem = memo(({ 
  announcement, 
  index, 
  total,
  isMobile 
}: { 
  announcement: Announcement; 
  index: number; 
  total: number;
  isMobile: boolean;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <motion.div
      initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: isMobile ? 0 : 0.3,
        delay: isMobile ? 0 : Math.min(index * 0.03, 0.3),
        ease: "easeOut"
      }}
    >
      <Link
        href={`/notice/${announcement.id}`}
        className="block border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
      >
        {/* 데스크톱 레이아웃 */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-5">
          <div className="col-span-1 text-center text-gray-600">
            {total - index}
          </div>
          <div className="col-span-9 text-black font-medium hover:text-blue-600 hover:underline flex items-center gap-2">
            {announcement.title}
            {announcement.attachments && announcement.attachments.length > 0 && (
              <span className="text-xs text-gray-500">📎 {announcement.attachments.length}</span>
            )}
          </div>
          <div className="col-span-2 text-center text-gray-600 text-sm">
            {formatDate(announcement.created_at)}
          </div>
        </div>

        {/* 모바일 레이아웃 */}
        <div className="md:hidden px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
              {total - index}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-black font-medium mb-1 hover:text-blue-600 flex items-center gap-2">
                {announcement.title}
                {announcement.attachments && announcement.attachments.length > 0 && (
                  <span className="text-xs text-gray-500">📎 {announcement.attachments.length}</span>
                )}
              </h3>
              <p className="text-xs text-gray-500">
                {formatDate(announcement.created_at)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

AnnouncementItem.displayName = 'AnnouncementItem';

export default function NoticePage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMobileDetect();
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(announcements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnouncements = announcements.slice(startIndex, endIndex);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      const data = await response.json();
      
      // 데이터가 배열인지 확인
      if (Array.isArray(data)) {
        setAnnouncements(data);
      } else {
        console.error('API response is not an array:', data);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0 : 0.5, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl font-extrabold text-black mb-2">공지사항</h1>
          <p className="text-gray-600">VERADI의 최신 소식을 확인하세요</p>
        </motion.div>

        {/* 공지사항 테이블 */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0 : 0.5, delay: isMobile ? 0 : 0.1, ease: "easeOut" }}
          className="bg-white border-t-2 border-gray-800"
        >
          {/* 테이블 내용 */}
          {announcements.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              등록된 공지사항이 없습니다.
            </div>
          ) : (
            <div>
              {currentAnnouncements.map((announcement, index) => (
                <AnnouncementItem
                  key={announcement.id}
                  announcement={announcement}
                  index={startIndex + index}
                  total={announcements.length}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.4, delay: isMobile ? 0 : 0.2, ease: "easeOut" }}
            className="mt-16 mb-12 flex justify-center items-center gap-2"
          >
            {/* 이전 버튼 */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded transition-colors ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* 페이지 번호 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  currentPage === page
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            {/* 다음 버튼 */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        </div>
      </div>
      <Footer />
    </>
  );
}

