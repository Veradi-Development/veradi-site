import { useEffect, useState } from "react";

export function useMobileDetect(breakpoint: number = 768): boolean {
  // 서버와 클라이언트 초기값을 일치시키기 위해 false로 시작 (데스크탑으로 가정)
  // 하이드레이션이 완료된 후에만 실제 값을 사용
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let rafId2: number | null = null;
    let rafId3: number | null = null;
    let timer: NodeJS.Timeout | null = null;
    let checkMobile: (() => void) | null = null;
    
    // 하이드레이션 완료를 확인하기 위해 세 프레임 대기
    // 첫 번째 프레임: 하이드레이션 시작
    // 두 번째 프레임: 하이드레이션 진행 중
    // 세 번째 프레임: 하이드레이션 완료 확인
    const rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        rafId3 = requestAnimationFrame(() => {
          setIsMounted(true);
          
          checkMobile = () => {
            if (typeof window !== 'undefined') {
              setIsMobile(window.innerWidth < breakpoint);
            }
          };

          // 하이드레이션 완료 후 충분한 지연 시간을 두고 실행
          // 모바일에서 하이드레이션이 완전히 완료될 때까지 기다림
          // 여러 프레임을 거쳐 하이드레이션이 완전히 완료된 후에만 값 변경
          timer = setTimeout(() => {
            if (checkMobile) {
              // 추가로 한 프레임 더 대기하여 하이드레이션 완료 보장
              requestAnimationFrame(() => {
                if (checkMobile) checkMobile();
              });
            }
          }, 100); // 100ms 지연 + requestAnimationFrame으로 하이드레이션 완료 보장

          if (typeof window !== 'undefined' && checkMobile) {
            window.addEventListener("resize", checkMobile);
          }
        });
      });
    });

    return () => {
      if (rafId1) cancelAnimationFrame(rafId1);
      if (rafId2 !== null) cancelAnimationFrame(rafId2);
      if (rafId3 !== null) cancelAnimationFrame(rafId3);
      if (timer) clearTimeout(timer);
      if (checkMobile && typeof window !== 'undefined') {
        window.removeEventListener("resize", checkMobile);
      }
    };
  }, [breakpoint]);

  // 하이드레이션이 완료되지 않았으면 항상 false 반환 (서버 렌더링과 일치)
  // 이렇게 하면 서버와 클라이언트 초기 렌더링이 항상 일치함
  // isMobile이 변경되어도 하이드레이션이 완료된 후이므로 문제없음
  if (!isMounted) {
    return false;
  }
  
  return isMobile;
}

