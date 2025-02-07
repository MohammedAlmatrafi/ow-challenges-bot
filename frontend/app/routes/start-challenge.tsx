import { AnimatePresence, motion, type Variants } from "motion/react";
import { useContext, useEffect, useRef, useState } from "react";
import { levelContext, type levelContextType } from "~/contexts/level-context";
import type { Route } from "./+types/start-challenge";
import Button from "~/components/buttton";
import TeamRow, {
  CAPTAIN_DURATION,
  OTHER_TEAM_MEMBERS_DELAY,
} from "~/components/teamRow";
import {
  playersContext,
  type playersContextType,
  type playerType,
} from "~/contexts/players-context";
import { useNavigate } from "react-router";

const days = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الاربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "بوت التحديات" },
    { name: "description", content: "بوت التحديات الاعظم" },
  ];
}

const VERSUS_DELAY = 3;
const VERSUS_DURATION = 0.4;
const INTRO_ELEMENT_DURATION = 1500;
const NUMBER_OF_INTROS = 4;

export default function StartChallengePage() {
  const { setCurrentLevel } = useContext(levelContext) as levelContextType;
  const { players } = useContext(playersContext) as playersContextType;
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [animFinished, setAnimFinished] = useState(false);

  const naviagte = useNavigate();

  const interval = useRef<any>(null);
  const currentTime = new Date(Date.now());
  const maximumAnimationDuration =
    (5 * OTHER_TEAM_MEMBERS_DELAY +
      CAPTAIN_DURATION +
      VERSUS_DELAY +
      VERSUS_DURATION) *
      1000 +
    INTRO_ELEMENT_DURATION * NUMBER_OF_INTROS;

  useEffect(() => {
    setCurrentLevel(4);
    interval.current = setInterval(() => {
      setSequenceIndex((prev) => prev + 1);
    }, INTRO_ELEMENT_DURATION);

    const timeout = setTimeout(() => {
      setAnimFinished(true);
    }, maximumAnimationDuration);
    return () => {
      clearInterval(interval.current);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (sequenceIndex === NUMBER_OF_INTROS) clearInterval(interval.current);
  }, [sequenceIndex]);

  return (
    <main className="flex gap-40 h-full justify-center items-center">
      <AnimatePresence mode="wait">
        {sequenceIndex === 0 && (
          <IntroHeader key={1}>
            {currentTime.toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </IntroHeader>
        )}
        {sequenceIndex === 1 && (
          <IntroHeader key={2}>{days[currentTime.getDay()]}</IntroHeader>
        )}
        {sequenceIndex === 2 && (
          <IntroHeader key={3}>
            {currentTime.toLocaleTimeString("ar-EG", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </IntroHeader>
        )}
        {sequenceIndex === 3 && (
          <IntroHeader key={4}>اصنع مجدك الآن</IntroHeader>
        )}
        {sequenceIndex === 4 && (
          <motion.div
            layout
            key={5}
            className="flex flex-col items-center gap-5"
          >
            <TeamRow teamId="1" key={1} />
            <motion.h1
              animate={{
                opacity: [0, 1],
                scale: [0, 1],
                transition: {
                  delay: VERSUS_DELAY,
                  duration: VERSUS_DURATION,
                  type: "spring",
                },
              }}
              className="text-6xl font-bold"
            >
              VS
            </motion.h1>
            <TeamRow teamId="2" key={2} />
          </motion.div>
        )}
      </AnimatePresence>
      {animFinished && (
        <motion.div
          key={6}
          animate={{ opacity: [0, 1], transition: { duration: 2 } }}
          className="overflow-clip"
        >
          <Button
            onClick={() => naviagte("/post-challenge")}
            className="text-3xl p-4"
          >
            ابدأ التحدي ←
          </Button>
        </motion.div>
      )}
    </main>
  );
}

const IntroHeader = ({ children }: { children: React.ReactNode }) => {
  const introVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };
  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={introVariants}
      className="text-7xl font-bold"
    >
      {children}
    </motion.h1>
  );
};
