'use client';

import { useState, useEffect } from 'react';

type Book = {
  id: string;
  title: string;
  subject: string;
  description: string | null;
  type: 'grid' | 'subject';
  main_image_url: string | null;
  sub_image_url: string | null;
  front_image_url: string | null;
  purchase_link: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

const ADMIN_PASSWORD = 'veradi2025';

export default function AdminBooksPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'grid' | 'subject'>('grid');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    description: '',
    type: 'grid' as 'grid' | 'subject',
    main_image_url: '',
    sub_image_url: '',
    front_image_url: '',
    purchase_link: '',
    display_order: 0,
  });
  const [uploading, setUploading] = useState(false);

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

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setBooks(data);
        }
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/books/${editingId}` : '/api/books';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          title: formData.type === 'grid' ? formData.subject : formData.title, // GRID는 과목명, Subjects는 팀 이름
          password: ADMIN_PASSWORD 
        }),
      });

      if (response.ok) {
        alert(editingId ? '교재가 수정되었습니다' : '교재가 추가되었습니다');
        setShowForm(false);
        setEditingId(null);
        setFormData({
          subject: '',
          title: '',
          description: '',
          type: 'grid',
          main_image_url: '',
          sub_image_url: '',
          front_image_url: '',
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

  const handleEdit = (book: Book) => {
    setFormData({
      subject: book.subject,
      title: book.title,
      description: book.description || '',
      type: book.type,
      main_image_url: book.main_image_url || '',
      sub_image_url: book.sub_image_url || '',
      front_image_url: book.front_image_url || '',
      purchase_link: book.purchase_link || '',
      display_order: book.display_order,
    });
    setEditingId(book.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageType: 'main' | 'sub' | 'front') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch(`/api/upload?password=${encodeURIComponent(ADMIN_PASSWORD)}`, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('이미지 업로드 실패');
      }

      const data = await response.json();
      
      // 업로드된 이미지 URL을 formData에 저장 (함수형 업데이트)
      setFormData(prev => {
        if (imageType === 'main') {
          return { ...prev, main_image_url: data.url };
        } else if (imageType === 'sub') {
          return { ...prev, sub_image_url: data.url };
        } else if (imageType === 'front') {
          return { ...prev, front_image_url: data.url };
        }
        return prev;
      });

      alert('이미지가 업로드되었습니다');
    } catch (error) {
      alert(error instanceof Error ? error.message : '이미지 업로드 중 오류가 발생했습니다');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/books/${id}?password=${ADMIN_PASSWORD}`, {
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

  // 비밀번호 인증 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">교재 관리</h1>
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

  const filteredBooks = books.filter(book => book.type === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">교재 관리</h1>
          <p className="text-gray-600">GRID와 Subjects 교재를 관리합니다</p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-6 border-b border-gray-300">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab('grid');
                setShowForm(false);
              }}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'grid'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              GRID 교재
            </button>
            <button
              onClick={() => {
                setActiveTab('subject');
                setShowForm(false);
              }}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'subject'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Subjects 교재
            </button>
          </div>
        </div>

        {/* 새 교재 추가 버튼 */}
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              subject: '',
              title: '',
              description: '',
              type: activeTab, // 현재 활성 탭의 타입으로 설정
              main_image_url: '',
              sub_image_url: '',
              front_image_url: '',
              purchase_link: '',
              display_order: 0,
            });
          }}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? '취소' : `새 ${activeTab === 'grid' ? 'GRID' : 'Subjects'} 교재 추가`}
        </button>

        {/* 교재 추가/수정 폼 */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg border border-gray-300">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? `${formData.type === 'grid' ? 'GRID' : 'Subjects'} 교재 수정` : `새 ${formData.type === 'grid' ? 'GRID' : 'Subjects'} 교재 추가`}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 과목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  과목 *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={formData.type === 'grid' ? "예: 물리학, 화학" : "예: 물리학"}
                  required
                />
              </div>

              {/* 팀 이름 (Subjects용만) */}
              {formData.type === 'subject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    팀 이름 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="예: Team Kinetic, Team Helios"
                    required
                  />
                </div>
              )}

              {/* 표시 순서 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  표시 순서 *
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => {
                    setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 });
                  }}
                  onKeyDown={(e) => {
                    // 모든 키 입력 막기 (화살표 버튼은 마우스 클릭이므로 작동함)
                    e.preventDefault();
                  }}
                  onPaste={(e) => {
                    // 붙여넣기 막기
                    e.preventDefault();
                  }}
                  min="0"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* 설명 (Subjects용만) */}
            {formData.type === 'subject' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="예: 기본에 충실하게, 담백하게, 매력있게."
                />
              </div>
            )}

            {/* 이미지 업로드/URL */}
            {formData.type === 'grid' ? (
              <>
                {/* 문제집 이미지 */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    문제집 이미지
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'main')}
                        disabled={uploading}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {uploading && <span className="text-sm text-blue-600">업로드 중...</span>}
                    </div>
                    <input
                      type="url"
                      value={formData.main_image_url}
                      onChange={(e) => setFormData({ ...formData, main_image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="또는 URL 직접 입력: /images/grid_kinetic_front.jpg"
                    />
                    {formData.main_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={formData.main_image_url} alt="미리보기" className="w-32 h-40 object-cover rounded border" />
                    )}
                  </div>
                </div>

                {/* 해설집 이미지 */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    해설집 이미지
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'sub')}
                        disabled={uploading}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {uploading && <span className="text-sm text-blue-600">업로드 중...</span>}
                    </div>
                    <input
                      type="url"
                      value={formData.sub_image_url}
                      onChange={(e) => setFormData({ ...formData, sub_image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="또는 URL 직접 입력: /images/grid_kinetic_sol_front.jpg"
                    />
                    {formData.sub_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={formData.sub_image_url} alt="미리보기" className="w-32 h-40 object-cover rounded border" />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  앞표지 이미지
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'front')}
                      disabled={uploading}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    {uploading && <span className="text-sm text-blue-600">업로드 중...</span>}
                  </div>
                  <input
                    type="url"
                    value={formData.front_image_url}
                    onChange={(e) => setFormData({ ...formData, front_image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="또는 URL 직접 입력: /images/kinetic_front.jpg"
                  />
                  {formData.front_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formData.front_image_url} alt="미리보기" className="w-32 h-40 object-cover rounded border" />
                  )}
                </div>
              </div>
            )}

            {/* 구매 링크 */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                구매 링크
              </label>
              <input
                type="url"
                value={formData.purchase_link}
                onChange={(e) => setFormData({ ...formData, purchase_link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? '수정' : '추가'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        )}

        {/* 교재 목록 */}
        <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">과목</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">설명</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">순서</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      등록된 {activeTab === 'grid' ? 'GRID' : 'Subjects'} 교재가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{book.subject}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {book.description || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center">
                        {book.display_order}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <button
                          onClick={() => handleEdit(book)}
                          className="text-blue-600 hover:text-blue-700 mr-3"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
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

