import { Outlet } from "react-router";
import StepCard, { StepLine } from "./components/stepCard";
import { useContext } from "react";
import { levelContext, type levelContextType } from "./contexts/level-context";

export default function layout() {
  const { currentLevel } = useContext(levelContext) as levelContextType;
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col overflow-hidden">
      <nav className="py-10 px-20 flex gap-5">
        <div>
          <img
            src="/challenges-bot-arabic.png"
            alt=""
            className="rounded-full w-[250px] h-[250px]"
          />
        </div>
        <div className="my-3 px-10 lg:px-40 flex items-center justify-between flex-auto">
          <StepCard
            stepNumber={1}
            stepDescription="تحديد المتحدين"
            active={currentLevel === 1}
            completed={currentLevel >= 2}
          />
          <StepLine active={currentLevel >= 2} />
          <StepCard
            stepNumber={2}
            stepDescription="تحديد الكباتن"
            active={currentLevel === 2}
            completed={currentLevel >= 3}
          />
          <StepLine active={currentLevel >= 3} />
          <StepCard
            stepNumber={3}
            stepDescription="تحديد اللاعبين"
            active={currentLevel === 3}
            completed={currentLevel >= 4}
          />
          <StepLine active={currentLevel >= 4} />
          <StepCard
            stepNumber={4}
            stepDescription="بدء التحدي"
            active={currentLevel === 4}
            completed={currentLevel >= 5}
          />
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
