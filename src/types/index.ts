// 공통 타입 정의

export type Book = {
  id: string;
  subject: string;
  image_url: string | null;
  purchase_link: string | null;
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

export type PublicationBook = {
  id: string;
  subject: string;
  image_url: string | null;
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

