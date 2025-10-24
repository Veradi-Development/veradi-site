# 공지사항 시스템 문제 해결 가이드

## 파일 업로드가 안되는 경우

### 1. Supabase Storage 버킷 확인

**확인 사항:**
1. Supabase 대시보드 → **Storage** 메뉴
2. `announcement-files` 버킷이 있는지 확인
3. 버킷이 **Public**으로 설정되어 있는지 확인

**버킷이 없다면:**
```sql
-- SQL Editor에서 실행
INSERT INTO storage.buckets (id, name, public)
VALUES ('announcement-files', 'announcement-files', true);
```

또는 대시보드에서:
1. Storage → Create a new bucket
2. Name: `announcement-files`
3. ✅ Public bucket 체크
4. Create

### 2. Storage 정책 확인

Supabase SQL Editor에서 실행:
```sql
-- 조회 정책
CREATE POLICY "Anyone can view announcement files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'announcement-files');

-- 업로드 정책
CREATE POLICY "Authenticated users can upload announcement files"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'announcement-files');

-- 삭제 정책
CREATE POLICY "Authenticated users can delete announcement files"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'announcement-files');
```

### 3. 환경 변수 확인

`.env.local` 파일 확인:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password
```

**확인 방법:**
1. 환경 변수가 올바르게 설정되었는지 확인
2. 개발 서버를 재시작했는지 확인

### 4. 브라우저 콘솔 확인

F12를 눌러 개발자 도구를 열고:
1. **Console** 탭에서 에러 메시지 확인
2. **Network** 탭에서 `/api/upload` 요청 확인
   - Status Code 확인
   - Response 내용 확인

### 5. 일반적인 에러와 해결 방법

#### "Unauthorized" 에러
- 관리자 비밀번호가 올바른지 확인
- `.env.local`의 `ADMIN_PASSWORD` 확인
- 서버 재시작

#### "Bucket not found" 에러
- Storage 버킷이 생성되지 않음
- 위의 1번 단계 참고

#### "Policy violation" 에러
- Storage 정책이 설정되지 않음
- 위의 2번 단계 참고

#### "Network error" 또는 CORS 에러
- Supabase URL이 올바른지 확인
- 인터넷 연결 확인

### 6. 파일 크기 제한

Supabase Free tier:
- 최대 파일 크기: **50MB**
- 스토리지 용량: **1GB**

큰 파일을 업로드하려면:
- 파일 크기를 줄이거나
- Supabase Pro tier로 업그레이드

### 7. 서버 로그 확인

개발 서버 터미널에서 에러 로그 확인:
```
npm run dev
```

업로드 시도 시 콘솔에 다음과 같은 로그가 보여야 함:
- "파일 업로드 시도: [파일명]"
- "서버 응답: [응답 데이터]"

## 이미지가 본문에 표시되지 않는 경우

### 1. 리치 텍스트 에디터 확인
- 에디터 툴바의 이미지 아이콘 클릭
- 파일 선택 후 자동 업로드 확인
- 콘솔에 에러 메시지 확인

### 2. 상세 페이지 HTML 렌더링
- 브라우저 개발자 도구 → Elements 탭
- 이미지 태그(`<img>`)가 있는지 확인
- 이미지 URL이 올바른지 확인

## 데이터베이스 문제

### attachments 컬럼이 없는 경우

```sql
-- 컬럼 추가
ALTER TABLE announcements
ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;

-- 기존 데이터 업데이트
UPDATE announcements 
SET attachments = '[]'::jsonb 
WHERE attachments IS NULL;
```

## 추가 도움이 필요한 경우

1. 브라우저 콘솔의 에러 메시지 전체 복사
2. 서버 터미널의 에러 로그 복사
3. Network 탭에서 `/api/upload` 요청의 Response 내용 확인

