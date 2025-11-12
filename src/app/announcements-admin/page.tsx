'use client';

import { useEffect, useState } from 'react';
import { Announcement } from '@/lib/supabase';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

export default function AdminAnnouncementsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState(''); // 인증 성공 후 저장
  const [error, setError] = useState('');
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    attachments: [] as Array<{ name: string; url: string; size: number; type: string }>,
  });
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState<Array<{ name: string; url: string; size: number; type: string }>>([]); // 별도 파일 목록 상태

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
      fetchAnnouncements();
    }
  }, [isAuthenticated]);

  const fetchAnnouncements = async () => {
    try {
      // 타임스탬프로 캐시 완전 우회
      const response = await fetch(`/api/announcements?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      const data = await response.json();
      
      // 데이터가 배열인지 확인
      if (Array.isArray(data)) {
        setAnnouncements(data);
      } else {
        console.error('API response is not an array:', data);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/announcements/${editingId}`
        : '/api/announcements';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          password: adminPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save announcement');
      }

      // 폼 초기화 및 목록 새로고침
      setFormData({ title: '', content: '', attachments: [] });
      setAttachments([]);
      setShowForm(false);
      setEditingId(null);
      fetchAnnouncements();
    } catch (error) {
      alert(error instanceof Error ? error.message : '오류가 발생했습니다');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      attachments: announcement.attachments || [],
    });
    setAttachments(announcement.attachments || []);
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedFiles = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        
        const response = await fetch(`/api/upload?password=${encodeURIComponent(adminPassword)}`, {
          method: 'POST',
          body: uploadFormData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '파일 업로드 실패');
        }

        uploadedFiles.push(data);
      }

      // attachments 상태와 formData 모두 업데이트
      const newAttachmentsList = [...attachments, ...uploadedFiles];
      setAttachments(newAttachmentsList);
      
      setFormData(prev => ({
        ...prev,
        attachments: newAttachmentsList,
      }));
      
      // 입력 필드 초기화
      e.target.value = '';
    } catch (error) {
      alert(error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    setFormData({
      ...formData,
      attachments: newAttachments,
    });
  };

  const handleImageUploadForEditor = async (file: File): Promise<string> => {
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
    return data.url;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: adminPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete announcement');
      }

      fetchAnnouncements();
    } catch (error) {
      alert(error instanceof Error ? error.message : '오류가 발생했습니다');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 비밀번호 인증 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">공지사항 관리</h1>
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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              공지사항 관리
            </h1>
            <p className="text-gray-600">공지사항을 생성, 수정, 삭제할 수 있습니다</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ title: '', content: '', attachments: [] });
              setAttachments([]);
            }}
            className="bg-blue-600 text-white px-6 py-2.5 hover:bg-blue-700 transition-colors"
          >
            {showForm ? '취소' : '새 공지사항'}
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <div className="bg-white border border-gray-300 p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {editingId ? '공지사항 수정' : '새 공지사항 작성'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700">
                    제목
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="공지사항 제목을 입력하세요"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2 text-gray-700">
                    내용
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    onImageUpload={handleImageUploadForEditor}
                  />
                </div>
                <div>
                  <label htmlFor="files" className="block text-sm font-medium mb-2 text-gray-700">
                    첨부파일
                  </label>
                  <input
                    type="file"
                    id="files"
                    onChange={handleFileUpload}
                    multiple
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {uploading && (
                    <p className="text-sm text-blue-600 mt-2">업로드 중...</p>
                  )}
                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium text-gray-700">첨부된 파일 ({attachments.length}개)</p>
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border border-gray-200"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {file.type.startsWith('image/') ? (
                              <span className="text-blue-600">🖼️</span>
                            ) : (
                              <span className="text-gray-600">📄</span>
                            )}
                            <span className="text-sm text-gray-700 truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-600 hover:text-red-700 text-sm ml-2"
                          >
                            삭제
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2.5 hover:bg-blue-700 transition-colors"
                  >
                    {editingId ? '수정하기' : '등록하기'}
                  </button>
                  <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                        setFormData({ title: '', content: '', attachments: [] });
                        setAttachments([]);
                      }}
                    className="px-8 py-2.5 border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">로딩 중...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-300">
            <p className="text-lg text-gray-500">등록된 공지사항이 없습니다</p>
            <p className="text-gray-400 mt-2">새 공지사항 버튼을 눌러 작성해보세요</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-300">
            {/* 테이블 헤더 */}
            <div className="border-b border-gray-300 bg-gray-50">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-700">
                <div className="col-span-1 text-center">번호</div>
                <div className="col-span-5">제목</div>
                <div className="col-span-3 text-center">작성일</div>
                <div className="col-span-3 text-center">관리</div>
              </div>
            </div>

            {/* 테이블 내용 */}
            <div>
              {announcements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-gray-200 hover:bg-gray-50 transition-colors items-center"
                >
                  <div className="col-span-1 text-center text-gray-600">
                    {announcements.length - index}
                  </div>
                  <div className="col-span-5">
                    <h3 className="text-gray-900 font-medium mb-1 flex items-center gap-2">
                      {announcement.title}
                      {announcement.attachments && announcement.attachments.length > 0 && (
                        <span className="text-xs text-gray-500">📎 {announcement.attachments.length}</span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {announcement.content}
                    </p>
                  </div>
                  <div className="col-span-3 text-center text-sm text-gray-600">
                    <div>{formatDate(announcement.created_at)}</div>
                    {announcement.updated_at !== announcement.created_at && (
                      <div className="text-xs text-gray-400 mt-1">
                        수정: {formatDate(announcement.updated_at)}
                      </div>
                    )}
                  </div>
                  <div className="col-span-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="px-4 py-1.5 bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors rounded"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="px-4 py-1.5 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors rounded"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

