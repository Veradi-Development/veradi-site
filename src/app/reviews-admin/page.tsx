'use client';

import { useState, useEffect } from 'react';

type Review = {
  id: string;
  name: string;
  school: string;
  content: string;
  rating: number;
  display_order: number;
  created_at: string;
  updated_at: string;
};

const ADMIN_PASSWORD = 'veradi2025';

export default function AdminReviewsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    content: '',
    rating: 5,
    display_order: 0,
  });

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

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews', {
        cache: 'no-store', // 관리자 페이지는 항상 최신 데이터 표시
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setReviews(data);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReviews();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/reviews/${editingId}` : '/api/reviews';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, password: ADMIN_PASSWORD }),
      });

      if (response.ok) {
        alert(editingId ? '후기가 수정되었습니다' : '후기가 추가되었습니다');
        setShowForm(false);
        setEditingId(null);
        setFormData({
          name: '',
          school: '',
          content: '',
          rating: 5,
          display_order: 0,
        });
        fetchReviews();
      } else {
        const error = await response.json();
        alert(`오류: ${error.error}`);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('제출 중 오류가 발생했습니다');
    }
  };

  const handleEdit = (review: Review) => {
    setFormData({
      name: review.name,
      school: review.school,
      content: review.content,
      rating: review.rating,
      display_order: review.display_order,
    });
    setEditingId(review.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/reviews/${id}?password=${ADMIN_PASSWORD}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('후기가 삭제되었습니다');
        fetchReviews();
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">후기 관리</h1>
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
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">후기 관리</h1>
          <p className="text-gray-600">학생 후기를 관리합니다</p>
        </div>

        {/* 새 후기 추가 버튼 */}
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              school: '',
              content: '',
              rating: 5,
              display_order: 0,
            });
          }}
          className="mb-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {showForm ? '취소' : '새 후기 추가'}
        </button>

        {/* 후기 추가/수정 폼 */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg border border-gray-300">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? '후기 수정' : '새 후기 추가'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 김서연"
                  required
                />
              </div>

              {/* 학교 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학교 *
                </label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 대원외고 2학년"
                  required
                />
              </div>

              {/* 별점 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  별점 *
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5점)</option>
                  <option value={4}>⭐⭐⭐⭐ (4점)</option>
                  <option value={3}>⭐⭐⭐ (3점)</option>
                  <option value={2}>⭐⭐ (2점)</option>
                  <option value={1}>⭐ (1점)</option>
                </select>
              </div>

              {/* 표시 순서 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  표시 순서
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 후기 내용 */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                후기 내용 *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="이 책을 이제 알았다는 것이 가장 아쉽습니다."
                required
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

        {/* 후기 목록 */}
        <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">이름</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">학교</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">후기 내용</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">별점</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">순서</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">작업</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      등록된 후기가 없습니다.
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {review.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {review.school}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-md truncate">
                        {review.content}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {'⭐'.repeat(review.rating)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center">
                        {review.display_order}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <button
                          onClick={() => handleEdit(review)}
                          className="text-blue-600 hover:text-blue-700 mr-3"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
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

