# 공지사항 시스템 설치 가이드 (파일 첨부 기능 포함)

## 📦 설치

### 1. Supabase 패키지 설치

이미 설치되어 있습니다:
```bash
npm install @supabase/supabase-js
```

## 🔧 Supabase 설정

### 1. Supabase Storage 버킷 생성

**방법 1: Supabase 대시보드에서 수동 생성 (권장)**

1. Supabase 대시보드 접속
2. 왼쪽 메뉴에서 **Storage** 클릭
3. **Create a new bucket** 클릭
4. 버킷 이름: `announcement-files`
5. **Public bucket** 체크 ✅
6. **Create bucket** 클릭

**방법 2: SQL Editor에서 실행**

```sql
-- Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('announcement-files', 'announcement-files', true);

-- Storage 정책 설정
CREATE POLICY "Anyone can view announcement files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'announcement-files');

CREATE POLICY "Authenticated users can upload announcement files"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'announcement-files');

CREATE POLICY "Authenticated users can delete announcement files"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'announcement-files');
```

### 2. 데이터베이스 테이블 업데이트

Supabase SQL Editor에서 `supabase_storage_schema.sql` 파일의 내용을 실행:

```sql
-- announcements 테이블에 첨부파일 컬럼 추가
ALTER TABLE announcements
ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;

-- 기존 데이터에 빈 배열 설정
UPDATE announcements SET attachments = '[]'::jsonb WHERE attachments IS NULL;
```

## 🚀 사용 방법

### 관리자 페이지에서 파일 업로드

1. `/admin/announcements` 접속 후 로그인
2. **새 공지사항** 버튼 클릭
3. 제목과 내용 입력
4. **첨부파일** 섹션에서 파일 선택 (다중 선택 가능)
5. 업로드된 파일 확인 (이미지는 🖼️, 일반 파일은 📄 아이콘)
6. 필요시 개별 파일 삭제 가능
7. **등록하기** 버튼 클릭

### 사용자 페이지에서 파일 보기

- `/notice` 목록에서 공지사항 클릭
- 상세 페이지 하단에 **첨부파일** 섹션 표시
- **이미지**: 페이지에 직접 표시
- **일반 파일**: 다운로드 버튼으로 다운로드

## 📁 지원 파일 형식

- **이미지**: jpg, jpeg, png, gif, webp 등
- **문서**: pdf, doc, docx, xls, xlsx, ppt, pptx 등
- **압축 파일**: zip, rar 등
- **기타**: 모든 파일 형식 지원

## 🎨 기능

### 파일 업로드
- ✅ 다중 파일 업로드
- ✅ 파일 크기 표시
- ✅ 파일 타입별 아이콘
- ✅ 업로드 진행 상태 표시
- ✅ 개별 파일 삭제

### 파일 표시
- ✅ 이미지 자동 표시
- ✅ 일반 파일 다운로드
- ✅ 파일 정보 표시 (이름, 크기)
- ✅ 반응형 디자인

## 🔒 보안

- 파일 업로드는 관리자 비밀번호로 보호
- Supabase Storage RLS 정책 적용
- 파일 이름에 타임스탬프 추가하여 중복 방지
- 공개 버킷 사용으로 사용자 접근 가능

## 💡 파일 크기 제한

기본적으로 Supabase는 다음 제한이 있습니다:
- **Free tier**: 50MB per file
- **Pro tier**: 5GB per file

필요시 Supabase 대시보드에서 제한 조정 가능합니다.

## 🐛 문제 해결

### 파일 업로드 실패

1. Storage 버킷이 생성되었는지 확인
2. 버킷 이름이 `announcement-files`인지 확인
3. Public bucket으로 설정되었는지 확인
4. RLS 정책이 올바르게 설정되었는지 확인

### 이미지가 표시되지 않음

1. Supabase Storage에서 파일이 업로드되었는지 확인
2. 브라우저 콘솔에서 에러 확인
3. Public URL이 올바른지 확인

## 📊 데이터 구조

### attachments 컬럼 (JSONB)

```json
[
  {
    "name": "image.jpg",
    "url": "https://xxx.supabase.co/storage/v1/object/public/announcement-files/xxx-image.jpg",
    "size": 102400,
    "type": "image/jpeg"
  },
  {
    "name": "document.pdf",
    "url": "https://xxx.supabase.co/storage/v1/object/public/announcement-files/xxx-document.pdf",
    "size": 204800,
    "type": "application/pdf"
  }
]
```

## 🔄 업그레이드 노트

기존 공지사항 시스템에서 업그레이드한 경우:
- 기존 공지사항의 `attachments`는 빈 배열로 초기화됩니다
- 새로 작성하는 공지사항부터 파일 첨부가 가능합니다
- 기존 공지사항도 수정하여 파일을 추가할 수 있습니다

