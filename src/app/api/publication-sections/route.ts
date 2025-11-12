import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 환경 변수에서 관리자 비밀번호 가져오기
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// 캐시 설정: 12시간 (43200초)
export const revalidate = 43200;

// GET: 모든 섹션 가져오기
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('publication_sections')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: 새 섹션 추가
export async function POST(request: NextRequest) {
  try {
    const { category, title, guide_url, use_subjects_background, display_order, password } = await request.json();

    // 비밀번호 확인
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 필수 필드 검증
    if (!category || !title) {
      return NextResponse.json(
        { error: 'Category and title are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('publication_sections')
      .insert([{
        category,
        title,
        guide_url,
        use_subjects_background: use_subjects_background || false,
        display_order: display_order || 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

