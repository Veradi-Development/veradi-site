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

  const checkScrollPosition = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener("scroll", checkScrollPosition, { passive: true });

    const handleResize = () => checkScrollPosition();
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

