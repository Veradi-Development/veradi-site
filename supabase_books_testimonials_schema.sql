-- 교재 테이블 (GridSeries, Subjects, Publications 통합)
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'grid', 'subject', 또는 'publication'
  category TEXT, -- Publications용: 'grid_concept', 'grid_sol', 'grid_n', 'math_mock', 'science_mock'
  series TEXT, -- Publications용 시리즈명 (예: 'GRID 개념편')
  main_image_url TEXT, -- GRID용 문제집 이미지
  sub_image_url TEXT, -- GRID용 해설집 이미지
  front_image_url TEXT, -- Subjects/Publications용 앞표지 이미지
  purchase_link TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 후기 테이블
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  school TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 교재 헤더 텍스트 테이블 (GRID 섹션 상단 문구)
CREATE TABLE IF NOT EXISTS book_section_headers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type TEXT UNIQUE NOT NULL, -- 'grid' 또는 'subjects'
  title TEXT NOT NULL,
  subtitle TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 초기 헤더 데이터 삽입
INSERT INTO book_section_headers (section_type, title, subtitle) VALUES
  ('grid', 'GRID', ':1%의 로직 - 실전 문제 풀이의 절대 기준선'),
  ('subjects', 'VERADI Subjects & Series', '')
ON CONFLICT (section_type) DO NOTHING;

-- Publications 가이드 섹션 테이블
CREATE TABLE IF NOT EXISTS publication_guide (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  main_title TEXT NOT NULL, -- '완벽활용가이드'
  hero_title TEXT NOT NULL, -- 'VERADI 교재, 제대로 활용하기'
  video_url TEXT, -- 동영상 링크
  hero_image_url TEXT, -- 히어로 이미지 URL
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 초기 가이드 섹션 데이터 삽입
INSERT INTO publication_guide (main_title, hero_title, video_url, hero_image_url) VALUES
  ('완벽활용가이드', 'VERADI 교재,<br />제대로 활용하기', 'https://youtu.be/your-video-link', null)
ON CONFLICT DO NOTHING;

-- Publications 섹션 설정 테이블
CREATE TABLE IF NOT EXISTS publication_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT UNIQUE NOT NULL, -- 'grid_concept', 'grid_sol', 'grid_n', 'math_mock', 'science_mock'
  title TEXT NOT NULL, -- 섹션 제목 (예: 'GRID 개념편')
  guide_url TEXT, -- '더 알아보기' 링크
  use_subjects_background BOOLEAN DEFAULT false, -- 배경 스타일
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 초기 섹션 데이터 삽입
INSERT INTO publication_sections (category, title, guide_url, use_subjects_background, display_order) VALUES
  ('grid_concept', 'GRID 개념편', 'https://youtu.be/your-video-link', false, 1),
  ('grid_sol', 'GRID 필수기출편', 'https://youtu.be/your-video-link', false, 2),
  ('grid_n', 'GRID N제', 'https://youtu.be/your-video-link', false, 3),
  ('math_mock', '수학 모의고사', 'https://youtu.be/your-video-link', true, 4),
  ('science_mock', '과학탐구 모의고사', 'https://youtu.be/your-video-link', true, 5)
ON CONFLICT (category) DO NOTHING;

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 설정
DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_book_section_headers_updated_at ON book_section_headers;
CREATE TRIGGER update_book_section_headers_updated_at
  BEFORE UPDATE ON book_section_headers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_publication_guide_updated_at ON publication_guide;
CREATE TRIGGER update_publication_guide_updated_at
  BEFORE UPDATE ON publication_guide
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_publication_sections_updated_at ON publication_sections;
CREATE TRIGGER update_publication_sections_updated_at
  BEFORE UPDATE ON publication_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 설정
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_section_headers ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_guide ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_sections ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있으면)
DROP POLICY IF EXISTS "Anyone can read books" ON books;
DROP POLICY IF EXISTS "Anyone can read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Anyone can read book_section_headers" ON book_section_headers;
DROP POLICY IF EXISTS "Anyone can read publication_guide" ON publication_guide;
DROP POLICY IF EXISTS "Anyone can read publication_sections" ON publication_sections;
DROP POLICY IF EXISTS "Authenticated users can insert books" ON books;
DROP POLICY IF EXISTS "Authenticated users can update books" ON books;
DROP POLICY IF EXISTS "Authenticated users can delete books" ON books;
DROP POLICY IF EXISTS "Authenticated users can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can update book_section_headers" ON book_section_headers;
DROP POLICY IF EXISTS "Authenticated users can update publication_guide" ON publication_guide;
DROP POLICY IF EXISTS "Authenticated users can insert publication_sections" ON publication_sections;
DROP POLICY IF EXISTS "Authenticated users can update publication_sections" ON publication_sections;
DROP POLICY IF EXISTS "Authenticated users can delete publication_sections" ON publication_sections;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read books" ON books
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read testimonials" ON testimonials
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read book_section_headers" ON book_section_headers
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read publication_guide" ON publication_guide
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read publication_sections" ON publication_sections
  FOR SELECT USING (true);

-- 인증된 사용자만 쓰기 가능 (나중에 더 엄격하게 설정 가능)
CREATE POLICY "Authenticated users can insert books" ON books
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update books" ON books
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete books" ON books
  FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert testimonials" ON testimonials
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials" ON testimonials
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete testimonials" ON testimonials
  FOR DELETE USING (true);

CREATE POLICY "Authenticated users can update book_section_headers" ON book_section_headers
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can update publication_guide" ON publication_guide
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can insert publication_sections" ON publication_sections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update publication_sections" ON publication_sections
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete publication_sections" ON publication_sections
  FOR DELETE USING (true);

-- 기존 books 테이블에 새 컬럼 추가
ALTER TABLE books 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS series TEXT;

