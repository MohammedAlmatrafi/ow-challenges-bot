import { createContext, useState } from "react";
import type { playerType } from "./players-context";

export type captainsContextType = {
  captainOne: playerType | undefined;
  captainTwo: playerType | undefined;
  setCaptainOne: React.Dispatch<React.SetStateAction<playerType | undefined>>;
  setCaptainTwo: React.Dispatch<React.SetStateAction<playerType | undefined>>;
};

export const captainsContext = createContext<captainsContextType | null>(null);

const CaptainsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [captainOne, setCaptainOne] = useState<playerType>();
  const [captainTwo, setCaptainTwo] = useState<playerType>();
  return (
    <captainsContext.Provider
      value={{ captainOne, captainTwo, setCaptainOne, setCaptainTwo }}
    >
      {children}
    </captainsContext.Provider>
  );
};
export default CaptainsContextProvider;
