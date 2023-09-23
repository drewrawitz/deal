import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "@deal/sdk";
import { GetGamesDto } from "@deal/dto";
import { paginatedPlaceholder } from "../shared/helpers";
// This is weirdly needed, even though it's not used.
// @see: https://github.com/microsoft/TypeScript/issues/47663
import * as temp from "@deal/types";

const getGames = async (opts: GetGamesDto) => {
  return Api.Games.list(opts);
};

export function useGameQuery(game_id: number) {
  return useQuery({
    queryKey: ["game", game_id],
    queryFn: () => Api.Games.retreive(game_id),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false,
  });
}

export function useGamesQuery(opts: GetGamesDto) {
  return useQuery({
    queryKey: ["games", JSON.stringify(opts)],
    queryFn: () => getGames(opts),
    staleTime: 1000 * 60 * 60, // 1 hour
    keepPreviousData: true,
    placeholderData: paginatedPlaceholder,
  });
}

export function useGamesMutations() {
  const queryClient = useQueryClient();

  const createGameMutation = useMutation(() => Api.Games.create(), {
    onSuccess: () => {
      queryClient.invalidateQueries(["games"]);
    },
  });

  const joinGameMutation = useMutation(
    ({ game_id }: { game_id: number }) => Api.Games.join(game_id),
    {
      onSuccess: (_, params) => {
        queryClient.invalidateQueries(["games"]);
        queryClient.invalidateQueries(["game", params.game_id]);
      },
    }
  );

  const leaveGameMutation = useMutation(
    ({ game_id }: { game_id: number }) => Api.Games.leave(game_id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["games"]);
      },
    }
  );

  const startGameMutation = useMutation(
    ({ game_id }: { game_id: number }) => Api.Games.start(game_id),
    {
      onSuccess: (_, params) => {
        queryClient.invalidateQueries(["games"]);
        queryClient.invalidateQueries(["game", params.game_id]);
      },
    }
  );

  const kickPlayerFromGameMutation = useMutation(
    ({ game_id, player_id }: { game_id: number; player_id: string }) =>
      Api.Games.kickPlayer(game_id, player_id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["games"]);
      },
    }
  );

  return {
    startGameMutation,
    createGameMutation,
    joinGameMutation,
    leaveGameMutation,
    kickPlayerFromGameMutation,
  };
}
