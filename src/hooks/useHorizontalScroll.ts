import { useEffect, useRef, useState, useCallback, RefObject } from "react";

interface UseHorizontalScrollOptions {
  scrollAmountRatio?: number;
}

interface UseHorizontalScrollReturn {
  scrollRef: RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scroll: (direction: "left" | "right") => void;
  recheckScroll: () => void;
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
    
    const container = scrollRef.current;
    const scrollLeft = Math.round(container.scrollLeft);
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScrollLeft = scrollWidth - clientWidth;
    
    // tolerance 1px로 감소
    const isAtStart = scrollLeft <= 1;
    const isAtEnd = scrollLeft >= maxScrollLeft - 1;

    const newCanScrollLeft = !isAtStart;
    const newCanScrollRight = !isAtEnd;

    setCanScrollLeft(newCanScrollLeft);
    setCanScrollRight(newCanScrollRight);
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

    // 스크롤 이벤트 (throttle 적용)
    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      // 즉시 체크
      checkScrollPosition();
      
      // 스크롤 끝났을 때도 체크
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        checkScrollPosition();
      }, 150);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    // 휠 이벤트: 세로 스크롤 → 가로 스크롤 변환 (트랙패드 지원)
    const handleWheel = (e: WheelEvent) => {
      // deltaX가 있으면 이미 가로 스크롤 중
      if (Math.abs(e.deltaX) > 0) return;
      
      // deltaY가 있으면 가로로 변환
      if (Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
        checkScrollPosition();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    // 리사이즈 이벤트
    const handleResize = () => {
      checkScrollPosition();
    };
    window.addEventListener("resize", handleResize);

    // 약간의 딜레이 후 다시 체크 (이미지 로딩 등을 위해)
    const timeoutIds = [
      setTimeout(() => checkScrollPosition(), 100),
      setTimeout(() => checkScrollPosition(), 300),
      setTimeout(() => checkScrollPosition(), 500),
      setTimeout(() => checkScrollPosition(), 1000),
      setTimeout(() => checkScrollPosition(), 2000),
    ];

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      timeoutIds.forEach(id => clearTimeout(id));
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [checkScrollPosition]);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount =
      direction === "left"
        ? -scrollRef.current.clientWidth * scrollAmountRatio
        : scrollRef.current.clientWidth * scrollAmountRatio;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    
    // 스크롤 완료 후 상태 업데이트 (여러 번 체크)
    setTimeout(() => checkScrollPosition(), 300);
    setTimeout(() => checkScrollPosition(), 600);
    setTimeout(() => checkScrollPosition(), 1000);
  }, [scrollAmountRatio, checkScrollPosition]);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    recheckScroll: checkScrollPosition,
  };
}
