import { useContext, useEffect, useState } from "react";
import MainContent from "~/components/mainContent";
import { levelContext, type levelContextType } from "~/contexts/level-context";
import type { Route } from "./+types/post-challenge";
import {
  captainsContext,
  type captainsContextType,
} from "~/contexts/captains-context";
import Button from "~/components/buttton";
import { twMerge } from "tailwind-merge";
import {
  playersContext,
  type playersContextType,
} from "~/contexts/players-context";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "بوت التحديات" },
    { name: "description", content: "بوت التحديات الاعظم" },
  ];
}

export default function PostChallenge() {
  const { setCurrentLevel } = useContext(levelContext) as levelContextType;
  const { captainOne, captainTwo } = useContext(
    captainsContext
  ) as captainsContextType;
  const { players } = useContext(playersContext) as playersContextType;

  const [teamOneWins, setTeamOneWins] = useState(0);
  const [teamTwoWins, setTeamTwoWins] = useState(0);
  const [challengeHasFinished, setChallengeHasFinished] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    setCurrentLevel(5);
  }, []);

  const handleChallengeFinish = async () => {
    const attendedMatches = teamOneWins + teamTwoWins;
    let array = [];
    for (let i = 0; i < players.length; i++) {
      if (!players[i].i) continue;
      if (players[i].t === "1") {
        array.push(`${players[i].i}-${attendedMatches}-${teamOneWins}`);
      }
      if (players[i].t === "2") {
        array.push(`${players[i].i}-${attendedMatches}-${teamTwoWins}`);
      }
    }
    let string = array.join("|");
    string = btoa(string);
    setCode(string);
    await navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <MainContent>
      <section className="flex flex-col gap-5 justify-center items-center mt-20">
        <div className="flex items-center gap-5">
          <div className="flex flex-col justify-between py-10 items-center border-4 border-black/5 rounded-xl h-[300px] w-[300px] p-2">
            <h1>فريق {captainOne?.n}</h1>
            {captainOne && (
              <img
                src={captainOne.a}
                className="rounded-full w-[100px] h-[100px]"
              />
            )}
            <label htmlFor="">النتيجة</label>
            <div className="flex flex-col gap-1 items-center">
              <h1 className="font-bold text-xl">{teamOneWins}</h1>
              {!challengeHasFinished && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setTeamOneWins((prev) => prev + 1)}
                    className="text-xl duration-100 hover:bg-slate-400 active:scale-95 font-bold bg-slate-300 rounded-md flex items-center justify-center w-[30px] h-[30px]"
                  >
                    +
                  </button>
                  <button
                    onClick={() =>
                      setTeamOneWins((prev) => (prev <= 0 ? 0 : prev - 1))
                    }
                    className="text-xl duration-100 hover:bg-slate-400 active:scale-95 font-bold bg-slate-300 rounded-md flex items-center justify-center w-[30px] h-[30px]"
                  >
                    -
                  </button>
                </div>
              )}
            </div>
          </div>
          <h1 className="text-7xl font-bold">VS</h1>
          <div className="flex flex-col justify-between py-10 items-center border-4 border-black/5 rounded-xl h-[300px] w-[300px] p-2">
            <h1>فريق {captainTwo?.n}</h1>
            {captainTwo && (
              <img
                src={captainTwo.a}
                className="rounded-full w-[100px] h-[100px]"
              />
            )}
            <label htmlFor="">النتيجة</label>
            <div className="flex flex-col gap-1 items-center">
              <h1 className="font-bold text-xl">{teamTwoWins}</h1>
              {!challengeHasFinished && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setTeamTwoWins((prev) => prev + 1)}
                    className="text-xl duration-100 hover:bg-slate-400 active:scale-95 font-bold bg-slate-300 rounded-md flex items-center justify-center w-[30px] h-[30px]"
                  >
                    +
                  </button>
                  <button
                    onClick={() =>
                      setTeamTwoWins((prev) => (prev <= 0 ? 0 : prev - 1))
                    }
                    className="text-xl duration-100 hover:bg-slate-400 active:scale-95 font-bold bg-slate-300 rounded-md flex items-center justify-center w-[30px] h-[30px]"
                  >
                    -
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {!challengeHasFinished && (
          <Button
            onClick={() => {
              confirm("هل تريد إنهاء التحدي؟")
                ? setChallengeHasFinished(true)
                : null;
            }}
            className="bg-red-600 hover:bg-red-700 text-2xl py-2 px-5"
          >
            إنهاء التحدي
          </Button>
        )}
        {challengeHasFinished && (
          <div className="flex flex-col items-center justify-center gap-2">
            <Button
              onClick={handleChallengeFinish}
              className="aspect-square w-[35px] h-[35px] active:scale-90 flex items-center justify-center rounded-md p-1"
            >
              <img src="/copy-alt.svg" className="w-[25px] h-[25px]" />
            </Button>
            <p
              className={twMerge(
                "text-xl font-bold",
                hasCopied && "text-green-600"
              )}
            >
              {hasCopied ? "تم نسخ الكود" : "نسخ الكود"}
            </p>
          </div>
        )}
      </section>
    </MainContent>
  );
}
