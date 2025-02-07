import { motion } from "motion/react";
import { useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  captainsContext,
  type captainsContextType,
} from "~/contexts/captains-context";
import type { playerType } from "~/contexts/players-context";

const CaptainModal = ({
  teamId,
  players,
  modalHandler,
}: {
  teamId: string;
  players: playerType[];
  modalHandler: React.Dispatch<
    React.SetStateAction<{
      openState: boolean;
      players: playerType[];
      teamId: string;
    }>
  >;
}) => {
  const [flickerIndex, setFlickerIndex] = useState(-1);
  const [captainIndex, setCaptainIndex] = useState(-1);
  const { setCaptainOne, setCaptainTwo } = useContext(
    captainsContext
  ) as captainsContextType;

  const captainSelectSound = new Audio("/captain-select.mp3");
  const flickerSound = new Audio("/flicker-sound.mp3");
  flickerSound.volume = 0.1;

  useEffect(() => {
    const captain = players[Math.floor(Math.random() * players.length)];

    const flickeringInterval = setInterval(() => {
      setFlickerIndex(Math.floor(Math.random() * players.length));
      flickerSound.pause();
      flickerSound.currentTime = 0;
      flickerSound.play();
    }, 100);

    const timeout1 = setTimeout(() => {
      if (teamId === "1") {
        setCaptainOne((prevCaptain) => {
          if (prevCaptain) {
            console.log(`removing ${prevCaptain.n} from team ${prevCaptain.t}`);
            prevCaptain.c = false;
            prevCaptain.t = "0";
          }
          captain.t = "1";
          captain.c = true;
          return captain;
        });
      }

      if (teamId === "2") {
        setCaptainTwo((prevCaptain) => {
          if (prevCaptain) {
            console.log(`removing ${prevCaptain.n} from team ${prevCaptain.t}`);
            prevCaptain.c = false;
            prevCaptain.t = "0";
          }
          captain.t = "2";
          captain.c = true;
          return captain;
        });
      }
      clearInterval(flickeringInterval);
      setFlickerIndex(-1);
      setCaptainIndex(players.indexOf(captain));
      captainSelectSound.play();
      setTimeout(() => {
        modalHandler((prevState) => ({ ...prevState, openState: false }));
      }, 2000);
    }, 5000);

    return () => {
      clearTimeout(timeout1);
      clearInterval(flickeringInterval);
    };
  }, []);

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      exit={{ opacity: 0 }}
      className="absolute flex items-center justify-center top-0 left-0 w-[100vw] h-[100vh] bg-black/50"
    >
      <motion.div
        animate={{
          scale: [0, 1],
          transition: { type: "spring", stiffness: 300, mass: 1 },
        }}
        exit={{ opacity: 0 }}
        className="bg-white p-10 rounded-xl"
      >
        <ul className="grid grid-cols-3 gap-2">
          {players.map((player, i) => (
            <li
              key={player.n}
              className={twMerge(
                "bg-slate-100 p-2 rounded-md duration-100 flex flex-col items-center aspect-square",
                flickerIndex === i && "animate-(--animation-flicker) scale-95",
                captainIndex === i &&
                  "bg-amber-300 animate-(--animation-captainPing)"
              )}
            >
              <img src={player.a} className="rounded-full w-[80px] h-[80px]" />
              <h1>{player.n}</h1>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};
export default CaptainModal;
