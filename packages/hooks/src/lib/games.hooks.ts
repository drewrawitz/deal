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

  const joinGameMutation = useMutation(
    ({ game_id }: { game_id: number }) => Api.Games.join(game_id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["games"]);
      },
    }
  );

  return {
    joinGameMutation,
  };
}
