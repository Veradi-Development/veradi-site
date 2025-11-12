# VERADI 웹사이트

> 1% 로직을 당신의 것으로

고등·수능 zero to mastery. 국내 최상위권 연구진이 만드는 검증된 교육 콘텐츠.

## 🚀 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Database**: Supabase
- **Deployment**: Vercel (추정)

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Password
ADMIN_PASSWORD=your_secure_password
```

자세한 설정 방법은 [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)를 참조하세요.

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
veradi-site/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── about/             # 소개 페이지
│   │   ├── publications/      # 출판물 페이지
│   │   ├── announcements/     # 공지사항 페이지
│   │   ├── admin/             # 관리자 페이지들
│   │   └── api/               # API 라우트
│   ├── components/            # 재사용 컴포넌트
│   │   ├── admin/            # Admin 전용 컴포넌트
│   │   ├── GridSeries.tsx    # GRID 시리즈 섹션
│   │   ├── Subjects.tsx      # Subjects 섹션
│   │   ├── ValueProposition.tsx # VERA+DI 애니메이션
│   │   └── ...
│   ├── hooks/                # 커스텀 훅
│   │   ├── useAdminAuth.ts   # 관리자 인증
│   │   ├── useMobileDetect.ts
│   │   └── useHorizontalScroll.ts
│   ├── lib/                  # 유틸리티 및 설정
│   │   ├── api.ts           # API 클라이언트
│   │   ├── supabase.ts      # Supabase 클라이언트
│   │   └── constants.ts
│   ├── types/               # TypeScript 타입 정의
│   │   └── index.ts
│   └── utils/               # 유틸리티 함수
│       └── imageUpload.ts
├── public/                  # 정적 파일
├── CODE_IMPROVEMENTS.md     # 코드 개선 가이드
├── ENVIRONMENT_SETUP.md     # 환경 설정 가이드
└── README.md               # 이 파일
```

## 🔐 관리자 페이지

### 접속 경로:
- `/books-admin` - 교재 관리
- `/publications-admin` - 출판물 관리
- `/reviews-admin` - 후기 관리
- `/announcements-admin` - 공지사항 관리

### 인증:
- 환경 변수 `ADMIN_PASSWORD`로 설정된 비밀번호 사용
- 서버 사이드에서 검증
- 세션은 클라이언트 메모리에만 저장 (페이지 새로고침 시 재로그인 필요)

## 📚 주요 기능

### 메인 페이지
- ✨ VERA + DI 합치기 애니메이션
- 📖 GRID 시리즈 교재 소개
- 👥 Subjects 교재 소개
- 💬 학생 후기

### 출판물 페이지
- 📚 카테고리별 교재 분류
- 🎨 두 가지 배경 스타일 (그리드/크림)
- 📱 반응형 디자인
- 🔄 슬라이드 / 그리드 레이아웃

### 관리자 기능
- ✏️ CRUD 작업 (생성/읽기/수정/삭제)
- 🖼️ 이미지 업로드 (Supabase Storage)
- 📋 드래그&드롭 정렬
- 🔒 비밀번호 인증

## 🛠️ 최근 개선 사항

### ✅ 보안
- 하드코딩된 비밀번호를 환경 변수로 이전
- 서버 사이드 비밀번호 검증 API 추가
- API 라우트 보안 강화

### ✅ 코드 품질
- 타입 정의 중앙화 (`src/types/index.ts`)
- 공통 API 클라이언트 생성 (`src/lib/api.ts`)
- 커스텀 훅으로 로직 분리 (`src/hooks/useAdminAuth.ts`)
- 이미지 업로드 유틸리티 통합 (`src/utils/imageUpload.ts`)

### ✅ 사용자 경험
- 에러 바운더리 추가
- 공통 Admin 레이아웃 컴포넌트
- SEO 메타데이터 개선

### ✅ 성능
- API 캐싱 시간: 5분 → 12시간
- 이미지 최적화 (Next.js Image)
- 컴포넌트 레이지 로딩

## 📝 개발 가이드

### 타입 추가
새로운 타입은 `src/types/index.ts`에 추가하세요:
```typescript
export type YourNewType = {
  // ...
};
```

### API 호출
`src/lib/api.ts`의 `apiClient`를 사용하세요:
```typescript
import { apiClient } from '@/lib/api';

const data = await apiClient.get('/endpoint');
await apiClient.post('/endpoint', { data });
```

### 관리자 인증
`useAdminAuth` 훅을 사용하세요:
```typescript
import { useAdminAuth } from '@/hooks/useAdminAuth';

const { isAuthenticated, adminPassword, login } = useAdminAuth();
```

### 이미지 업로드
`uploadImage` 유틸리티를 사용하세요:
```typescript
import { uploadImage } from '@/utils/imageUpload';

const url = await uploadImage(file, adminPassword, {
  onProgress: (progress) => console.log(progress.percentage),
});
```

## 🔍 추가 문서

- [CODE_IMPROVEMENTS.md](./CODE_IMPROVEMENTS.md) - 코드 개선 가이드
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - 환경 변수 설정 가이드

## 📄 라이선스

© 2024 VERADI. All rights reserved.

## 🤝 기여

문제가 발생하거나 개선 제안이 있다면 이슈를 생성해주세요.

