import { createClient } from '@supabase/supabase-js';
import type { AttachmentFile, Announcement } from '@/types';

// 빌드 타임에는 더미 값 사용, 런타임에 실제 값 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// 클라이언트 사이드용 (anon key 사용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버 사이드용 (service role key 사용 - RLS 우회)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Re-export types for backward compatibility
export type { AttachmentFile, Announcement };

