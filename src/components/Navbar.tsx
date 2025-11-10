"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Menu, X } from "lucide-react";
import { useState, useEffect, useCallback, memo } from "react";

const Navbar = memo(function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { href: "/about", label: "소개" },
    { href: "/publications", label: "출판물" },
    { href: "/notice", label: "공지사항" },
    { href: "/qna", label: "Q&A" },
  ];

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    // GridSeries와 GridSeries2 섹션 모두 포함하여 어두운 배경 범위 확장
    const darkSectionHeight = heroHeight + 1600;
    setIsAtTop(scrollY < darkSectionHeight);
  }, []);

  useEffect(() => {
    handleScroll(); // 초기 실행
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const isHomePage = pathname === '/';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isHomePage && isAtTop ? 'bg-transparent' : 'bg-white shadow-sm'
    }`}>
      <div className="flex items-center px-4 sm:px-6 md:px-8 py-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <span className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-300 ${
            isHomePage && isAtTop ? 'text-white drop-shadow-lg' : 'text-gray-900'
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
                  isHomePage && isAtTop
                    ? `drop-shadow-lg ${isActive ? "text-white" : "text-white/90 hover:text-white"}`
                    : `${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`
                }`}
              >
                {item.label}
                {isActive && (
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full transition-colors duration-300 ${
                    isHomePage && isAtTop ? 'bg-white' : 'bg-blue-600'
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
              isHomePage && isAtTop ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            <Instagram className={`w-5 h-5 sm:w-6 sm:h-6 text-pink-500 hover:text-pink-400 transition-colors ${
              isHomePage && isAtTop ? 'drop-shadow-lg' : ''
            }`} />
          </Link>

          {/* 모바일 햄버거 메뉴 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-full transition-colors ${
              isHomePage && isAtTop ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
            aria-label="메뉴"
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 transition-colors ${
                isHomePage && isAtTop ? 'text-white drop-shadow-lg' : 'text-gray-900'
              }`} />
            ) : (
              <Menu className={`w-6 h-6 transition-colors ${
                isHomePage && isAtTop ? 'text-white drop-shadow-lg' : 'text-gray-900'
              }`} />
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-md border-t border-white/20">
          <div className="px-4 py-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                    isActive
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

