import React, { useState } from "react";
import { Popover } from "@headlessui/react";
import { ListGamesResponse, PlayerFields } from "@deal/types";
import { useGamesMutations } from "@deal/hooks";
import { handleError } from "../utils/shared";

interface KickPlayerButtonProps {
  game: ListGamesResponse;
  player: PlayerFields;
}

const KickPlayerButton: React.FC<KickPlayerButtonProps> = ({
  game,
  player,
}) => {
  const [isKicking, setIsKicking] = useState(false);
  const { kickPlayerFromGameMutation } = useGamesMutations();

  const onClickKickPlayer = async () => {
    try {
      setIsKicking(true);
      await kickPlayerFromGameMutation.mutateAsync({
        game_id: game.id,
        player_id: player.id,
      });
    } catch (err) {
      handleError(err);
    } finally {
      setIsKicking(false);
    }
  };

  return (
    <Popover className="relative">
      <Popover.Button className="text-xs text-red-600 font-semibold hover:underline">
        Kick Player
      </Popover.Button>

      <Popover.Panel className="absolute z-10 inline-block w-64 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm ">
        {({ close }) => (
          <>
            <div className="px-3 py-2 border-b rounded-t-lg border-gray-600 bg-gray-700">
              <h3 className="font-semibold text-white">Kick Player</h3>
            </div>
            <div className="p-3 text-center">
              <p>
                Are you sure you want to kick <strong>{player.username}</strong>{" "}
                from the game?
              </p>

              <div className="space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => close()}
                  className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isKicking}
                  onClick={onClickKickPlayer}
                  className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {isKicking ? "Kicking..." : "Kick Player"}
                </button>
              </div>
            </div>
          </>
        )}
      </Popover.Panel>
    </Popover>
  );
};

export default KickPlayerButton;
