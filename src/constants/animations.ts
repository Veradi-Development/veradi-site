// 애니메이션 설정 상수
export const ANIMATION_DURATIONS = {
  TITLE: 0.6,
  CONTAINER: 0.8,
  CARD: 0.6,
  CARD_FAST: 0.5,
} as const;

export const ANIMATION_DELAYS = {
  CARD: 0.1,
  CARD_FAST: 0.08,
  CARD_FASTER: 0.05,
} as const;

export const ANIMATION_EASING = {
  EASE_OUT: "easeOut",
  EASE_IN_OUT: "easeInOut",
} as const;

// 카드 hover 설정
export const CARD_HOVER_SCALES = {
  SMALL: 1.03,
  MEDIUM: 1.04,
  LARGE: 1.05,
} as const;

// viewport 설정
export const VIEWPORT_CONFIG = {
  once: true,
  amount: 0.2,
  margin: "-50px",
} as const;

export const VIEWPORT_CONFIG_TITLE = {
  once: true,
  amount: 0.2,
  margin: "-100px",
} as const;

