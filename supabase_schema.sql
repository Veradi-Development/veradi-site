-- 공지사항 테이블 생성
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 업데이트 시간 자동 갱신을 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 공지사항을 조회할 수 있도록 정책 생성
CREATE POLICY "Anyone can view announcements"
  ON announcements
  FOR SELECT
  TO public
  USING (true);

-- 인증된 사용자만 공지사항을 생성/수정/삭제할 수 있도록 정책 생성
-- (실제로는 관리자 페이지에서 비밀번호로 보호)
CREATE POLICY "Authenticated users can insert announcements"
  ON announcements
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update announcements"
  ON announcements
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Authenticated users can delete announcements"
  ON announcements
  FOR DELETE
  TO public
  USING (true);

