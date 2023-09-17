import toast from "react-hot-toast";
import { useAuthQuery, useGamesMutations } from "@deal/hooks";
import { ListGamesResponse } from "@deal/types";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface JoinGameButtonProps {
  game: ListGamesResponse;
}

export default function JoinGameButton(props: JoinGameButtonProps) {
  const { game } = props;
  const { data: currentUser } = useAuthQuery();
  const { joinGameMutation } = useGamesMutations();
  const navigate = useNavigate();
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const isUserInGame = useMemo(() => {
    if (!currentUser) {
      return false;
    }

    return game.players.some((p) => p.player.id === currentUser.user_id);
  }, [currentUser, game]);

  const onClickJoinGame = async () => {
    try {
      setIsJoiningGame(true);
      await joinGameMutation.mutateAsync({
        game_id: game.id,
      });

      navigate(`/games/${game.id}`);
    } catch (err: any) {
      console.error("Something went wrong", err);
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    } finally {
      setIsJoiningGame(false);
    }
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
      disabled={isJoiningGame}
      className="rounded-md bg-orange hover:bg-orange/80 px-4 py-2 text-sm font-semibold text-white border-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isJoiningGame ? "Joining..." : "Join Game"}
    </button>
  );
}
