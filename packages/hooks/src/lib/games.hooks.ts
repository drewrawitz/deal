import { useQuery } from "@tanstack/react-query";
import Api from "@deal/sdk";
import { GetGamesDto } from "@deal/dto";
// This is weirdly needed, even though it's not used.
// @see: https://github.com/microsoft/TypeScript/issues/47663
import * as temp from "@deal/types";

const paginatedPlaceholder = {
  data: [],
  count: 0,
  current_page: 1,
  last_page: 1,
  next_page: null,
  prev_page: null,
};

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
