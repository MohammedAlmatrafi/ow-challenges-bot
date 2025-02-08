import { useEffect, useState, useRef, type FormEvent, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Modal from "~/components/modal";
import TextInput from "~/components/textInput";
import Button from "~/components/buttton";
import { levelContext, type levelContextType } from "~/contexts/level-context";
import {
  playersContext,
  type playersContextType,
  type playerType,
} from "~/contexts/players-context";
import MainContent from "~/components/mainContent";
import ChallengerCard from "~/components/challengerCard";
import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "بوت التحديات" },
    { name: "description", content: "بوت التحديات الاعظم" },
  ];
}

export default function Index() {
  const [params, setParams] = useSearchParams({ p: "" });
  const [unknownPlayerCount, setUnknownPlayerCount] = useState(1);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const newPlayerRef = useRef<HTMLInputElement>(null);
  const { setCurrentLevel } = useContext(levelContext) as levelContextType;

  const { players, setPlayers } = useContext(
    playersContext
  ) as playersContextType;

  useEffect(() => {
    setCurrentLevel(1);
    if (players.length === 0 && params.get("p")) {
      fetch(`http://158.101.249.118:2000/api/challenges?id=${params.get("p")}`)
        .then((res) => res.json())
        .then((data) => setPlayers(data));
    }
  }, []);

  const navigate = useNavigate();

  const handleAddPlayer = (e: FormEvent) => {
    e.preventDefault();
    const newPlayer: playerType = {
      n: "",
      a: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Overwatch_circle_logo.svg/2048px-Overwatch_circle_logo.svg.png",
      t: "0",
      c: false,
      i: null,
    };
    if (newPlayerRef.current?.value) {
      newPlayer.n = newPlayerRef.current?.value;
    } else {
      newPlayer.n = `UNKNOWN#${unknownPlayerCount}`;
      setUnknownPlayerCount((prev) => ++prev);
    }
    setPlayers((prevState) => [...prevState, newPlayer]);
    setAddPopupOpen(false);
  };

  const handleDeletePlayer = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const playerCard = e.target as HTMLElement;
    const playerName = playerCard.querySelector("p")?.innerHTML;
    const result = confirm(
      `هل تود أن تزيل ${playerName} من التحدي؟\n سيؤدي ذلك لإقصاءه من التحدي هل أنت متأكد؟`
    );
    if (result)
      setPlayers((prev) => prev.filter((player) => player.n !== playerName));
  };

  return (
    <MainContent>
      <section className="flex flex-col justify-center items-center mt-20">
        <h1 className="text-center text-xl font-bold text-gray-700">
          قائمة المتحدين (
          {`
          ${players.length}
          ${players.length === 1 ? "لاعب" : ""}
          ${players.length === 2 ? "لاعبان" : ""}
          ${players.length > 2 && players.length <= 10 ? "لاعبين" : ""}
          ${players.length > 10 && players.length < 21 ? "لاعب" : ""}
          `}
          )
        </h1>
        <ul className="flex flex-wrap gap-2 border-4 border-black/5 p-5 rounded-xl my-2 container">
          <Button
            onClick={() => setAddPopupOpen(true)}
            className="bg-transparent text-gray-700 border-2 border-gray-600 hover:bg-gray-600 hover:text-white"
          >
            إضافة لاعب +
          </Button>
          {players.map((player) => (
            <ChallengerCard
              key={player.n}
              deleteHandler={handleDeletePlayer}
              player={player}
              trackable={player.i !== null}
            />
          ))}
        </ul>
        <Button onClick={() => navigate("/captain")} className="px-8 py-4">
          التالي←
        </Button>
        {addPopupOpen && (
          <Modal title="لاعب جديد" modalHandler={setAddPopupOpen}>
            <form className="contents" onSubmit={handleAddPlayer}>
              <TextInput
                ref={newPlayerRef}
                label="اسم اللاعب"
                required
                minLength={1}
              />
              <input
                type="submit"
                value={"أضف"}
                className="bg-green-600 text-white py-1 px-2 rounded-md hover:bg-green-700 active:scale-95 duration-100 cursor-pointer self-end"
              />
            </form>
          </Modal>
        )}
      </section>
    </MainContent>
  );
}
