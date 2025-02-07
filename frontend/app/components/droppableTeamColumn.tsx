import { useDroppable } from "@dnd-kit/core";
import { useContext } from "react";
import { twMerge } from "tailwind-merge";
import {
  playersContext,
  type playersContextType,
} from "~/contexts/players-context";

const DroppableTeamColumn = ({
  children,
  teamId,
}: {
  children: React.ReactNode;
  teamId: string;
}) => {
  const { isOver, setNodeRef } = useDroppable({ id: teamId });

  const { players } = useContext(playersContext) as playersContextType;
  const captain = players.find((player) => player.t === teamId && player.c);
  return (
    <div
      ref={setNodeRef}
      className={twMerge(
        "border-4 p-5 w-md rounded-xl relative transition-all duration-150",
        isOver ? "border-green-700/80" : "border-black/5"
      )}
    >
      {teamId !== "0" && captain && (
        <h1 className="absolute top-[-20px] px-2 whitespace-nowrap max-w-md overflow-x-auto bg-white text-2xl font-bold">
          فريق {captain.n}
        </h1>
      )}
      {children}
    </div>
  );
};
export default DroppableTeamColumn;
