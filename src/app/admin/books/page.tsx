'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    type: 'grid' as 'grid' | 'subject',
    main_image_url: '',
    sub_image_url: '',
    front_image_url: '',
    purchase_link: '',
    display_order: 0,
  });

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
    fetchBooks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/books/${editingId}` : '/api/books';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, password: ADMIN_PASSWORD }),
      });

      if (response.ok) {
        alert(editingId ? '교재가 수정되었습니다' : '교재가 추가되었습니다');
        setShowForm(false);
        setEditingId(null);
        setFormData({
          title: '',
          subject: '',
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
      title: book.title,
      subject: book.subject,
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">교재 관리</h1>
          <p className="text-gray-600">GRID와 Subjects 교재를 관리합니다</p>
        </div>

        {/* 새 교재 추가 버튼 */}
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              title: '',
              subject: '',
              description: '',
              type: 'grid',
              main_image_url: '',
              sub_image_url: '',
              front_image_url: '',
              purchase_link: '',
              display_order: 0,
            });
          }}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? '취소' : '새 교재 추가'}
        </button>

        {/* 교재 추가/수정 폼 */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg border border-gray-300">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? '교재 수정' : '새 교재 추가'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

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
                  placeholder="예: 물리학, 화학"
                  required
                />
              </div>

              {/* 타입 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  타입 *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'grid' | 'subject' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="grid">GRID (문제집+해설집)</option>
                  <option value="subject">Subjects (팀 교재)</option>
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

            {/* 설명 */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명 (Subjects용)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="예: 기본에 충실하게, 담백하게, 매력있게."
              />
            </div>

            {/* 이미지 URL */}
            {formData.type === 'grid' ? (
              <>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    문제집 이미지 URL
                  </label>
                  <input
                    type="url"
                    value={formData.main_image_url}
                    onChange={(e) => setFormData({ ...formData, main_image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="/images/grid_kinetic_front.jpg"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    해설집 이미지 URL
                  </label>
                  <input
                    type="url"
                    value={formData.sub_image_url}
                    onChange={(e) => setFormData({ ...formData, sub_image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="/images/grid_kinetic_sol_front.jpg"
                  />
                </div>
              </>
            ) : (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  앞표지 이미지 URL
                </label>
                <input
                  type="url"
                  value={formData.front_image_url}
                  onChange={(e) => setFormData({ ...formData, front_image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="/images/kinetic_front.jpg"
                />
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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">타입</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">과목</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">제목</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">설명</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">순서</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">작업</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      등록된 교재가 없습니다.
                    </td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          book.type === 'grid' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {book.type === 'grid' ? 'GRID' : 'Subjects'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{book.subject}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{book.title}</td>
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

