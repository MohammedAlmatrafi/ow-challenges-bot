import { motion, type Variants } from "motion/react";

import { useContext } from "react";
import { twMerge } from "tailwind-merge";
import {
  playersContext,
  type playersContextType,
  type playerType,
} from "~/contexts/players-context";

export const OTHER_TEAM_MEMBERS_DELAY = 0.2;
export const CAPTAIN_DURATION = 1;

const TeamRow = ({ teamId }: { teamId: string }) => {
  const { players } = useContext(playersContext) as playersContextType;

  const containerVariant: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: OTHER_TEAM_MEMBERS_DELAY, // Delay between each child's animation
        delayChildren: CAPTAIN_DURATION, // Delay before animation starts
      },
    },
  };

  return (
    <div className="flex flex-col gap-2 items-center text-2xl">
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={containerVariant}
        className={twMerge("flex gap-10", teamId === "2" && "flex-row-reverse")}
      >
        {players.map((player) => {
          if (player.t === teamId && !player.c)
            return (
              <TeamPlayerCard player={player} nameFlipped={teamId === "1"} />
            );
        })}
      </motion.ul>
      <motion.div
        animate={{
          y: [teamId === "1" ? -40 : 40, 0],
          opacity: [0, 1],
          transition: { duration: CAPTAIN_DURATION },
        }}
        className={twMerge(teamId === "2" && "order-first")}
      >
        {players.map((player) => {
          if (player.t === teamId && player.c)
            return (
              <TeamPlayerCard
                player={player}
                isCaptain={player.c}
                nameFlipped={teamId === "1"}
              />
            );
        })}
      </motion.div>
    </div>
  );
};

const TeamPlayerCard = ({
  player,
  nameFlipped,
  isCaptain,
}: {
  player: playerType;
  nameFlipped?: boolean;
  isCaptain?: boolean;
}) => {
  const childVariants: Variants = {
    hidden: { y: nameFlipped ? -40 : 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };
  return (
    <motion.div variants={childVariants} className="flex flex-col items-center">
      <img
        src={player.a}
        className={twMerge(
          "rounded-full ",
          isCaptain ? "w-[100px] h-[100px]" : "w-[80px] h-[80px]"
        )}
      />
      <h1 className={twMerge(nameFlipped && "order-first")}>{player.n}</h1>
    </motion.div>
  );
};
export default TeamRow;
