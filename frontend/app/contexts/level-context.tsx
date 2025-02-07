import { createContext, useState } from "react";

export type levelContextType = {
  currentLevel: number;
  setCurrentLevel: (n: number) => void;
};

export const levelContext = createContext<levelContextType | null>(null);

export default function LevelContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentLevel, setCurrentLevel] = useState(1);

  return (
    <levelContext.Provider value={{ currentLevel, setCurrentLevel }}>
      {children}
    </levelContext.Provider>
  );
}
