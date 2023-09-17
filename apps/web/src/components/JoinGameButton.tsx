import { useAuthQuery } from "@deal/hooks";
import { ListGamesResponse } from "@deal/types";
import { useMemo } from "react";
import { Link } from "react-router-dom";

interface JoinGameButtonProps {
  game: ListGamesResponse;
}

export default function JoinGameButton(props: JoinGameButtonProps) {
  const { game } = props;
  const { data: currentUser } = useAuthQuery();

  const isUserInGame = useMemo(() => {
    if (!currentUser) {
      return false;
    }

    return game.players.some((p) => p.player.id === currentUser.user_id);
  }, [currentUser, game]);

  const onClickJoinGame = () => {
    console.log("join game");
  };

  if (isUserInGame) {
    return (
      <Link to={`/games/${game.id}`}>
        <button
          type="button"
          className="rounded-md bg-orange hover:bg-orange/80 px-4 py-2 text-sm font-semibold text-white border-none"
        >
          Go to Game
        </button>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClickJoinGame}
      className="rounded-md bg-orange hover:bg-orange/80 px-4 py-2 text-sm font-semibold text-white border-none"
    >
      Join Game
    </button>
  );
}
