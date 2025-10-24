# Supabase Storage 정책 설정 방법

## 문제: "new row violates row-level security policy"

이 에러는 Supabase Storage에 파일을 업로드할 권한이 없을 때 발생합니다.

## 해결 방법 (2가지 중 선택)

---

## 방법 1: RLS 비활성화 (간단, 권장)

### 1단계: Supabase 대시보드 접속
1. https://supabase.com 로그인
2. 프로젝트 선택

### 2단계: Storage 설정
1. 왼쪽 메뉴에서 **Storage** 클릭
2. `announcement-files` 버킷 찾기
3. 버킷 이름 옆의 **...** (점 3개) 클릭
4. **Edit bucket** 선택
5. **Public bucket** 체크 ✅
6. **Restrict file upload size** 해제 (또는 원하는 크기 설정)
7. 아래로 스크�롤하여 **"Disable Row Level Security"** 찾기
8. **Disable RLS** 클릭
9. Save 클릭

---

## 방법 2: RLS 정책 추가 (보안 강화)

### Supabase SQL Editor에서 실행:

```sql
-- 1. 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Anyone can view announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete announcement files" ON storage.objects;

-- 2. 새로운 정책 생성
-- 모든 사람이 파일 조회 가능
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'announcement-files');

-- 모든 사람이 파일 업로드 가능 (Public bucket)
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'announcement-files');

-- 모든 사람이 파일 삭제 가능
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'announcement-files');

-- 모든 사람이 파일 수정 가능
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'announcement-files');
```

### 실행 방법:
1. Supabase 대시보드
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. 위의 SQL 코드 전체를 복사해서 붙여넣기
4. **RUN** 버튼 클릭 (또는 Ctrl + Enter)

---

## 방법 3: 완전히 처음부터 (버킷 재생성)

### 1단계: 기존 버킷 삭제
1. Storage 메뉴
2. `announcement-files` 버킷의 ... 클릭
3. Delete bucket

### 2단계: 새 버킷 생성
1. **Create a new bucket** 클릭
2. Name: `announcement-files`
3. ✅ **Public bucket** 체크
4. ❌ **Restrict file upload size** 체크 해제 (또는 50MB로 설정)
5. Create 클릭

### 3단계: RLS 비활성화
1. 새로 만든 버킷의 ... 클릭
2. Edit bucket
3. "Disable Row Level Security" 클릭
4. Save

---

## 확인 방법

설정 후:
1. 관리자 페이지 새로고침
2. 다시 로그인
3. 파일 업로드 시도
4. 성공적으로 업로드되어야 함

## 추천 방법

**개발 단계**: 방법 1 (RLS 비활성화) - 가장 간단
**프로덕션**: 방법 2 (RLS 정책) - 더 안전

---

## 여전히 안되는 경우

### 체크리스트:
- [ ] `announcement-files` 버킷이 존재하는가?
- [ ] 버킷이 **Public**으로 설정되어 있는가?
- [ ] RLS가 비활성화되어 있는가? (또는 정책이 추가되었는가?)
- [ ] `.env.local` 파일의 Supabase URL과 Key가 올바른가?
- [ ] 개발 서버를 재시작했는가?
- [ ] 브라우저를 새로고침했는가?

### 브라우저 콘솔 확인:
F12 → Console 탭에서 정확한 에러 메시지 확인

