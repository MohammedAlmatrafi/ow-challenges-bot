import { AnimatePresence, motion } from "motion/react";
import type { Route } from "./+types/captain";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CaptainModal from "~/components/captainModal";
import {
  captainsContext,
  type captainsContextType,
} from "~/contexts/captains-context";
import { levelContext, type levelContextType } from "~/contexts/level-context";
import {
  playersContext,
  type playersContextType,
  type playerType,
} from "~/contexts/players-context";
import Button from "~/components/buttton";
import MainContent from "~/components/mainContent";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "بوت التحديات" },
    { name: "description", content: "بوت التحديات الاعظم" },
  ];
}

export default function Captain() {
  const { setCurrentLevel } = useContext(levelContext) as levelContextType;
  const { players } = useContext(playersContext) as playersContextType;
  const [modalConfig, setModalConfig] = useState<{
    openState: boolean;
    players: playerType[];
    teamId: string;
  }>({ openState: false, players: [], teamId: "0" });

  const { captainOne, captainTwo } = useContext(
    captainsContext
  ) as captainsContextType;

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentLevel(2);
  }, []);

  function assignCaptain(captainId: number) {
    const filteredArray = players.filter((player) => {
      if (captainId === 1) return player.n !== captainTwo?.n;
      if (captainId === 2) return player.n !== captainOne?.n;
    });

    setModalConfig({
      openState: true,
      players: filteredArray,
      teamId: captainId.toString(),
    });
  }

  return (
    <MainContent>
      <section className="flex flex-col gap-5 justify-center items-center mt-20">
        <div className="flex gap-5">
          <div className="flex flex-col justify-between py-10 items-center border-4 border-black/5 rounded-xl h-[300px] w-[300px] p-2">
            <h1>كابتن الفريق {1}</h1>
            {captainOne && (
              <img
                src={captainOne.a}
                className="rounded-full w-[100px] h-[100px]"
              />
            )}
            {captainOne && <h1>{captainOne.n}</h1>}
            <Button onClick={() => assignCaptain(1)} className="px-3 py-2">
              تعيين عشوائي
            </Button>
          </div>
          <div className="flex flex-col justify-between py-10 items-center border-4 border-black/5 rounded-xl h-[300px] w-[300px] p-2">
            <h1>كابتن الفريق {2}</h1>
            {captainTwo && (
              <img
                src={captainTwo.a}
                className="rounded-full w-[100px] h-[100px]"
              />
            )}
            {captainTwo && <h1>{captainTwo.n}</h1>}
            <Button onClick={() => assignCaptain(2)} className="px-3 py-2">
              تعيين عشوائي
            </Button>
          </div>
        </div>
        <Button
          disabled={captainTwo === undefined || captainOne === undefined}
          onClick={() => navigate("/players")}
          className="px-8 py-4 disabled:scale-100 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          التالي←
        </Button>
      </section>
      <AnimatePresence mode="wait">
        {modalConfig.openState && (
          <CaptainModal
            modalHandler={setModalConfig}
            players={modalConfig.players}
            teamId={modalConfig.teamId}
          />
        )}
      </AnimatePresence>
    </MainContent>
  );
}
