import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 환경 변수에서 관리자 비밀번호 가져오기
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// 캐시 설정: 5분 (300초)
export const revalidate = 300;

// 공지사항 목록 조회
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

// 공지사항 생성
export async function POST(request: NextRequest) {
  try {
    const { title, content, attachments, password } = await request.json();

    // 간단한 비밀번호 인증
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('announcements')
      .insert([{ 
        title, 
        content,
        attachments: attachments || []
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

