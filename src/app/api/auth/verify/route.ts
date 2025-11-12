import { NextRequest, NextResponse } from 'next/server';

// 환경 변수에서 관리자 비밀번호 가져오기
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// POST: 비밀번호 검증
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

