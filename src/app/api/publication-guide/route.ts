import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'veradi2025';

// GET: 가이드 섹션 정보 가져오기
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('publication_guide')
      .select('*')
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: 가이드 섹션 정보 수정
export async function PUT(request: NextRequest) {
  try {
    const { main_title, hero_title, video_url, hero_image_url, password } = await request.json();

    // 비밀번호 확인
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 기존 가이드 섹션 가져오기
    const { data: existing } = await supabase
      .from('publication_guide')
      .select('id')
      .single();

    if (existing) {
      // 업데이트
      const { data, error } = await supabase
        .from('publication_guide')
        .update({
          main_title,
          hero_title,
          video_url,
          hero_image_url,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    } else {
      // 새로 생성
      const { data, error } = await supabase
        .from('publication_guide')
        .insert([{
          main_title,
          hero_title,
          video_url,
          hero_image_url,
        }])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data, { status: 201 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

