import { useDndContext, useDraggable } from "@dnd-kit/core";
import { twMerge } from "tailwind-merge";

const DraggablePlayerCard = ({
  playerName,
  id,
  isCaptain,
  playerAvatar,
}: {
  playerName: string;
  id: string;
  isCaptain?: boolean;
  playerAvatar?: string;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  const { active } = useDndContext();

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={twMerge(
        "py-2 px-2 bg-slate-100 border-black/5 cursor-grab active:cursor-grabbing select-none rounded-xl list-none relative overflow-clip",
        active?.id === id ? "z-50 border-4" : "z-10",
        isCaptain && "order-first"
      )}
    >
      {isCaptain && (
        <div className="absolute right-0 top-0 font-bold rounded-bl-xl bg-amber-300 flex items-center justify-center w-[30px] h-[30px]">
          C
        </div>
      )}
      <div className="flex flex-col gap-2 items-center justify-center pointer-events-none">
        <img
          src={playerAvatar}
          alt="Player Avatar"
          className="rounded-full w-[50px] h-[50px]"
        />
        <p>{playerName}</p>
      </div>
    </li>
  );
};
export default DraggablePlayerCard;
