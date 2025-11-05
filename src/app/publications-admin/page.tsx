'use client';

import { useState, useEffect } from 'react';

type PublicationGuide = {
  id: string;
  main_title: string;
  hero_title: string;
  video_url: string | null;
  hero_image_url: string | null;
};

type PublicationSection = {
  id: string;
  category: string;
  title: string;
  guide_url: string | null;
  use_subjects_background: boolean;
  display_order: number;
};

type PublicationBook = {
  id: string;
  title: string;
  subject: string;
  category: string | null;
  series: string | null;
  front_image_url: string | null;
  purchase_link: string | null;
  display_order: number;
};

const ADMIN_PASSWORD = 'veradi2025';

export default function AdminPublicationsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'guide' | 'sections' | 'books'>('guide');
  const [loading, setLoading] = useState(true);

  // Guide state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guide, setGuide] = useState<PublicationGuide | null>(null);
  const [guideForm, setGuideForm] = useState({
    main_title: '',
    hero_title: '',
    video_url: '',
    hero_image_url: '',
  });

  // Sections state
  const [sections, setSections] = useState<PublicationSection[]>([]);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionForm, setSectionForm] = useState({
    category: '',
    title: '',
    guide_url: '',
    use_subjects_background: true, // subjects 배경이 기본
    display_order: 0,
  });

  // Books state
  const [books, setBooks] = useState<PublicationBook[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState({
    subject: '',
    category: '',
    series: '',
    front_image_url: '',
    purchase_link: '',
    display_order: 0,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

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

  // Fetch data
  useEffect(() => {
    if (isAuthenticated) {
      fetchGuide();
      fetchSections();
      fetchBooks();
    }
  }, [isAuthenticated]);

  const fetchGuide = async () => {
    try {
      // 타임스탬프로 캐시 완전 우회
      const response = await fetch(`/api/publication-guide?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setGuide(data);
        setGuideForm({
          main_title: data.main_title || '',
          hero_title: data.hero_title || '',
          video_url: data.video_url || '',
          hero_image_url: data.hero_image_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching guide:', error);
    }
  };

  const fetchSections = async () => {
    try {
      // 타임스탬프로 캐시 완전 우회
      const response = await fetch(`/api/publication-sections?t=${Date.now()}`, {
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
          setSections(data);
        }
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      // publications 교재 가져오기 (type='publication') + 타임스탬프로 캐시 완전 우회
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
          setBooks(data);
        }
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleGuideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
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
      setGuideForm(prev => ({ ...prev, hero_image_url: data.url }));
      
      alert('이미지가 업로드되었습니다');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('이미지 업로드 중 오류가 발생했습니다');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/publication-guide', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...guideForm, password: ADMIN_PASSWORD }),
      });

      if (response.ok) {
        alert('가이드 섹션이 수정되었습니다');
        fetchGuide();
      } else {
        const error = await response.json();
        alert(`오류: ${error.error}`);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('제출 중 오류가 발생했습니다');
    }
  };

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingSectionId ? `/api/publication-sections/${editingSectionId}` : '/api/publication-sections';
      const method = editingSectionId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sectionForm, password: ADMIN_PASSWORD }),
      });

      if (response.ok) {
        alert(editingSectionId ? '섹션이 수정되었습니다' : '섹션이 추가되었습니다');
        setShowSectionForm(false);
        setEditingSectionId(null);
        setSectionForm({
          category: '',
          title: '',
          guide_url: '',
          use_subjects_background: true,
          display_order: 0,
        });
        fetchSections();
      } else {
        const error = await response.json();
        alert(`오류: ${error.error}`);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('제출 중 오류가 발생했습니다');
    }
  };

  const handleSectionDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/publication-sections/${id}?password=${ADMIN_PASSWORD}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('섹션이 삭제되었습니다');
        fetchSections();
      } else {
        const error = await response.json();
        alert(`오류: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('삭제 중 오류가 발생했습니다');
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingBookId ? `/api/books/${editingBookId}` : '/api/books';
      const method = editingBookId ? 'PUT' : 'POST';

      // 제목 자동 생성: "과목 + 시리즈" 또는 "과목"만
      const generatedTitle = bookForm.series 
        ? `${bookForm.subject} ${bookForm.series}` 
        : bookForm.subject;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookForm,
          title: generatedTitle,
          // publications 교재는 type='publication'으로 설정
          type: 'publication',
          password: ADMIN_PASSWORD,
        }),
      });

      if (response.ok) {
        alert(editingBookId ? '교재가 수정되었습니다' : '교재가 추가되었습니다');
        setShowBookForm(false);
        setEditingBookId(null);
        setBookForm({
          subject: '',
          category: '',
          series: '',
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
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
      setBookForm(prev => ({ ...prev, front_image_url: data.url }));
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

  const filteredBooks = (selectedCategory === 'all' 
    ? books 
    : books.filter(book => book.category === selectedCategory))
    .sort((a, b) => {
      // 카테고리별로 먼저 정렬
      if (a.category !== b.category) {
        return (a.category || '').localeCompare(b.category || '');
      }
      // 같은 카테고리 내에서는 display_order로 정렬
      return (a.display_order || 0) - (b.display_order || 0);
    });

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
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">출판물 관리</h1>
          <p className="text-gray-600">출판물 페이지의 내용을 관리합니다</p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-6 border-b border-gray-300">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'guide'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              가이드 섹션
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'sections'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              섹션 설정
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'books'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              교재 관리
            </button>
          </div>
        </div>

        {/* 가이드 섹션 탭 */}
        {activeTab === 'guide' && (
          <div>
            <form onSubmit={handleGuideSubmit} className="bg-white p-6 rounded-lg border border-gray-300">
              <h2 className="text-xl font-bold mb-4">완벽활용가이드 섹션 수정</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    메인 제목
                  </label>
                  <input
                    type="text"
                    value={guideForm.main_title}
                    onChange={(e) => setGuideForm({ ...guideForm, main_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="완벽활용가이드"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    히어로 제목 (HTML 가능)
                  </label>
                  <textarea
                    value={guideForm.hero_title}
                    onChange={(e) => setGuideForm({ ...guideForm, hero_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="VERADI 교재,<br />제대로 활용하기"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    동영상 URL
                  </label>
                  <input
                    type="url"
                    value={guideForm.video_url}
                    onChange={(e) => setGuideForm({ ...guideForm, video_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://youtu.be/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    히어로 이미지
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGuideImageUpload}
                        disabled={uploadingImage}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {uploadingImage && <span className="text-sm text-blue-600">업로드 중...</span>}
                    </div>
                    <input
                      type="url"
                      value={guideForm.hero_image_url}
                      onChange={(e) => setGuideForm({ ...guideForm, hero_image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="또는 URL 직접 입력: /images/guide-hero.jpg"
                    />
                    {guideForm.hero_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={guideForm.hero_image_url} alt="히어로 이미지 미리보기" className="w-full max-w-md h-48 object-cover rounded border" />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 섹션 설정 탭 */}
        {activeTab === 'sections' && (
          <div>
            <button
              onClick={() => {
                setShowSectionForm(!showSectionForm);
                setEditingSectionId(null);
                setSectionForm({
                  category: '',
                  title: '',
                  guide_url: '',
                  use_subjects_background: true,
                  display_order: 0,
                });
              }}
              className="mb-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {showSectionForm ? '취소' : '새 섹션 추가'}
            </button>

            {showSectionForm && (
              <form onSubmit={handleSectionSubmit} className="mb-8 bg-white p-6 rounded-lg border border-gray-300">
                <h2 className="text-xl font-bold mb-4">
                  {editingSectionId ? '섹션 수정' : '새 섹션 추가'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리 ID *
                    </label>
                    <input
                      type="text"
                      value={sectionForm.category}
                      onChange={(e) => setSectionForm({ ...sectionForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="grid_concept"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      제목 *
                    </label>
                    <input
                      type="text"
                      value={sectionForm.title}
                      onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="GRID 개념편"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      더 알아보기 URL
                    </label>
                    <input
                      type="url"
                      value={sectionForm.guide_url}
                      onChange={(e) => setSectionForm({ ...sectionForm, guide_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://youtu.be/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      표시 순서
                    </label>
                    <input
                      type="number"
                      value={sectionForm.display_order}
                      onChange={(e) => setSectionForm({ ...sectionForm, display_order: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!sectionForm.use_subjects_background}
                      onChange={(e) => setSectionForm({ ...sectionForm, use_subjects_background: !e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">그리드 스타일 배경 사용</span>
                  </label>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingSectionId ? '수정' : '추가'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSectionForm(false);
                      setEditingSectionId(null);
                    }}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            )}

            {/* 섹션 목록 */}
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">카테고리</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">제목</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">배경</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">순서</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        등록된 섹션이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    sections.map((section) => (
                      <tr key={section.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{section.category}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{section.title}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          {section.use_subjects_background ? '블루' : '그리드'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-center">
                          {section.display_order}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <button
                            onClick={() => {
                              setSectionForm({
                                category: section.category,
                                title: section.title,
                                guide_url: section.guide_url || '',
                                use_subjects_background: section.use_subjects_background,
                                display_order: section.display_order,
                              });
                              setEditingSectionId(section.id);
                              setShowSectionForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 mr-3"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleSectionDelete(section.id)}
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
        )}

        {/* 교재 관리 탭 */}
        {activeTab === 'books' && (
          <div>
            {/* 상단 버튼 및 필터 */}
            <div className="mb-6 flex gap-3 items-center">
              {!showBookForm && (
                <>
                  <label className="text-sm font-medium text-gray-700">보기 필터:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체 교재 보기</option>
                    {sections.map((section) => (
                      <option key={section.category} value={section.category}>
                        {section.title}만 보기
                      </option>
                    ))}
                  </select>
                </>
              )}
              <button
                onClick={() => {
                  setShowBookForm(!showBookForm);
                  setEditingBookId(null);
                  setBookForm({
                    subject: '',
                    category: selectedCategory !== 'all' ? selectedCategory : '',
                    series: '',
                    front_image_url: '',
                    purchase_link: '',
                    display_order: 0,
                  });
                }}
                className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                      과목 *
                    </label>
                    <input
                      type="text"
                      value={bookForm.subject}
                      onChange={(e) => setBookForm({ ...bookForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="물리학"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      시리즈
                    </label>
                    <input
                      type="text"
                      value={bookForm.series}
                      onChange={(e) => setBookForm({ ...bookForm, series: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="GRID 개념편"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리 * (섹션 선택)
                    </label>
                    <select
                      value={bookForm.category}
                      onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">선택하세요</option>
                      {sections.map((section) => (
                        <option key={section.category} value={section.category}>
                          {section.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      교재 이미지
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
                        value={bookForm.front_image_url}
                        onChange={(e) => setBookForm({ ...bookForm, front_image_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="또는 URL 직접 입력: /images/grid_kinetic_front.jpg"
                      />
                      {bookForm.front_image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={bookForm.front_image_url} alt="미리보기" className="w-32 h-40 object-cover rounded border" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      구매 링크
                    </label>
                    <input
                      type="url"
                      value={bookForm.purchase_link}
                      onChange={(e) => setBookForm({ ...bookForm, purchase_link: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://smartstore.naver.com/veradi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      표시 순서 (카테고리 내)
                    </label>
                    <input
                      type="number"
                      value={bookForm.display_order}
                      onChange={(e) => setBookForm({ ...bookForm, display_order: parseInt(e.target.value) })}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="같은 카테고리 내에서의 순서"
                    />
                    <p className="text-xs text-gray-500 mt-1">* 선택한 카테고리 섹션 내에서 표시되는 순서입니다</p>
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

            {/* 교재 목록 */}
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">과목</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">제목</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">카테고리</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">순서</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        등록된 교재가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book) => (
                      <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{book.subject}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{book.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {sections.find(s => s.category === book.category)?.title || book.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-center">
                          {book.display_order}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <button
                            onClick={() => {
                              setBookForm({
                                subject: book.subject,
                                category: book.category || '',
                                series: book.series || '',
                                front_image_url: book.front_image_url || '',
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
        )}
      </div>
    </div>
  );
}

