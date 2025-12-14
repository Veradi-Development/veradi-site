'use client';

import { useState, useEffect } from 'react';
import type { PublicationBook } from '@/types';

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(new Set());

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        setAdminPassword(password);
        setError('');
      } else {
        setError('비밀번호가 올바르지 않습니다');
        setPassword('');
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다');
      setPassword('');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`/api/books?type=publication&t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setBooks(data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
        }
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingBookId ? `/api/books/${editingBookId}` : '/api/books';
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
        alert(editingBookId ? '교재가 수정되었습니다' : '교재가 추가되었습니다');
        setShowBookForm(false);
        setEditingBookId(null);
        setBookForm({
          subject: '',
          image_url: '',
          purchase_link: '',
          display_order: 0,
        });
        fetchBooks();
      } else {
        const error = await response.json();
        alert(`오류: ${error.error}`);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('제출 중 오류가 발생했습니다');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch(`/api/upload?password=${encodeURIComponent(adminPassword)}`, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('이미지 업로드 실패');
      }

      const data = await response.json();
      setBookForm(prev => ({ ...prev, image_url: data.url }));
      alert('이미지가 업로드되었습니다');
    } catch (error) {
      alert(error instanceof Error ? error.message : '이미지 업로드 중 오류가 발생했습니다');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleBookDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/books/${id}?password=${adminPassword}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('교재가 삭제되었습니다');
        fetchBooks();
      } else {
        const error = await response.json();
        alert(`오류: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('삭제 중 오류가 발생했습니다');
    }
  };

  const handleBulkBookDelete = async () => {
    if (selectedBookIds.size === 0) {
      alert('삭제할 교재를 선택해주세요');
      return;
    }

    if (!confirm(`선택한 ${selectedBookIds.size}개의 교재를 정말 삭제하시겠습니까?`)) return;

    try {
      const deletePromises = Array.from(selectedBookIds).map(id =>
        fetch(`/api/books/${id}?password=${adminPassword}`, {
          method: 'DELETE',
        })
      );

      const results = await Promise.allSettled(deletePromises);
      const successCount = results.filter(r => r.status === 'fulfilled' && r.value.ok).length;
      const failCount = selectedBookIds.size - successCount;

      if (failCount === 0) {
        alert(`${successCount}개의 교재가 삭제되었습니다`);
      } else {
        alert(`${successCount}개 삭제 성공, ${failCount}개 삭제 실패`);
      }

      setSelectedBookIds(new Set());
      fetchBooks();
    } catch (error) {
      console.error('Error bulk deleting books:', error);
      alert('일괄 삭제 중 오류가 발생했습니다');
    }
  };

  // 비밀번호 인증 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">출판물 관리</h1>
            <p className="text-lg text-gray-600">관리자 인증이 필요합니다</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  비밀번호
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
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">출판물 관리</h1>
          <p className="text-gray-600">출판물 교재를 순서대로 관리합니다</p>
        </div>

        {/* 교재 관리 */}
        <div>
          <div className="mb-6 flex gap-3 items-center">
            <button
              onClick={() => {
                setShowBookForm(!showBookForm);
                setEditingBookId(null);
                setBookForm({
                  subject: '',
                  image_url: '',
                  purchase_link: '',
                  display_order: books.length > 0 ? Math.max(...books.map(b => b.display_order || 0)) + 1 : 0,
                });
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showBookForm ? '취소' : '새 교재 추가'}
            </button>
          </div>

          {showBookForm && (
            <form onSubmit={handleBookSubmit} className="mb-8 bg-white p-6 rounded-lg border border-gray-300">
              <h2 className="text-xl font-bold mb-4">
                {editingBookId ? '교재 수정' : '새 교재 추가'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    과목명 *
                  </label>
                  <input
                    type="text"
                    value={bookForm.subject}
                    onChange={(e) => setBookForm({ ...bookForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="물리학 I"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    표시 순서 *
                  </label>
                  <input
                    type="number"
                    value={bookForm.display_order}
                    onChange={(e) => setBookForm({ ...bookForm, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">* 숫자가 작을수록 먼저 표시됩니다</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이미지 *
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {uploadingImage && <span className="text-sm text-blue-600">업로드 중...</span>}
                    </div>
                    <input
                      type="url"
                      value={bookForm.image_url}
                      onChange={(e) => setBookForm({ ...bookForm, image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="또는 URL 직접 입력: /images/book_front.jpg"
                    />
                    {bookForm.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={bookForm.image_url} alt="미리보기" className="w-32 h-40 object-cover rounded border" />
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    구입하기 링크 *
                  </label>
                  <input
                    type="url"
                    value={bookForm.purchase_link}
                    onChange={(e) => setBookForm({ ...bookForm, purchase_link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://smartstore.naver.com/veradi"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingBookId ? '수정' : '추가'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBookForm(false);
                    setEditingBookId(null);
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          )}

          {/* 일괄 삭제 버튼 */}
          {selectedBookIds.size > 0 && (
            <div className="mb-4">
              <button
                onClick={handleBulkBookDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                선택한 {selectedBookIds.size}개 교재 삭제
              </button>
            </div>
          )}

          {/* 교재 목록 */}
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">
                    <input
                      type="checkbox"
                      checked={books.length > 0 && selectedBookIds.size === books.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBookIds(new Set(books.map(b => b.id)));
                        } else {
                          setSelectedBookIds(new Set());
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">순서</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">과목</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">작업</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      등록된 교재가 없습니다.
                    </td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedBookIds.has(book.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedBookIds);
                            if (e.target.checked) {
                              newSelected.add(book.id);
                            } else {
                              newSelected.delete(book.id);
                            }
                            setSelectedBookIds(newSelected);
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center">
                        {book.display_order}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{book.subject}</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <button
                          onClick={() => {
                            setBookForm({
                              subject: book.subject,
                              image_url: book.image_url || '',
                              purchase_link: book.purchase_link || '',
                              display_order: book.display_order,
                            });
                            setEditingBookId(book.id);
                            setShowBookForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 mr-3"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleBookDelete(book.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
