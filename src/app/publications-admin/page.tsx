'use client';

import { useState, useEffect } from 'react';
import type { PublicationBook } from '@/types';
import Image from 'next/image';

export default function AdminPublicationsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  
  const [loading, setLoading] = useState(true);

  // Books state
  const [books, setBooks] = useState<PublicationBook[]>([]);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState({
    subject: '',
    image_url: '',
    purchase_link: '',
    display_order: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setAdminPassword(password);
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingBookId 
        ? `/api/books/${editingBookId}`
        : '/api/books';
      
      const method = editingBookId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookForm,
          password: adminPassword,
        }),
      });

      if (response.ok) {
        await fetchBooks();
        setShowBookForm(false);
        setEditingBookId(null);
        setBookForm({
          subject: '',
          image_url: '',
          purchase_link: '',
          display_order: 0,
        });
      } else {
        const data = await response.json();
        setError(data.error || '저장 중 오류가 발생했습니다.');
      }
    } catch {
      setError('저장 중 오류가 발생했습니다.');
    }
  };

  const handleEditBook = (book: PublicationBook) => {
    console.log('Editing book:', book);
    setBookForm({
      subject: book.subject,
      image_url: book.image_url || '',
      purchase_link: book.purchase_link || '',
      display_order: book.display_order || 0,
    });
    setEditingBookId(book.id);
    setShowBookForm(true);
    setError(''); // 에러 초기화
    // 폼이 이미 열려있을 경우를 대비해 스크롤
    setTimeout(() => {
      const formElement = document.querySelector('.bg-white.p-6.rounded-lg.shadow-md');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/books/${id}?password=${encodeURIComponent(adminPassword)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchBooks();
      } else {
        const data = await response.json();
        setError(data.error || '삭제 중 오류가 발생했습니다.');
      }
    } catch {
      setError('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/upload?password=${encodeURIComponent(adminPassword)}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setBookForm({ ...bookForm, image_url: data.url });
        setUploadProgress(100);
      } else {
        const errorData = await response.json();
        let errorMessage = errorData.error || '이미지 업로드에 실패했습니다.';
        if (errorData.details) {
          errorMessage += ` (${errorData.details})`;
        }
        setError(errorMessage);
      }
    } catch {
      setError('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">관리자 로그인</h1>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {error && (
                <div className="mb-4 text-sm text-red-600">{error}</div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                로그인
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">교재 관리</h1>
            <button
              onClick={() => {
                setShowBookForm(!showBookForm);
                if (showBookForm) {
                  setEditingBookId(null);
                  setBookForm({
                    subject: '',
                    image_url: '',
                    purchase_link: '',
                    display_order: 0,
                  });
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {showBookForm ? '취소' : '새 교재'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          {showBookForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingBookId ? '교재 수정' : '새 교재 추가'}
              </h2>
              <form onSubmit={handleBookSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    과목명
                  </label>
                  <input
                    type="text"
                    value={bookForm.subject}
                    onChange={(e) => setBookForm({ ...bookForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={bookForm.image_url}
                        onChange={(e) => setBookForm({ ...bookForm, image_url: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://... 또는 파일 업로드"
                      />
                      <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer transition-colors border border-gray-300 whitespace-nowrap">
                        {uploading ? '업로드 중...' : '파일 선택'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    {uploadProgress > 0 && uploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                    {bookForm.image_url && (
                      <div className="mt-2">
                        <Image
                          src={bookForm.image_url}
                          alt="미리보기"
                          width={300}
                          height={128}
                          className="max-w-xs h-32 object-contain border border-gray-300 rounded"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    구매 링크
                  </label>
                  <input
                    type="url"
                    value={bookForm.purchase_link}
                    onChange={(e) => setBookForm({ ...bookForm, purchase_link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    표시 순서
                  </label>
                  <input
                    type="number"
                    value={bookForm.display_order}
                    onChange={(e) => setBookForm({ ...bookForm, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingBookId ? '수정' : '저장'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookForm(false);
                      setEditingBookId(null);
                      setBookForm({
                        subject: '',
                        image_url: '',
                        purchase_link: '',
                        display_order: 0,
                      });
                    }}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이미지</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">과목명</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">구매 링크</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">순서</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {books
                    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                    .map((book) => (
                    <tr key={book.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {book.image_url ? (
                          <Image
                            src={book.image_url}
                            alt={book.subject}
                            width={60}
                            height={80}
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="w-[60px] h-[80px] bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                            이미지 없음
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {book.subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {book.purchase_link ? (
                          <a href={book.purchase_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            링크
                          </a>
                        ) : (
                          <span className="text-gray-400">없음</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.display_order || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditBook(book);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteBook(book.id);
                          }}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {books.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  등록된 교재가 없습니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

