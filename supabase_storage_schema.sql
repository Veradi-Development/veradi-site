-- Storage 버킷 생성 (Supabase Dashboard의 Storage 섹션에서 수동으로 생성)
-- 버킷 이름: announcement-files
-- Public 설정: true (공개 파일)

-- 또는 SQL로 생성:
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

-- announcements 테이블에 첨부파일 컬럼 추가
ALTER TABLE announcements
ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;

-- 기존 데이터에 빈 배열 설정
UPDATE announcements SET attachments = '[]'::jsonb WHERE attachments IS NULL;

