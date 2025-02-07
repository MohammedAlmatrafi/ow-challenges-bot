import { motion } from "motion/react";
import type { Route } from "./+types/players";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { levelContext, type levelContextType } from "~/contexts/level-context";
import {
  playersContext,
  type playersContextType,
} from "~/contexts/players-context";
import DraggablePlayerCard from "~/components/draggablePlayerCard";
import DroppableTeamColumn from "~/components/droppableTeamColumn";
import Button from "~/components/buttton";
import { AnimatePresence } from "motion/react";
import MainContent from "~/components/mainContent";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "بوت التحديات" },
    { name: "description", content: "بوت التحديات الاعظم" },
  ];
}

export default function Players() {
  const [activeId, setActiveId] = useState<string>("0");
  const { setCurrentLevel } = useContext(levelContext) as levelContextType;
  const { players, setPlayers } = useContext(
    playersContext
  ) as playersContextType;
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentLevel(3);
  }, []);

  const challengeCanStart =
    players.length !== 0 &&
    players.filter((player) => player.t === "0").length === 0;

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over) return;

    const teamId = over.id as string;
    const playerId = active.id as string;

    const player = players.find((player) => player.n === playerId)!;

    if (player.t === teamId) return;

    console.log(teamId, player);

    setPlayers((prevState) =>
      prevState.map((player) =>
        player.n === playerId ? { ...player, t: teamId } : player
      )
    );
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={(event: DragStartEvent) =>
        setActiveId(event.active.id as string)
      }
    >
      <MainContent>
        <section className="flex items-stretch gap-10 justify-center mt-2">
          <DroppableTeamColumn teamId="1">
            <ul className="flex flex-col gap-1">
              {players &&
                players.map((player) => {
                  if (player.t === "1") {
                    return (
                      <DraggablePlayerCard
                        key={player.n}
                        id={player.n}
                        playerName={player.n}
                        playerAvatar={player.a}
                        isCaptain={player.c}
                      />
                    );
                  }
                })}
            </ul>
          </DroppableTeamColumn>
          <DroppableTeamColumn teamId="0">
            <h1 className="text-center">
              {challengeCanStart ? "التحدي جاهز للبدء" : "متاحين للإختيار"}
            </h1>
            <ul className="grid grid-cols-2 gap-3 p-3 rounded-md ">
              {players &&
                players.map((player) => {
                  if (player.t === "0" || !player.t) {
                    return (
                      <DraggablePlayerCard
                        key={player.n}
                        id={player.n}
                        playerName={player.n}
                        playerAvatar={player.a}
                        isCaptain={player.c}
                      />
                    );
                  }
                })}
              <AnimatePresence mode="wait">
                {challengeCanStart && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0 } }}
                    className="col-span-2"
                  >
                    <Button
                      className="w-full text-xl font-bold py-3"
                      onClick={() => navigate("/start-challenge")}
                    >
                      التالي←
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </ul>
          </DroppableTeamColumn>
          <DroppableTeamColumn teamId="2">
            <ul className="flex flex-col gap-1">
              {players &&
                players.map((player) => {
                  if (player.t === "2") {
                    return (
                      <DraggablePlayerCard
                        key={player.n}
                        id={player.n}
                        playerName={player.n}
                        playerAvatar={player.a}
                        isCaptain={player.c}
                      />
                    );
                  }
                })}
            </ul>
          </DroppableTeamColumn>
        </section>
      </MainContent>
    </DndContext>
  );
}
