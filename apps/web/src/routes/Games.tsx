import { useGamesQuery } from "@deal/hooks";
import Layout from "../Layout";
import Chat from "../components/Chat";
import GamesTable from "../components/GamesTable";
import { GameStatus } from "@deal/types";
import { socket } from "../socket";
import { useEffect } from "react";
import OnlineUsers from "../components/OnlineUsers";
import CreateNewGameButton from "../components/CreateNewGameButton";

export default function Games() {
  const { data: inProgressGames } = useGamesQuery({
    status: GameStatus.IN_PROGRESS,
  });

  const { data: readyToJoinGames, refetch: refetchWaiting } = useGamesQuery({
    status: GameStatus.WAITING,
  });

  useEffect(() => {
    function onNewGame() {
      refetchWaiting();
    }

    socket.on("game.created", onNewGame);

    return () => {
      socket.off("game.created", onNewGame);
    };
  }, []);

  return (
    <Layout heading="Game Lobby" slot={<CreateNewGameButton />}>
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <div className="space-y-8">
            {readyToJoinGames && readyToJoinGames.count > 0 && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <GamesTable
                  status={GameStatus.WAITING}
                  data={readyToJoinGames?.data ?? []}
                />
              </div>
            )}
            {inProgressGames && inProgressGames.count > 0 && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <GamesTable
                  status={GameStatus.IN_PROGRESS}
                  data={inProgressGames?.data ?? []}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="grid grid-cols-1 gap-4">
          <section aria-labelledby="section-2-title">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-6 py-4 flex items-center justify-between border-b">
                <h2 className="text-xl font-semibold leading-6 text-body">
                  Chat
                </h2>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex-none rounded-full p-1 text-green-500 bg-green-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <OnlineUsers />
                </div>
              </div>
              <div className="px-6 py-4">
                <Chat />
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
