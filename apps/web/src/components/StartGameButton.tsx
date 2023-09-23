import { useAuthQuery, useGamesMutations } from "@deal/hooks";
import { ListGamesResponse } from "@deal/types";
import { useState } from "react";
import { handleError } from "../utils/shared";

interface StartGameButtonProps {
  game: ListGamesResponse;
}

export default function StartGameButton(props: StartGameButtonProps) {
  const { game } = props;
  const [isStarting, setIsStarting] = useState(false);
  const { data: currentUser } = useAuthQuery();
  const { startGameMutation } = useGamesMutations();
  const isOwner = game?.owner?.id === currentUser?.user_id;

  const onClickStartGame = async () => {
    try {
      setIsStarting(true);
      await startGameMutation.mutateAsync({ game_id: game.id });
    } catch (err) {
      handleError(err);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <>
      {isOwner ? (
        <button
          type="button"
          onClick={onClickStartGame}
          disabled={isStarting}
          className="rounded-md bg-green-600 hover:bg-green-600/80 px-4 py-2 text-sm font-semibold text-white border-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStarting ? "Starting..." : "Start Game"}
        </button>
      ) : (
        <div className="font-mono rounded-md bg-green-600 px-2 py-0.5 text-white">
          Ready to start
        </div>
      )}
    </>
  );
}
