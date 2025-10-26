import { useEffect, useRef, useState, useCallback, RefObject } from "react";

interface UseHorizontalScrollOptions {
  scrollAmountRatio?: number;
}

interface UseHorizontalScrollReturn {
  scrollRef: RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scroll: (direction: "left" | "right") => void;
}

export function useHorizontalScroll(
  options: UseHorizontalScrollOptions = {}
): UseHorizontalScrollReturn {
  const { scrollAmountRatio = 0.8 } = options;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // 초기 체크
    checkScrollPosition();

    // MutationObserver로 DOM 변경 감지
    const observer = new MutationObserver(() => {
      checkScrollPosition();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    // 스크롤 이벤트
    container.addEventListener("scroll", checkScrollPosition, { passive: true });

    // 리사이즈 이벤트
    const handleResize = () => checkScrollPosition();
    window.addEventListener("resize", handleResize);

    // 약간의 딜레이 후 다시 체크 (이미지 로딩 등을 위해)
    const timeoutIds = [
      setTimeout(() => checkScrollPosition(), 100),
      setTimeout(() => checkScrollPosition(), 300),
      setTimeout(() => checkScrollPosition(), 500),
    ];

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", handleResize);
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [checkScrollPosition]);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount =
      direction === "left"
        ? -scrollRef.current.clientWidth * scrollAmountRatio
        : scrollRef.current.clientWidth * scrollAmountRatio;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }, [scrollAmountRatio]);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scroll,
  };
}

