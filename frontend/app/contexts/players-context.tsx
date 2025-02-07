import React, { createContext, useState } from "react";

export type playersContextType = {
  players: playerType[];
  setPlayers: React.Dispatch<React.SetStateAction<playerType[]>>;
};

export type playerType = {
  n: string;
  a: string;
  t: string;
  c: boolean;
  i: string | null;
};

export const playersContext = createContext<playersContextType | null>(null);

const PlayersContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [players, setPlayers] = useState<playerType[]>([]);

  return (
    <playersContext.Provider
      value={{
        players,
        setPlayers,
      }}
    >
      {children}
    </playersContext.Provider>
  );
};
export default PlayersContextProvider;
