import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 환경 변수에서 관리자 비밀번호 가져오기
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
// Supabase Storage 버킷 이름 (환경 변수로 설정 가능, 기본값: 'publications')
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'publications';

export async function POST(request: NextRequest) {
  try {
    // 쿼리 파라미터에서 비밀번호 가져오기
    const password = request.nextUrl.searchParams.get('password');

    // 간단한 비밀번호 인증
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (10MB 제한)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // 파일 타입 확인 (이미지인지 일반 파일인지)
    const isImage = file.type.startsWith('image/');
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    // 이미지가 아닌 경우 타입 검증 건너뛰기 (모든 파일 허용)
    if (isImage && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid image type. Only jpg, png, webp, gif are allowed' },
        { status: 400 }
      );
    }

    // 파일 이름을 안전하게 처리 (한글, 공백 등 제거)
    const timestamp = Date.now();
    const originalName = file.name;
    const lastDotIndex = originalName.lastIndexOf('.');
    
    // 확장자 추출 (점이 없으면 빈 문자열)
    const extension = lastDotIndex > 0 ? originalName.substring(lastDotIndex) : '';
    
    // 파일명 추출 및 안전하게 변환
    const baseName = lastDotIndex > 0 
      ? originalName.substring(0, lastDotIndex)
      : originalName;
    
    const safeName = baseName
      .replace(/[^a-zA-Z0-9]/g, '_') // 영문, 숫자만 허용
      .substring(0, 100); // 최대 길이 제한
    
    // safeName이 비어있으면 기본값 사용
    const finalName = safeName || 'file';
    
    // 이미지인 경우 book-images 폴더에, 그 외는 announcement-files 폴더에 저장
    const folder = isImage ? 'book-images' : 'announcement-files';
    const fileName = `${folder}/${timestamp}_${finalName}${extension}`;

    // File을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Supabase Storage에 업로드
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      // 버킷이 없는 경우 더 명확한 에러 메시지
      if (error.message.includes('bucket') || error.message.includes('not found')) {
        return NextResponse.json(
          { 
            error: `Storage bucket '${STORAGE_BUCKET}' not found. Please create the bucket in Supabase Storage or set SUPABASE_STORAGE_BUCKET environment variable.`,
            details: error.message
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: error.message || 'Failed to upload file' },
        { status: 500 }
      );
    }

    // 공개 URL 가져오기
    const { data: urlData } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    return NextResponse.json({
      name: file.name, // 원본 파일명 유지 (표시용)
      url: urlData.publicUrl,
      size: file.size,
      type: file.type,
      storedName: fileName, // 실제 저장된 파일명
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { password, fileName } = await request.json();

    // 간단한 비밀번호 인증
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!fileName) {
      return NextResponse.json(
        { error: 'No file name provided' },
        { status: 400 }
      );
    }

    // Supabase Storage에서 삭제
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([fileName]);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}

