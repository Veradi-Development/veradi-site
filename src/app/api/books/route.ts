import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 환경 변수에서 관리자 비밀번호 가져오기
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// 캐시 설정: 12시간 (43200초)
export const revalidate = 43200;

// GET: 모든 교재 가져오기
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type'); // 'grid' 또는 'subject' 필터링

    let query = supabase
      .from('books')
      .select('*')
      .order('display_order', { ascending: true });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

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

// POST: 새 교재 추가
export async function POST(request: NextRequest) {
  try {
    const { 
      title, 
      subject, 
      description, 
      type, 
      category,
      series,
      main_image_url, 
      sub_image_url, 
      front_image_url, 
      purchase_link, 
      price,
      display_order,
      password 
    } = await request.json();

    // 비밀번호 확인
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 필수 필드 검증
    if (!title || !subject || !type) {
      return NextResponse.json(
        { error: 'Title, subject, and type are required' },
        { status: 400 }
      );
    }
    
    // publications 교재는 category도 필수
    if (type === 'publication' && !category) {
      return NextResponse.json(
        { error: 'Category is required for publication books' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('books')
      .insert([{
        title,
        subject,
        description,
        type,
        category,
        series,
        main_image_url,
        sub_image_url,
        front_image_url,
        purchase_link,
        price,
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

