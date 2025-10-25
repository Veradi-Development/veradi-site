import { createClient } from '@supabase/supabase-js';

// 빌드 타임에는 더미 값 사용, 런타임에 실제 값 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AttachmentFile = {
  name: string;
  url: string;
  size: number;
  type: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  attachments: AttachmentFile[];
  created_at: string;
  updated_at: string;
};

