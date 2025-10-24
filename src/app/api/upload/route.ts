import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // 쿼리 파라미터에서 비밀번호 가져오기
    const password = request.nextUrl.searchParams.get('password');

    // 간단한 비밀번호 인증
    if (password !== process.env.ADMIN_PASSWORD) {
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

    // 파일 이름을 안전하게 처리 (한글, 공백 등 제거)
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const safeName = originalName
      .substring(0, originalName.lastIndexOf('.'))
      .replace(/[^a-zA-Z0-9]/g, '_'); // 영문, 숫자만 허용
    const fileName = `${timestamp}_${safeName}${extension}`;

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('announcement-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from('announcement-files')
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
    if (password !== process.env.ADMIN_PASSWORD) {
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
    const { error } = await supabase.storage
      .from('announcement-files')
      .remove([fileName]);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}

