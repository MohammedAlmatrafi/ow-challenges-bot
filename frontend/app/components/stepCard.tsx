import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const StepCard = ({
  stepNumber,
  stepDescription,
  active,
  completed,
}: {
  stepNumber: number;
  stepDescription: string;
  active?: boolean;
  completed?: boolean;
}) => {
  return (
    <div
      className={twMerge(
        "relative p-3 whitespace-nowrap transition duration-200",
        completed ? "text-green-700/70" : "text-black/10",
        active && "text-black translate-y-2"
      )}
    >
      <h3>خطوة {stepNumber}</h3>
      <h1 className="font-bold text-xl">{stepDescription}</h1>
    </div>
  );
};

export const StepLine = ({ active }: { active?: boolean }) => {
  return (
    <div
      className={clsx(
        "w-full h-1 rounded-full transition-colors duration-200 bg-black/10 relative"
      )}
    >
      <div
        className={twMerge(
          "bg-green-700/50 h-full rounded-full transition-all duration-200",
          active ? "w-full" : "w-0"
        )}
      />
    </div>
  );
};

export default StepCard;
