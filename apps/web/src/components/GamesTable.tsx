import { GameStatus, ListGamesResponse } from "@deal/types";
import { classNames, getAvatarUrl, relativeDate } from "@deal/utils-client";
import { Link } from "react-router-dom";
import JoinGameButton from "./JoinGameButton";

interface GamesTableProps {
  status: GameStatus;
  data: ListGamesResponse[];
}

interface GameTableContent {
  heading: string;
  status: string;
  date: string;
}

const contentData: Record<GameStatus, GameTableContent> = {
  waiting: {
    heading: "Ready to join",
    status: "Waiting",
    date: "Created at",
  },
  in_progress: {
    heading: "In Progress",
    status: "In Progress",
    date: "Started at",
  },
  abandoned: {
    heading: "Abandoned",
    status: "Abandoned",
    date: "Ended at",
  },
  finished: {
    heading: "Completed",
    status: "Ended",
    date: "Ended at",
  },
};

export default function GamesTable(props: GamesTableProps) {
  const { status, data } = props;
  const content = contentData[status];

  return (
    <div>
      <div className="p-4">
        <h2 className="text-xl font-semibold leading-6 text-body">
          {content.heading}
        </h2>
      </div>
      <div>
        <table className="text-body w-full">
          <thead className="text-sm bg-gray-50 border-y text-left">
            <tr>
              <th className="py-2 px-6">Owner</th>
              <th className="py-2 px-6">Players</th>
              <th className="py-2 px-6">Status</th>
              <th className="py-2 px-6">{content.date}</th>
              <th className="py-2 px-6"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((game) => {
              return (
                <tr className="border-b" key={game.id}>
                  <td className="px-6 py-4 font-medium text-gray-900 text-sm whitespace-nowrap w-[200px]">
                    <div className="flex items-center gap-x-4">
                      <img
                        src={getAvatarUrl(game.owner.username)}
                        alt={game.owner.username}
                        className="h-8 w-8 rounded-full bg-gray-300"
                      />
                      <div>
                        <div className="truncate">{game.owner.username}</div>
                        <div className="text-gray-400">Game #{game.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 text-sm whitespace-nowrap w-[100px]">
                    {game.players.length}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 text-sm whitespace-nowrap w-[100px]">
                    <div className="flex items-center space-x-2">
                      <div
                        className={classNames(
                          "flex-none rounded-full p-1",
                          game.status === "waiting"
                            ? "text-blue-400 bg-blue-400/20"
                            : "",
                          game.status === "in_progress"
                            ? "text-orange-400 bg-orange-400/20"
                            : ""
                        )}
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                      </div>
                      <span
                        className={classNames(
                          game.status === "waiting" ? "text-blue-500" : "",
                          game.status === "in_progress" ? "text-orange-500" : ""
                        )}
                      >
                        {content.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 text-sm whitespace-nowrap w-[150px]">
                    {relativeDate(game.started_at ?? game.created_at)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 text-sm whitespace-nowrap w-[150px]">
                    {game.status === "in_progress" && (
                      <Link to="/games/123">
                        <button
                          type="button"
                          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          View Game
                        </button>
                      </Link>
                    )}
                    {game.status === "waiting" && (
                      <JoinGameButton game={game} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
