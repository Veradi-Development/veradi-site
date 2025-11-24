"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* -----------------------------------------
   * 초기 화면: 가운데 "수정중" 텍스트
   * --------------------------------------- */
  const initialTextOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  /* -----------------------------------------
   * 1단계: 첫 화면 - 좌우 하단 텍스트 (아래 → 중앙 → 위로 사라짐)
   * --------------------------------------- */
  const firstOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [0, 1, 0]);
  const firstY = useTransform(scrollYProgress, [0, 0.1, 0.2], ["20vh", "0vh", "-20vh"]);

  /* -----------------------------------------
   * 2단계: VERADI MAKERS (정중앙 → 왼쪽 하단 고정)
   * --------------------------------------- */
  /* ----- 2단계: VERADI MAKERS (중앙 → 왼쪽 하단 부드럽게 이동) ----- */

  /* 2단계 중앙 → 왼쪽 하단 (이동과 축소를 같은 타이밍에서!) */

// opacity
const secondOpacity = useTransform(
  scrollYProgress,
  [0.15, 0.25, 0.55, 0.65],
  [0, 1, 1, 0]
);

// 중앙 → 왼쪽 아래로 이동하는 x (순수 숫자 단위로)
const secondX = useTransform(scrollYProgress, [0.25, 0.55], [0, -450]);
const secondY = useTransform(scrollYProgress, [0.25, 0.55], [0, 300]);


// scale도 숫자
const secondScale = useTransform(
  scrollYProgress,
  [0.15, 0.25, 0.55],
  [0.5, 1, 0.55]
);




  /* -----------------------------------------
   * 3단계: 오른쪽 하단 글자
   * --------------------------------------- */
  const thirdOpacity = useTransform(scrollYProgress, [0.40, 0.50, 0.60], [0, 1, 1]);

  /* -----------------------------------------
   * 4단계: 오른쪽 글자 교체
   * --------------------------------------- */
  const fourthOpacity = useTransform(scrollYProgress, [0.60, 0.70, 0.75], [0, 1, 0]);

  /* -----------------------------------------
   * 5단계: 마지막 중앙 문장
   * --------------------------------------- */
  const lastOpacity = useTransform(scrollYProgress, [0.75, 0.90, 1.0], [0, 1, 1]);
  const lastScale = useTransform(scrollYProgress, [0.75, 0.90], [0.5, 1]);

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full">

      {/* 배경 */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/background.jpg')` }}
      />

      {/* 초기 화면: 가운데 "수정중" 텍스트 */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-10"
        style={{ opacity: initialTextOpacity }}
      >
        <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-xl">
          수정중
        </p>
      </motion.div>

      {/* ----------------------------------- */}
      {/* 1단계: 좌 / 우 텍스트 */}
      {/* ----------------------------------- */}
      <motion.div
        className="fixed bottom-10 left-10 text-left z-10"
        style={{ opacity: firstOpacity, y: firstY }}
      >
        <p 
          className="text-6xl font-extrabold drop-shadow-xl bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(to right, #41566f 0%, #383878 25%, #6a4b87 50%, #7a2e62 75%, #99798f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          진실(VERA)을
        </p>
        <p 
          className="text-6xl font-extrabold drop-shadow-xl bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(to right, #41566f 0%, #383878 25%, #6a4b87 50%, #7a2e62 75%, #99798f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          말하다(DI)
        </p>
      </motion.div>

      <motion.div
        className="fixed bottom-10 right-10 text-right z-10"
        style={{ opacity: firstOpacity, y: firstY }}
      >
        <p 
          className="text-6xl font-extrabold drop-shadow-xl bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(to right, #99798f 0%, #7a2e62 25%, #6a4b87 50%, #383878 75%, #41566f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          만드는 곳
        </p>
        <p 
          className="text-6xl font-extrabold drop-shadow-xl bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(to right, #99798f 0%, #7a2e62 25%, #6a4b87 50%, #383878 75%, #41566f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          진실된 콘텐츠를
        </p>
      </motion.div>

      {/* ----------------------------------- */}
      {/* 2단계: VERADI MAKERS */}
      {/* ----------------------------------- */}
      <motion.div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"

        style={{
          left: "50%",
          top: "50%",
          x: secondX,
          y: secondY,
          opacity: secondOpacity,
          scale: secondScale,
        }}
      >
        <div className="text-left drop-shadow-xl">
          <h1 
            className="font-extrabold leading-none bg-clip-text text-transparent"
            style={{
              fontSize: '10vw',
              backgroundImage: 'linear-gradient(to right, #41566f 0%, #383878 25%, #6a4b87 50%, #7a2e62 75%, #99798f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            VERADI
          </h1>
          <h2 
            className="font-extrabold leading-none mt-2 bg-clip-text text-transparent"
            style={{
              fontSize: '10vw',
              backgroundImage: 'linear-gradient(to right, #99798f 0%, #7a2e62 25%, #6a4b87 50%, #383878 75%, #41566f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            MAKERS
          </h2>
        </div>
      </motion.div>

      {/* ----------------------------------- */}
      {/* 3단계: 오른쪽 하단 리스트 */}
      {/* ----------------------------------- */}
      <motion.div
        className="fixed right-10 bottom-10 text-right z-10"
        style={{ opacity: thirdOpacity }}
      >
        <div className="flex flex-col text-white drop-shadow-xl">
          <p>Mathematics</p>
          <p>Physics</p>
          <p>Chemistry</p>
          <p>Biology</p>
          <p>Earth science</p>
        </div>
      </motion.div>

      {/* ----------------------------------- */}
      {/* 4단계: 오른쪽 텍스트 교체 */}
      {/* ----------------------------------- */}
      <motion.div
        className="fixed right-10 bottom-10 text-right z-10"
        style={{ opacity: fourthOpacity }}
      >
        <p 
          className="text-6xl font-extrabold drop-shadow-xl bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(to right, #99798f 0%, #7a2e62 25%, #6a4b87 50%, #383878 75%, #41566f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          1% 로직을
        </p>
        <p 
          className="text-6xl font-extrabold drop-shadow-xl bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(to right, #99798f 0%, #7a2e62 25%, #6a4b87 50%, #383878 75%, #41566f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          당신의 것으로
        </p>
      </motion.div>

      {/* ----------------------------------- */}
      {/* 5단계: 최종 문장 */}
      {/* ----------------------------------- */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-20"
        style={{ opacity: lastOpacity, scale: lastScale }}
      >
        <div className="text-center drop-shadow-xl">
          <p 
            className="text-7xl font-extrabold bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(to right, #41566f 0%, #383878 25%, #6a4b87 50%, #7a2e62 75%, #99798f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            VERADI와
          </p>
          <p 
            className="text-7xl font-extrabold mt-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(to right, #99798f 0%, #7a2e62 25%, #6a4b87 50%, #383878 75%, #41566f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            함께하세요
          </p>
        </div>
      </motion.div>
    </div>
  );
}
