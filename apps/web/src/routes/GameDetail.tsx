import toast from "react-hot-toast";
import { getAvatarUrl } from "@deal/utils-client";
import Layout from "../Layout";
import Chat from "../components/Chat";
import Section from "../components/Section";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAuthQuery,
  useGameActivityQuery,
  useGameQuery,
  useGameStateQuery,
} from "@deal/hooks";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import AudioPlayer from "../components/AudioPlayer";
import { SoundTriggers } from "@deal/types";
import { soundFileMapping } from "../utils/config";
import JoinGameButton from "../components/JoinGameButton";
import KickPlayerButton from "../components/KickPlayerButton";
import { useQueryClient } from "@tanstack/react-query";
import StartGameButton from "../components/StartGameButton";
import ActiveGameBoard from "../components/ActiveGameBoard";
import { GameProvider } from "../providers/game.context";

function NotFound() {
  return (
    <section>
      <div className="overflow-hidden rounded-lg bg-white shadow p-6">
        <p>This game was not found.</p>
      </div>
    </section>
  );
}

export default function GameDetail() {
  const { data: currentUser } = useAuthQuery();
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { data: state, isInitialLoading: isStateLoading } = useGameStateQuery(
    Number(gameId)
  );
  const { data: activity } = useGameActivityQuery(Number(gameId));
  const queryClient = useQueryClient();
  const [currentSound, setCurrentSound] = useState<SoundTriggers | null>(null);
  const { data, refetch, isInitialLoading, isError } = useGameQuery(
    Number(gameId)
  );
  const canStartGame = data?.players?.length && data.players.length > 1;
  const isOwner = data?.owner?.id === currentUser?.user_id;

  const playSound = (sound: SoundTriggers) => {
    setCurrentSound(sound);
    setTimeout(() => setCurrentSound(null), 1000);
  };

  useEffect(() => {
    const channel_join = `game.${gameId}.players.join`;
    const channel_leave = `game.${gameId}.players.leave`;
    const channel_kicked = `game.${gameId}.players.kicked`;
    const channel_change = `game.${gameId}.change`;

    function onGameChange() {
      refetch();
    }

    function onPlayersJoin() {
      playSound(SoundTriggers.ENTER_ROOM);
      refetch();
    }

    function onPlayersLeave() {
      playSound(SoundTriggers.LEAVE_ROOM);
      refetch();
    }

    function onPlayersKicked(playerId: string) {
      if (currentUser?.user_id === playerId) {
        navigate("/games");
        toast("You have been kicked from the game.", {
          icon: "🚨",
        });
        queryClient.invalidateQueries(["games"]);
      }

      onPlayersLeave();
    }

    socket.on(channel_join, onPlayersJoin);
    socket.on(channel_leave, onPlayersLeave);
    socket.on(channel_kicked, onPlayersKicked);
    socket.on(channel_change, onGameChange);

    return () => {
      socket.off(channel_join, onPlayersJoin);
      socket.off(channel_leave, onPlayersLeave);
      socket.off(channel_kicked, onPlayersKicked);
      socket.off(channel_change, onGameChange);
    };
  }, [currentUser]);

  if (isError) {
    return (
      <Layout heading="Game Not Found">
        <NotFound />
      </Layout>
    );
  }

  if (isInitialLoading) {
    return <Layout heading="Loading...">&nbsp;</Layout>;
  }

  if (data?.status === "waiting") {
    return (
      <Layout
        heading={`Game #${gameId}`}
        slot={
          <div className="space-y-4 text-right">
            {canStartGame ? (
              <StartGameButton game={data} />
            ) : (
              <div className="font-mono rounded-md bg-blue-400 px-2 py-0.5 text-white">
                Waiting for players
              </div>
            )}
          </div>
        }
      >
        {currentSound && (
          <AudioPlayer
            soundFile={soundFileMapping[currentSound]}
            play={Boolean(currentSound)}
          />
        )}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="grid grid-cols-1 gap-4 lg:col-span-2">
            <div className="space-y-8">
              <Section
                heading="Game Lobby"
                slot={<JoinGameButton game={data} />}
              >
                <div className="grid grid-cols-5">
                  {Array.from({ length: 5 }, (_, i) => {
                    const findPlayer = data?.players?.find(
                      (p) => p.position === i + 1
                    );

                    return (
                      <div key={i} className="py-4">
                        <h4 className="text-lg font-semibold mb-2">
                          Seat {i + 1}
                        </h4>

                        {findPlayer ? (
                          <div>
                            <img
                              src={getAvatarUrl(findPlayer.player.username)}
                              alt={findPlayer.player.username}
                              className="h-8 w-8 rounded-full bg-gray-300"
                            />
                            <div className="truncate text-sm mt-1">
                              {findPlayer.player.username}
                            </div>
                            {findPlayer.player.id === data.owner.id ? (
                              <span className="text-xs bg-blue-800 text-white py-1 px-2 rounded-md">
                                Owner
                              </span>
                            ) : isOwner ? (
                              <KickPlayerButton
                                game={data}
                                player={findPlayer.player}
                              />
                            ) : null}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Empty</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Section heading="Match Chat">
              <Chat gameId={Number(gameId)} />
            </Section>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      {state && activity && (
        <GameProvider
          state={state}
          activity={activity}
          gameId={Number(gameId)}
          isLoading={isStateLoading}
        >
          <ActiveGameBoard />
        </GameProvider>
      )}
    </>
  );
}
