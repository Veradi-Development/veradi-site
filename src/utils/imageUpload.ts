import { apiClient } from '@/lib/api';

export type UploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
};

export type UploadOptions = {
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
};

/**
 * 이미지 파일을 업로드합니다
 * @param file - 업로드할 파일
 * @param password - 관리자 비밀번호
 * @param options - 업로드 옵션 (진행률 콜백 등)
 * @returns 업로드된 이미지 URL
 */
export async function uploadImage(
  file: File,
  password: string,
  options?: UploadOptions
): Promise<string> {
  try {
    // 파일 크기 검증 (10MB 제한)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      throw new Error('파일 크기는 10MB를 초과할 수 없습니다');
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('지원되지 않는 파일 형식입니다. (jpg, png, webp, gif만 가능)');
    }

    // 진행률 시작
    options?.onProgress?.({
      loaded: 0,
      total: file.size,
      percentage: 0,
    });

    // 업로드 실행
    const result = await apiClient.uploadFile(file, password);

    // 진행률 완료
    options?.onProgress?.({
      loaded: file.size,
      total: file.size,
      percentage: 100,
    });

    options?.onSuccess?.(result.url);
    return result.url;

  } catch (error) {
    const err = error instanceof Error ? error : new Error('업로드 실패');
    options?.onError?.(err);
    throw err;
  }
}

/**
 * 여러 이미지를 순차적으로 업로드합니다
 */
export async function uploadMultipleImages(
  files: File[],
  password: string,
  onProgress?: (index: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];
  
  for (let i = 0; i < files.length; i++) {
    onProgress?.(i, files.length);
    const url = await uploadImage(files[i], password);
    urls.push(url);
  }
  
  onProgress?.(files.length, files.length);
  return urls;
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 이미지 미리보기 URL 생성
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * 이미지 미리보기 URL 정리
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}

