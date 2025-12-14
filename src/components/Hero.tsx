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
   * 모든 단계를 동일한 길이로 설정 (각 단계당 약 11.11%)
   * --------------------------------------- */
  
  /* -----------------------------------------
   * 1단계: 초기 화면: 좌 / 우 하단 텍스트
   * --------------------------------------- */
  const initialTextOpacity = useTransform(scrollYProgress, [0, 0.015, 0.095, 0.11], [1, 1, 1, 0]);
  const initialTextY = useTransform(scrollYProgress, [0, 0.11], [0, "-20vh"]);

  /* -----------------------------------------
   * 2단계: VERADI MAKERS (정중앙에 등장)
   * --------------------------------------- */
  const secondOpacity = useTransform(
    scrollYProgress,
    [0.11, 0.125, 0.205, 0.22],
    [0, 1, 1, 0]
  );

  const secondScale = useTransform(
    scrollYProgress,
    [0.11, 0.125, 0.205],
    [1, 1.2, 1.2]
  );

  /* -----------------------------------------
   * 3단계: 오른쪽 하단 글자
   * --------------------------------------- */
  const thirdOpacity = useTransform(scrollYProgress, [0.22, 0.235, 0.315, 0.33], [0, 1, 1, 0]);

  /* -----------------------------------------
   * 3-8단계: 왼쪽 하단 VERADI MAKERS (세 번째에서 나타나 여덟 번째까지 유지)
   * --------------------------------------- */
  const veradiMakersOpacity = useTransform(scrollYProgress, [0.22, 0.235, 0.865, 0.88], [0, 1, 1, 0]);

  /* -----------------------------------------
   * 4단계: 팀 소개 (Mathematics)
   * --------------------------------------- */
  const fourthOpacity = useTransform(scrollYProgress, [0.33, 0.345, 0.425, 0.44], [0, 1, 1, 0]);

  /* -----------------------------------------
   * 5단계: Physics 팀 소개
   * --------------------------------------- */
  const fifthOpacity = useTransform(scrollYProgress, [0.44, 0.455, 0.535, 0.55], [0, 1, 1, 0]);

  /* -----------------------------------------
   * 6단계: Chemistry 팀 소개
   * --------------------------------------- */
  const sixthOpacity = useTransform(scrollYProgress, [0.55, 0.565, 0.645, 0.66], [0, 1, 1, 0]);

  /* -----------------------------------------
   * 7단계: Biology 팀 소개
   * --------------------------------------- */
  const seventhOpacity = useTransform(scrollYProgress, [0.66, 0.675, 0.755, 0.77], [0, 1, 1, 0]);

  /* -----------------------------------------
   * 8단계: Earth science 팀 소개
   * --------------------------------------- */
  const eighthOpacity = useTransform(scrollYProgress, [0.77, 0.785, 0.865, 0.88], [0, 1, 1, 0]);

  /* -----------------------------------------
   * 9단계: WHO'S NEXT (가운데)
   * --------------------------------------- */
  const ninthOpacity = useTransform(scrollYProgress, [0.88, 0.895, 0.975, 0.99], [0, 1, 1, 0]);
  const ninthScale = useTransform(scrollYProgress, [0.88, 0.895, 0.975], [0.8, 1, 1]);

  return (
    <div ref={containerRef} className="relative h-[800vh] w-full" style={{ position: 'relative' }}>

      {/* 배경 */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/background.jpg')` }}
      />

      {/* 초기 화면: 좌 / 우 텍스트 */}
      <motion.div
        className="fixed bottom-4 left-4 lg:left-10 text-left z-10"
        style={{ opacity: initialTextOpacity, y: initialTextY }}
      >
        <p
          className="text-3xl md:text-5xl lg:text-7xl font-extrabold drop-shadow-xl bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #41566f 0%, #383878 25%, #6a4b87 50%, #7a2e62 75%, #99798f 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          진실(VERA)을
        </p>
        <p
          className="text-3xl md:text-5xl lg:text-7xl font-extrabold drop-shadow-xl bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #41566f 0%, #383878 25%, #6a4b87 50%, #7a2e62 75%, #99798f 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          말하다
        </p>
      </motion.div>

      <motion.div
        className="fixed bottom-4 right-4 lg:right-10 text-right z-10"
        style={{ opacity: initialTextOpacity, y: initialTextY }}
      >
        <p
          className="text-3xl md:text-5xl lg:text-7xl font-extrabold drop-shadow-xl bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #99798f 0%, #7a2e62 25%, #6a4b87 50%, #383878 75%, #41566f 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          만드는 곳
        </p>
        <p
          className="text-3xl md:text-5xl lg:text-7xl font-extrabold drop-shadow-xl bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #99798f 0%, #7a2e62 25%, #6a4b87 50%, #383878 75%, #41566f 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
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
          opacity: secondOpacity,
          scale: secondScale,
        }}
      >
        <div className="text-center drop-shadow-xl">
          <h1 
            className="font-extrabold leading-none bg-clip-text text-transparent text-5xl sm:text-6xl md:text-8xl lg:text-[10vw]"
            style={{
              backgroundImage: 'linear-gradient(to right, #41566f 0%, #383878 25%, #6a4b87 50%, #7a2e62 75%, #99798f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            VERADI
          </h1>
          <h2 
            className="font-extrabold leading-none mt-2 bg-clip-text text-transparent text-5xl sm:text-6xl md:text-8xl lg:text-[10vw]"
            style={{
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
        className="fixed left-10 bottom-4 text-center z-10 hidden sm:block"
        style={{ opacity: veradiMakersOpacity }}
      >
        <div className="drop-shadow-xl">
          <p
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, #41566f 0%, #383878 25%, #6a4b87 50%, #7a2e62 75%, #99798f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            VERADI
          </p>
          <p
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, #99798f 0%, #7a2e62 25%, #6a4b87 50%, #383878 75%, #41566f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MAKERS
          </p>
        </div>
      </motion.div>

      <motion.div
        className="fixed right-10 bottom-4 text-right z-10"
        style={{ opacity: thirdOpacity }}
      >
        <div className="flex flex-col text-black drop-shadow-xl gap-2">
          <p className="text-[1.5rem] sm:text-2xl md:text-4xl font-light">Mathematics</p>
          <p className="text-[1.5rem] sm:text-2xl md:text-4xl font-light">Physics</p>
          <p className="text-[1.5rem] sm:text-2xl md:text-4xl font-light">Chemistry</p>
          <p className="text-[1.5rem] sm:text-2xl md:text-4xl font-light">Biology</p>
          <p className="text-[1.5rem] sm:text-2xl md:text-4xl font-light">Earth science</p>
        </div>
      </motion.div>

      {/* ----------------------------------- */}
      {/* 4단계: 팀 소개 */}
      {/* ----------------------------------- */}
      <motion.div
        className="fixed right-10 bottom-4 text-right z-10"
        style={{ opacity: fourthOpacity }}
      >
        <div className="flex flex-col text-black drop-shadow-xl gap-2">
          <p className="text-lg sm:text-2xl md:text-4xl font-light mb-6">Mathematics</p>
          <div className="grid grid-cols-[auto_auto_auto] gap-x-1 sm:gap-x-2 md:gap-x-3 gap-y-0 justify-end">
            <span className="font-light text-xs sm:text-sm md:text-xl">팀장 양상호</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">성균관대학교 수학교육과 졸업</span>

            <span className="font-light text-xs sm:text-sm md:text-xl">지정희</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">이화여자대학교 수학과 졸업</span>

            <span className="font-light text-xs sm:text-sm md:text-xl">이상윤</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">경희대학교 의예과</span>
          </div>
        </div>
      </motion.div>

      {/* ----------------------------------- */}
      {/* 5단계: Physics 팀 소개 */}
      {/* ----------------------------------- */}
      <motion.div
        className="fixed right-10 bottom-4 text-right z-10"
        style={{ opacity: fifthOpacity }}
      >
        <div className="flex flex-col text-black drop-shadow-xl gap-2">
          <p className="text-xl sm:text-2xl md:text-4xl font-light mb-6">Physics</p>
          <div className="grid grid-cols-[auto_auto_auto] gap-x-1 sm:gap-x-2 md:gap-x-3 gap-y-0 justify-end">
            <span className="font-light text-sm sm:text-sm md:text-xl">팀장 윤장호</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">성균관대 전자전기공학부</span>

            <span className="font-light text-xs sm:text-sm md:text-xl">박현호</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">연세대학교 물리학과</span>

            <span className="font-light text-xs sm:text-sm md:text-xl">고성현</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">홍익대학교 전자전기공학부</span>

            <span className="font-light text-xs sm:text-sm md:text-xl">유성재</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">성균관대학교 소프트웨어학과</span>

            <span className="font-light text-xs sm:text-sm md:text-xl">김동진</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">세명대학교 한의학과</span>

            <span className="font-light text-xs sm:text-sm md:text-xl">백하욱</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">연세대학교 의예과</span>

            <span className="font-light text-xs sm:text-sm md:text-xl">엄기원</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">중앙대학교 에너지시스템공학과</span>

            <span className="font-light text-xs sm:text-sm md:text-xl">이승원</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">부산대학교 의예과</span>

            <span className="font-light text-xs sm:text-sm md:text-xl">노시형</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">세명대학교 한의학과</span>

            <span className="font-light text-xs sm:text-sm md:text-xl">한두현</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">한양대학교 에너지공학과</span>

            <span className="font-light text-xs sm:text-sm md:text-xl">선하람</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">서울대학교 전자전기공학부</span>

            <span className="font-light text-xs sm:text-sm md:text-xl">허서영</span>
            <span className="text-sm sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-xs sm:text-sm md:text-base text-left">서울대학교 전자전기 공학부</span>
          </div>
        </div>
      </motion.div>

      {/* ----------------------------------- */}
      {/* 6단계: Chemistry 팀 소개 */}
      {/* ----------------------------------- */}
      <motion.div
        className="fixed right-10 bottom-4 text-right z-10"
        style={{ opacity: sixthOpacity }}
      >
        <div className="flex flex-col text-black drop-shadow-xl gap-2">
          <p className="text-xl sm:text-2xl md:text-4xl font-light mb-6">Chemistry</p>
          <div className="grid grid-cols-[auto_auto_auto] gap-x-1 sm:gap-x-2 md:gap-x-3 gap-y-0 justify-end">
            <span className="font-light text-sm sm:text-sm md:text-xl">팀장 김용욱</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">서강대학교 화공생명공학부</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">구자형</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">경희대학교 치의학과</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">정우찬</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">한림대학교 의학과</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">심재호</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">서울대학교 수의예과</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">정재영</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">서울대학교 화학생물공학부</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">전유민</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">부산대학교 의예학과</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">함형령</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">고려대학교 전기전자공학부</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">박윤서</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">서울대학교</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">김태윤</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">연세대학교 의학과</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">김승현</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">성균관대학교 신소재공학부</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">이종승</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">순천대학교 약학과</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">이승욱</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">성균관대학교 에너지학과</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">이혜인</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">이화여자대학교 호크마교양학과</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">류문석</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">인제대학교 의예과</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">김명준</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">건국대학교 공과대학</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">강우혁</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">서울대학교 전자전기공학부</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">김경렬</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">한양대학교 의예과</span>
          </div>
        </div>
      </motion.div>

      {/* ----------------------------------- */}
      {/* 7단계: Biology 팀 소개 */}
      {/* ----------------------------------- */}
      <motion.div
        className="fixed right-10 bottom-4 text-right z-10"
        style={{ opacity: seventhOpacity }}
      >
        <div className="flex flex-col text-black drop-shadow-xl gap-2">
          <p className="text-xl sm:text-2xl md:text-4xl font-light mb-6">Biology</p>
          <div className="grid grid-cols-[auto_auto_auto] gap-x-1 sm:gap-x-2 md:gap-x-3 gap-y-0 justify-end">
            <span className="font-light text-sm sm:text-sm md:text-xl">팀장 한창성</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">연세대학교 약학과</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">구범수</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">중앙대학교 약학부</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">이희승</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">가톨릭대학교</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">김가영</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">건국대학교 물리학과</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">서지우</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">동국대학교 의예과</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">홍서정</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">이화여자대학교 지능형반도체공학과</span>
          </div>
        </div>
      </motion.div>

      {/* ----------------------------------- */}
      {/* 8단계: Earth science 팀 소개 */}
      {/* ----------------------------------- */}
      <motion.div
        className="fixed right-10 bottom-4 text-right z-10"
        style={{ opacity: eighthOpacity }}
      >
        <div className="flex flex-col text-black drop-shadow-xl gap-2">
          <p className="text-xl sm:text-2xl md:text-4xl font-light mb-6">Earth science</p>
          <div className="grid grid-cols-[auto_auto_auto] gap-x-1 sm:gap-x-2 md:gap-x-3 gap-y-0 justify-end">
            <span className="font-light text-sm sm:text-sm md:text-xl">팀장 이정우</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">성균관대학교 신소재공학부</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">조정욱</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">한양대학교 간호학과</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">최대현</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">고려대학교 건축사회환경공학부</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">장현성</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">고려대학교 바이오의공학부</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">오재성</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">중앙대학교 약학부</span>

            <span className="font-light text-sm sm:text-sm md:text-xl">박민주</span>
            <span className="text-base sm:text-lg md:text-2xl font-light">|</span>
            <span className="font-light text-sm sm:text-sm md:text-base text-left">충남대학교 수의예과</span>
          </div>
        </div>
      </motion.div>

      {/* ----------------------------------- */}
      {/* 9단계: WHO'S NEXT */}
      {/* ----------------------------------- */}
      <motion.div
        className="fixed left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2"
        style={{
          opacity: ninthOpacity,
          scale: ninthScale,
        }}
      >
        <div className="text-center drop-shadow-xl">
          <p 
            className="font-extrabold leading-none mb-4 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-[5.5vw]"
            style={{
              backgroundImage: 'linear-gradient(to right, #41566f 0%, #383878 25%, #6a4b87 50%, #7a2e62 75%, #99798f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            WHO&apos;S NEXT
          </p>
          <h1 
            className="font-extrabold leading-none bg-clip-text text-transparent text-4xl sm:text-6xl md:text-8xl lg:text-[9vw]"
            style={{
              backgroundImage: 'linear-gradient(to right, #41566f 0%, #383878 25%, #6a4b87 50%, #7a2e62 75%, #99798f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            VERADI
          </h1>
          <h2 
            className="font-extrabold leading-none mt-2 bg-clip-text text-transparent text-4xl sm:text-6xl md:text-8xl lg:text-[9vw]"
            style={{
              backgroundImage: 'linear-gradient(to right, #99798f 0%, #7a2e62 25%, #6a4b87 50%, #383878 75%, #41566f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            MAKERS
          </h2>
          <button
            className="mt-8 px-4 sm:px-6 md:px-8 py-2 text-sm sm:text-base md:text-xl font-medium text-black bg-transparent border-2 border-gray-600 rounded-full shadow-lg transition-all hover:scale-105"
          >
            Recruiting 지원하기
          </button>
        </div>
      </motion.div>

    </div>
  );
}
