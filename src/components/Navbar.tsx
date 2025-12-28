"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram, Menu, X } from "lucide-react";
import { useState, memo } from "react";

const Navbar = memo(function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: "/publications", label: "출판물" },
    { href: "/notice", label: "공지사항" },
    { href: "/qna", label: "Q&A" },
  ];

  const isHomePage = pathname === '/';
  const showDarkText = !isHomePage; // 메인페이지가 아니면 검정 텍스트

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-transparent">
      <div className="flex items-center px-4 sm:px-6 md:px-8 py-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image 
            src="/images/veradi-logo.png"
            alt="VERADI"
            width={120}
            height={40}
            className={`h-6 sm:h-8 w-auto transition-all duration-300 ${
              isHomePage ? 'brightness-0 invert' : ''
            }`}
            priority
          />
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
        <div className="md:hidden backdrop-blur-md border-t transition-colors duration-300 bg-white/95 border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg transition-colors font-medium text-base ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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

