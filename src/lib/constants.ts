// 공통 애니메이션 및 스타일 상수

// GPU 가속을 위한 최적화된 스타일
export const optimizedStyle = {
  willChange: 'transform' as const,
  backfaceVisibility: 'hidden' as const,
  transform: 'translateZ(0)'
};

// 수평 스크롤 비율
export const SCROLL_AMOUNT_RATIO = 0.8;

// 카드 호버 스케일
export const CARD_HOVER_SCALE = 1.03;

// 블러 placeholder (1px 투명 이미지)
export const BLUR_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

// 애니메이션 variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};


