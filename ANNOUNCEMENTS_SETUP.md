# 공지사항 시스템 설치 가이드

공지사항 기능이 성공적으로 구현되었습니다! 아래 단계를 따라 설정하세요.

## 📦 설치

### 1. Supabase 패키지 설치

```bash
npm install @supabase/supabase-js
```

## 🔧 Supabase 설정

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 접속하여 새 프로젝트를 생성합니다.
2. 프로젝트 설정에서 API URL과 anon key를 복사합니다.

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 관리자 인증 (원하는 비밀번호로 설정)
ADMIN_PASSWORD=your_admin_password
```

### 3. 데이터베이스 테이블 생성

Supabase SQL Editor에서 `supabase_schema.sql` 파일의 내용을 실행합니다:

1. Supabase 대시보드에서 **SQL Editor** 메뉴로 이동
2. `supabase_schema.sql` 파일의 내용을 복사하여 붙여넣기
3. **Run** 버튼 클릭하여 실행

이 스크립트는 다음을 생성합니다:
- `announcements` 테이블
- 자동 업데이트 시간 트리거
- Row Level Security (RLS) 정책

## 🚀 사용 방법

### 사용자 페이지
- **URL**: `/notice`
- 모든 사용자가 공지사항을 조회할 수 있습니다.
- 공지사항을 클릭하면 상세 내용을 볼 수 있습니다.
- 날짜순으로 정렬되어 표시됩니다.

### 관리자 페이지
- **URL**: `/admin/announcements`
- `.env.local`에 설정한 비밀번호로 로그인합니다.
- 공지사항을 작성, 수정, 삭제할 수 있습니다.

## 📁 파일 구조

```
src/
├── lib/
│   └── supabase.ts                    # Supabase 클라이언트 설정
├── app/
│   ├── notice/
│   │   └── page.tsx                   # 사용자용 공지사항 페이지
│   ├── admin/
│   │   └── announcements/
│   │       └── page.tsx               # 관리자 페이지
│   └── api/
│       └── announcements/
│           ├── route.ts               # GET (목록), POST (생성)
│           └── [id]/
│               └── route.ts           # GET, PUT, DELETE (개별)
supabase_schema.sql                     # 데이터베이스 스키마
```

## 🗄️ 데이터베이스 스키마

### announcements 테이블
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 기본 키 (자동 생성) |
| title | TEXT | 공지사항 제목 |
| content | TEXT | 공지사항 내용 |
| created_at | TIMESTAMP | 생성 시간 (자동) |
| updated_at | TIMESTAMP | 수정 시간 (자동) |

## 🔒 보안

- 관리자 페이지는 비밀번호로 보호됩니다.
- Supabase RLS(Row Level Security)가 활성화되어 있습니다.
- 모든 CUD(Create, Update, Delete) 작업은 서버 측에서 비밀번호를 검증합니다.

## 🎨 기능

### 사용자 페이지
- ✅ 공지사항 목록 조회
- ✅ 날짜순 정렬
- ✅ 상세 내용 모달
- ✅ 반응형 디자인

### 관리자 페이지
- ✅ 비밀번호 인증
- ✅ 공지사항 작성
- ✅ 공지사항 수정
- ✅ 공지사항 삭제
- ✅ 실시간 목록 업데이트

## 🚨 주의사항

1. `.env.local` 파일은 절대 Git에 커밋하지 마세요.
2. 프로덕션 환경에서는 더 강력한 인증 시스템(예: NextAuth.js)을 사용하는 것을 권장합니다.
3. 관리자 비밀번호는 강력한 비밀번호를 사용하세요.

## 💡 추가 개선 사항 (선택사항)

- 검색 기능 추가
- 페이지네이션 구현
- 이미지 업로드 기능
- 공지사항 고정 기능
- 조회수 카운터
- 카테고리 분류

## 🐛 문제 해결

### Supabase 연결 오류
- `.env.local` 파일의 환경 변수가 올바른지 확인하세요.
- Supabase 프로젝트가 활성 상태인지 확인하세요.

### 관리자 로그인 실패
- `.env.local`의 `ADMIN_PASSWORD`가 올바르게 설정되었는지 확인하세요.
- 서버를 재시작했는지 확인하세요 (환경 변수 변경 후).

### 공지사항이 표시되지 않음
- Supabase SQL Editor에서 테이블이 정상적으로 생성되었는지 확인하세요.
- RLS 정책이 올바르게 설정되었는지 확인하세요.

