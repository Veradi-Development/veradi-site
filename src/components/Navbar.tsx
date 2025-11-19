"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Menu, X } from "lucide-react";
import { useState, useEffect, useCallback, memo } from "react";

const Navbar = memo(function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 하이드레이션 불일치 방지를 위해 초기값을 고정
  const [navState, setNavState] = useState<'dark' | 'light-transparent' | 'solid'>('dark');
  const pathname = usePathname();

  const menuItems = [
    { href: "/about", label: "소개" },
    { href: "/publications", label: "출판물" },
    { href: "/notice", label: "공지사항" },
    { href: "/qna", label: "Q&A" },
  ];

  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    const isMobile = window.innerWidth < 768;
    const darkSectionEnd = heroHeight + (isMobile ? 1400 : 1500); // GridSeries2 끝
    const subjectsEnd = darkSectionEnd + 1000; // Subjects 섹션
    
    if (scrollY < darkSectionEnd) {
      setNavState('dark'); // 어두운 섹션: 투명 + 흰색
    } else if (scrollY < subjectsEnd) {
      setNavState('light-transparent'); // Subjects: 투명 + 검정
    } else {
      setNavState('solid'); // 나머지: 흰색 배경 + 검정
    }
  }, []);

  useEffect(() => {
    // 하이드레이션 완료 후 실행하여 불일치 방지
    if (typeof window !== 'undefined') {
      // 하이드레이션이 완전히 완료된 후 상태 업데이트 (약간의 지연)
      const timer = setTimeout(() => {
        handleScroll();
      }, 100);
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  const isHomePage = pathname === '/';
  const isAboutPage = pathname === '/about';
  const isPublicationsPage = pathname === '/publications';
  const isNoticePage = pathname.startsWith('/notice');
  const isQnaPage = pathname === '/qna';

  const isDark = isHomePage && navState === 'dark';
  const showDarkText = !isDark; // 어두운 섹션이 아니면 검정 텍스트

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isHomePage 
        ? navState === 'dark' 
          ? 'bg-black sm:bg-transparent' 
          : navState === 'light-transparent'
          ? 'bg-white sm:bg-transparent'
          : 'bg-white'
        : isAboutPage || isPublicationsPage || isNoticePage || isQnaPage
        ? 'bg-white'
        : 'bg-transparent'
    }`}>
      <div className="flex items-center px-4 sm:px-6 md:px-8 py-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <span className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-300 ${
            showDarkText ? 'text-gray-900' : 'text-white drop-shadow-lg'
          }`}>
            VERADI
          </span>
        </Link>

        {/* 빈 공간 */}
        <div className="flex-1"></div>

        {/* 데스크탑 메뉴 - 오른쪽 정렬 */}
        <div className="space-x-6 lg:space-x-12 hidden md:flex items-center">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`transition-colors font-medium relative text-base ${
                  showDarkText
                    ? `${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`
                    : `drop-shadow-lg ${isActive ? "text-white" : "text-white/90 hover:text-white"}`
                }`}
              >
                {item.label}
                {isActive && (
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full transition-colors duration-300 ${
                    showDarkText ? 'bg-blue-600' : 'bg-white'
                  }`}></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* 오른쪽 아이콘들 */}
        <div className="flex items-center gap-2 ml-8">
          {/* 인스타그램 */}
          <Link 
            href="https://www.instagram.com/veradi_contents" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-2 rounded-full transition-colors ${
              showDarkText ? 'hover:bg-gray-100' : 'hover:bg-white/10'
            }`}
          >
            <Instagram className={`w-5 h-5 sm:w-6 sm:h-6 text-pink-500 hover:text-pink-400 transition-colors ${
              showDarkText ? '' : 'drop-shadow-lg'
            }`} />
          </Link>

          {/* 모바일 햄버거 메뉴 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-full transition-colors ${
              showDarkText ? 'hover:bg-gray-100' : 'hover:bg-white/10'
            }`}
            aria-label="메뉴"
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 transition-colors ${
                showDarkText ? 'text-gray-900' : 'text-white drop-shadow-lg'
              }`} />
            ) : (
              <Menu className={`w-6 h-6 transition-colors ${
                showDarkText ? 'text-gray-900' : 'text-white drop-shadow-lg'
              }`} />
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMenuOpen && (
        <div className={`md:hidden backdrop-blur-md border-t transition-colors duration-300 ${
          showDarkText 
            ? 'bg-white/95 border-gray-200'
            : 'bg-black/80 border-white/20'
        }`}>
          <div className="px-4 py-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                    showDarkText
                      ? isActive
                        ? "text-blue-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      : isActive
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
});

export default Navbar;

