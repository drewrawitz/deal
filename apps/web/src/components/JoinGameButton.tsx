import toast from "react-hot-toast";
import { useAuthQuery, useGamesMutations } from "@deal/hooks";
import { ListGamesResponse } from "@deal/types";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface JoinGameButtonProps {
  game: ListGamesResponse;
}

export default function JoinGameButton(props: JoinGameButtonProps) {
  const { game } = props;
  const { data: currentUser } = useAuthQuery();
  const { joinGameMutation, leaveGameMutation } = useGamesMutations();
  const navigate = useNavigate();
  const location = useLocation();
  const [actionStatus, setActionStatus] = useState<
    "idle" | "joining" | "leaving"
  >("idle");
  const isOnGameDetailPage = location.pathname.startsWith(`/games/${game.id}`);

  const isUserInGame = useMemo(() => {
    return (
      currentUser &&
      game.players.some((p) => p.player.id === currentUser.user_id)
    );
  }, [currentUser, game]);

  const handleError = (err: any) => {
    console.error("Something went wrong", err);
    toast.error(err?.response?.data?.message ?? "Something went wrong");
  };

  const onClickJoinGame = async () => {
    try {
      setActionStatus("joining");
      await joinGameMutation.mutateAsync({ game_id: game.id });
      navigate(`/games/${game.id}`);
      toast.success("You have joined the game!");
    } catch (err) {
      handleError(err);
    } finally {
      setActionStatus("idle");
    }
  };

  const onClickLeaveGame = async () => {
    try {
      setActionStatus("leaving");
      const data = await leaveGameMutation.mutateAsync({ game_id: game.id });

      // Was the game deleted?
      if (data.hasDeletedGame) {
        navigate(`/games`);
        toast.success("You have left the game. The game has been deleted.");
      } else {
        navigate(`/games/${game.id}`);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setActionStatus("idle");
    }
  };

  let buttonProps;
  if (isUserInGame && !isOnGameDetailPage) {
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
  } else if (isUserInGame && isOnGameDetailPage) {
    buttonProps = {
      onClick: onClickLeaveGame,
      disabled: actionStatus === "leaving",
      children: actionStatus === "leaving" ? "Leaving..." : "Leave Game",
    };
  } else {
    buttonProps = {
      onClick: onClickJoinGame,
      disabled: actionStatus === "joining",
      children: actionStatus === "joining" ? "Joining..." : "Join Game",
    };
  }

  return (
    <button
      type="button"
      className="rounded-md bg-orange hover:bg-orange/80 px-4 py-2 text-sm font-semibold text-white border-none disabled:opacity-50 disabled:cursor-not-allowed"
      {...buttonProps}
    />
  );
}
