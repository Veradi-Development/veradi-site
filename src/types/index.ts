// 공통 타입 정의

export type Book = {
  id: string;
  title: string;
  subject: string;
  description: string | null;
  type: 'grid' | 'grid2' | 'subject' | 'publication';
  category: string | null;
  series: string | null;
  main_image_url: string | null;
  sub_image_url: string | null;
  front_image_url: string | null;
  purchase_link: string | null;
  price: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  name: string;
  school: string;
  content: string;
  rating: number;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  category?: string | null;
  display_order?: number | null;
  attachments: AttachmentFile[];
  created_at: string;
  updated_at: string;
};

export type AttachmentFile = {
  name: string;
  url: string;
  size: number;
  type: string;
};

export type PublicationGuide = {
  id: string;
  main_title: string;
  hero_title: string;
  video_url: string | null;
  hero_image_url: string | null;
};

export type PublicationSection = {
  id: string;
  category: string;
  title: string;
  guide_url: string | null;
  use_subjects_background: boolean;
  display_order: number;
};

export type PublicationBook = {
  id: string;
  title: string;
  subject: string;
  category: string | null;
  main_image_url: string | null;
  sub_image_url: string | null;
  purchase_link: string | null;
  display_order: number;
};

// API 응답 타입
export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

// Admin 페이지 공통 타입
export type AdminFormData = Record<string, unknown>;

