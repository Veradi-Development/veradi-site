import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 환경 변수에서 관리자 비밀번호 가져오기
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// 캐시 설정: 5분 (300초)
export const revalidate = 300;

// GET: 모든 후기 가져오기
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: 새 후기 추가
export async function POST(request: NextRequest) {
  try {
    const { name, school, content, rating, display_order, password } = await request.json();

    // 비밀번호 확인
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 필수 필드 검증
    if (!name || !school || !content) {
      return NextResponse.json(
        { error: 'Name, school, and content are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert([{
        name,
        school,
        content,
        rating: rating || 5,
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

