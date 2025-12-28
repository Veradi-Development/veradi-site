'use client';

import { useEffect, useState } from 'react';
import { Announcement } from '@/lib/supabase';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

export default function AdminAnnouncementsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '공지사항',
    attachments: [] as Array<{ name: string; url: string; size: number; type: string }>,
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnnouncements();
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

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      const data = await response.json();
      if (Array.isArray(data)) {
        setAnnouncements(data);
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingId 
        ? `/api/announcements/${editingId}`
        : '/api/announcements';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          password: adminPassword,
        }),
      });

      if (response.ok) {
        await fetchAnnouncements();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          title: '',
          content: '',
          category: '공지사항',
          attachments: [],
        });
      } else {
        const data = await response.json();
        setError(data.error || '저장 중 오류가 발생했습니다.');
      }
    } catch {
      setError('저장 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category || '공지사항',
      attachments: announcement.attachments || [],
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/announcements/${id}?password=${encodeURIComponent(adminPassword)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchAnnouncements();
      } else {
        const data = await response.json();
        setError(data.error || '삭제 중 오류가 발생했습니다.');
      }
    } catch {
      setError('삭제 중 오류가 발생했습니다.');
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
            <h1 className="text-3xl font-bold">공지사항 관리</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) {
                  setEditingId(null);
                  setFormData({
                    title: '',
                    content: '',
                    category: '공지사항',
                    attachments: [],
                  });
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {showForm ? '취소' : '새 공지사항'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? '공지사항 수정' : '새 공지사항 작성'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    분류
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="공지사항">공지사항</option>
                    <option value="학습자료">학습자료</option>
                    <option value="정오표">정오표</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    내용
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    onImageUpload={async (file: File) => {
                      try {
                        const uploadFormData = new FormData();
                        uploadFormData.append('file', file);

                        const response = await fetch(`/api/upload?password=${encodeURIComponent(adminPassword)}`, {
                          method: 'POST',
                          body: uploadFormData,
                        });

                        if (response.ok) {
                          const data = await response.json();
                          return data.url;
                        } else {
                          const errorData = await response.json();
                          throw new Error(errorData.error || '이미지 업로드에 실패했습니다.');
                        }
                      } catch (error) {
                        console.error('Image upload error:', error);
                        throw error;
                      }
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    첨부 파일
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer transition-colors border border-gray-300">
                        {uploadingFile ? '업로드 중...' : '파일 선택'}
                        <input
                          type="file"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setUploadingFile(true);
                            setError('');

                            try {
                              const uploadFormData = new FormData();
                              uploadFormData.append('file', file);

                              const response = await fetch(`/api/upload?password=${encodeURIComponent(adminPassword)}`, {
                                method: 'POST',
                                body: uploadFormData,
                              });

                              if (response.ok) {
                                const data = await response.json();
                                setFormData((prev) => ({
                                  ...prev,
                                  attachments: [
                                    ...prev.attachments,
                                    {
                                      name: data.name,
                                      url: data.url,
                                      size: data.size,
                                      type: data.type,
                                    },
                                  ],
                                }));
                              } else {
                                const errorData = await response.json();
                                setError(errorData.error || '파일 업로드에 실패했습니다.');
                              }
                            } catch {
                              setError('파일 업로드 중 오류가 발생했습니다.');
                            } finally {
                              setUploadingFile(false);
                              e.target.value = '';
                            }
                          }}
                          className="hidden"
                          disabled={uploadingFile}
                        />
                      </label>
                    </div>
                    {formData.attachments.length > 0 && (
                      <div className="border border-gray-300 rounded-md p-3 space-y-2">
                        {formData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-sm text-gray-600">📎</span>
                              <span className="text-sm text-gray-700 truncate">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  attachments: formData.attachments.filter((_, i) => i !== index),
                                });
                              }}
                              className="text-red-600 hover:text-red-800 text-sm ml-2"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingId ? '수정' : '저장'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({
                        title: '',
                        content: '',
                        category: '공지사항',
                        attachments: [],
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">분류</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">날짜</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {announcements.map((announcement) => (
                    <tr key={announcement.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {announcement.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {announcement.category || '공지사항'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(announcement.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {announcements.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  등록된 공지사항이 없습니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

