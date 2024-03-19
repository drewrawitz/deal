import { createContext, useContext } from "react";
import { GameActivityResponse, GameState } from "@deal/types";

const GameContext = createContext<
  | {
      state: GameState;
      activity: GameActivityResponse[];
      gameId: number;
      isLoading: boolean;
    }
  | undefined
>(undefined);

export const GameProvider: React.FC<{
  state: GameState;
  gameId: number;
  isLoading: boolean;
  activity: GameActivityResponse[];
  children: React.ReactNode;
}> = ({ children, state, activity, gameId, isLoading }) => {
  return (
    <GameContext.Provider value={{ state, gameId, activity, isLoading }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameEngine = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameEngine must be used within a GameProvider");
  }
  return context;
};
