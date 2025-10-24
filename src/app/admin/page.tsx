'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, MessageSquare, Megaphone, FileText } from 'lucide-react';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'veradi2025';

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('비밀번호가 올바르지 않습니다');
      setPassword('');
    }
  };

  const adminPages = [
    {
      title: '교재 관리',
      description: 'GRID와 Subjects 교재를 관리합니다',
      icon: BookOpen,
      color: 'blue',
      path: '/admin/books',
    },
    {
      title: '후기 관리',
      description: '학생 후기를 관리합니다',
      icon: MessageSquare,
      color: 'green',
      path: '/admin/testimonials',
    },
    {
      title: '공지사항 관리',
      description: '공지사항을 작성하고 관리합니다',
      icon: Megaphone,
      color: 'purple',
      path: '/admin/announcements',
    },
    {
      title: '출판물 관리',
      description: '출판물 페이지의 내용을 관리합니다',
      icon: FileText,
      color: 'orange',
      path: '/admin/publications',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-600',
      green: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-600',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-600',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* 로고/제목 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">VERADI</h1>
            <p className="text-lg text-gray-600">관리자 페이지</p>
          </div>

          {/* 로그인 카드 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  관리자 비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="비밀번호를 입력하세요"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                로그인
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            관리자만 접근할 수 있습니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">관리자 대시보드</h1>
          <p className="text-lg text-gray-600">관리할 항목을 선택하세요</p>
        </div>

        {/* 관리 페이지 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminPages.map((page) => {
            const Icon = page.icon;
            return (
              <button
                key={page.path}
                onClick={() => router.push(page.path)}
                className={`${getColorClasses(page.color)} p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left group`}
              >
                <div className="flex items-start gap-4">
                  {/* 아이콘 */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>

                  {/* 텍스트 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {page.description}
                    </p>
                  </div>

                  {/* 화살표 */}
                  <div className="flex-shrink-0">
                    <svg 
                      className="w-6 h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 로그아웃 버튼 */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPassword('');
            }}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

