# 환경 변수 설정 가이드

## 📌 필수 설정

보안 개선 작업이 완료되었습니다. 이제 `.env.local` 파일을 생성하고 환경 변수를 설정해야 합니다.

---

## 1️⃣ `.env.local` 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하세요:

```bash
# 프로젝트 루트에서
touch .env.local
```

또는 Windows에서:
```powershell
New-Item -Path .env.local -ItemType File
```

---

## 2️⃣ 환경 변수 추가

`.env.local` 파일에 다음 내용을 추가하세요:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Admin Password (서버 사이드에서만 사용)
ADMIN_PASSWORD=your_secure_password_here
```

### 🔑 중요사항:
- `ADMIN_PASSWORD`는 **강력한 비밀번호**로 설정하세요 (예: `V3r@d!Secur3P@ssw0rd2025!`)
- 이전 비밀번호 `veradi2025`는 이제 코드에 노출되지 않습니다
- `.env.local` 파일은 절대 Git에 커밋하지 마세요 (`.gitignore`에 포함되어야 함)

---

## 3️⃣ .gitignore 확인

`.gitignore`에 다음 항목이 있는지 확인하세요:

```
# 환경 변수
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## 4️⃣ 개발 서버 재시작

환경 변수를 추가한 후에는 **반드시 개발 서버를 재시작**해야 합니다:

```bash
# 서버 중지 (Ctrl+C)
# 서버 재시작
npm run dev
```

---

## 5️⃣ 프로덕션 배포 설정

### Vercel 배포 시:
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 다음 환경 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD` ← **중요!**

### 기타 플랫폼:
- Netlify, Railway 등에서도 Environment Variables 섹션에 동일하게 추가

---

## ✅ 변경된 파일들

### API 라우트 (서버 사이드):
- ✅ `src/app/api/auth/verify/route.ts` ← **신규 생성: 비밀번호 검증 API**
- ✅ `src/app/api/books/route.ts`
- ✅ `src/app/api/books/[id]/route.ts`
- ✅ `src/app/api/reviews/route.ts`
- ✅ `src/app/api/reviews/[id]/route.ts`
- ✅ `src/app/api/announcements/route.ts`
- ✅ `src/app/api/announcements/[id]/route.ts`
- ✅ `src/app/api/publication-guide/route.ts`
- ✅ `src/app/api/publication-sections/route.ts`
- ✅ `src/app/api/publication-sections/[id]/route.ts`
- ✅ `src/app/api/upload/route.ts`

### Admin 페이지 (클라이언트 사이드):
- ✅ `src/app/books-admin/page.tsx`
- ✅ `src/app/reviews-admin/page.tsx`
- ✅ `src/app/announcements-admin/page.tsx`
- ✅ `src/app/publications-admin/page.tsx`

---

## 🔐 인증 플로우

### 새로운 로그인 프로세스:

1. **사용자가 비밀번호 입력**
2. **클라이언트에서 `/api/auth/verify` 호출**
   ```typescript
   const response = await fetch('/api/auth/verify', {
     method: 'POST',
     body: JSON.stringify({ password }),
   });
   ```
3. **서버에서 환경 변수와 비교**
   ```typescript
   if (password === process.env.ADMIN_PASSWORD) {
     return NextResponse.json({ success: true });
   }
   ```
4. **인증 성공 시 클라이언트 메모리에 비밀번호 저장**
5. **이후 모든 API 요청에 비밀번호 포함**

---

## 🔒 보안 개선 사항

### Before (❌ 보안 취약):
```typescript
const ADMIN_PASSWORD = 'veradi2025'; // 코드에 평문으로 노출
```

### After (✅ 보안 강화):
```typescript
// API 라우트 (서버)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Admin 페이지 (클라이언트)
const [adminPassword, setAdminPassword] = useState(''); // 로그인 후에만 메모리에 저장
```

---

## 📝 추가 개선 사항 (선택)

현재 구현은 기본적인 보안을 제공하지만, 더 나은 보안을 위해서는:

### Option 1: NextAuth.js
```bash
npm install next-auth
```
- 세션 관리
- CSRF 보호
- 다양한 인증 방법 지원

### Option 2: Supabase Auth
```typescript
import { supabase } from '@/lib/supabase';

// Row Level Security 설정
// 관리자 계정 관리
```

### Option 3: JWT 토큰
- 로그인 시 토큰 발급
- httpOnly 쿠키에 저장
- 모든 요청에 토큰 포함

---

## 🧪 테스트

환경 변수 설정 후 테스트:

1. 개발 서버 재시작
2. Admin 페이지 접속 (예: `/books-admin`)
3. `.env.local`에 설정한 비밀번호로 로그인
4. 데이터 생성/수정/삭제 테스트

---

## ❓ 문제 해결

### "Unauthorized" 에러가 발생하는 경우:
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 개발 서버를 재시작했는지 확인
3. 비밀번호에 특수문자가 있다면 URL 인코딩 확인

### 로그인이 안 되는 경우:
1. 브라우저 콘솔에서 네트워크 탭 확인
2. API 응답 상태 코드 확인
3. `.env.local`의 `ADMIN_PASSWORD` 값 확인

---

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. `.env.local` 파일 위치 및 내용
2. 개발 서버 재시작 여부
3. 브라우저 콘솔 에러 메시지

---

**작업 완료일:** 2024년  
**보안 수준:** 기본 → 중간 (환경 변수 사용)  
**다음 단계:** NextAuth.js 또는 Supabase Auth 도입 (선택사항)

