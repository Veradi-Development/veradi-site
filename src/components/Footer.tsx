"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-700 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-2xl font-bold text-gray-900 mb-6 text-left">VERADI</div>
        
        {/* 회사 정보 */}
        <div className="text-sm space-y-2 mb-6 text-left text-gray-600">
          <p>
            <span className="inline-block">상호명: VERADI</span>
            <span className="hidden md:inline mx-2">|</span>
            <span className="block md:inline">대표자명: 김민지</span>
          </p>
          <p>사업자등록번호: 123-45-67890</p>
          <p>주소: 서울특별시 강남구 언주로432 타워432 6F</p>
          <p>
            <span className="inline-block">전화: 02-1234-5678</span>
            <span className="hidden md:inline mx-2">|</span>
            <span className="block md:inline">이메일: veradicontents@gmail.com</span>
          </p>
        </div>

        {/* 저작권 */}
        <div className="text-sm text-gray-500 border-t border-gray-300 pt-6 text-left">
          <p>© VERADI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

