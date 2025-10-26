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
    { href: "/about", label: "소개" },
    { href: "/publications", label: "출판물" },
    { href: "/notice", label: "공지사항" },
    { href: "/qna", label: "Q&A" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="flex items-center px-4 sm:px-6 md:px-8 py-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center hover:opacity-60 transition-opacity">
          <Image
            src="/images/veradi-logo.png" // 실제 로고 이미지 파일명으로 교체 필요
            alt="VERADI"
            width={100}
            height={32}
            priority
            className="h-6 sm:h-7 w-auto"
          />
        </Link>

        {/* 데스크탑 메뉴 - 가운데 정렬 */}
        <div className="flex-1 flex justify-center">
          <div className="space-x-8 lg:space-x-16 hidden md:flex">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`transition-colors font-medium relative ${
                    isActive 
                      ? "text-blue-600" 
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 오른쪽 아이콘들 */}
        <div className="flex items-center gap-2">
          {/* 인스타그램 */}
          <Link 
            href="https://www.instagram.com/veradi_contents" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-pink-500 transition-colors" />
          </Link>

          {/* 모바일 햄버거 메뉴 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="메뉴"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
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

