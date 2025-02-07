import { motion } from "motion/react";
import { useState } from "react";
import type { playerType } from "~/contexts/players-context";

const ChallengerCard = ({
  deleteHandler,
  player,
  trackable = false,
}: {
  deleteHandler: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  player: playerType;
  trackable?: boolean;
}) => {
  const [tipOpen, setTipOpen] = useState(false);
  return (
    <li
      onClick={deleteHandler}
      onMouseOver={() => setTipOpen(true)}
      onMouseLeave={() => setTipOpen(false)}
      className="py-2 px-2 bg-slate-100 hover:bg-red-100 duration-150 cursor-no-drop select-none rounded-md relative"
    >
      {!trackable && (
        <div className="bg-red-200 text-red-600 rounded-br-md rounded-tl-md w-[20px] h-[20px] absolute top-0 left-0 flex items-center justify-center">
          !
        </div>
      )}
      {!trackable && tipOpen && (
        <motion.div
          animate={{ y: [-30, 1], opacity: [0, 1] }}
          className="absolute text-red-800 bg-red-100 p-2 rounded-md top-[-80px] left-0 right-0 mx-auto w-60 duration-100"
        >
          هذا اللاعب مؤقت ولا يمكن متابعة بياناته.
        </motion.div>
      )}
      <div className="flex gap-2 items-center justify-center pointer-events-none">
        <img
          src={player.a}
          alt="Player Avatar"
          className="rounded-full w-[50px] h-[50px]"
        />
        <p>{player.n}</p>
      </div>
    </li>
  );
};
export default ChallengerCard;
