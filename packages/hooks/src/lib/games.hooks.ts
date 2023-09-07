import { useQuery } from "@tanstack/react-query";
import Api from "@deal/sdk";

const getGames = async () => {
  return Api.Games.list();
};

export function useGamesQuery() {
  return useQuery({
    queryKey: ["games"],
    queryFn: () => getGames(),
    staleTime: 1000 * 60 * 60, // 1 hour
    keepPreviousData: true,
    placeholderData: [],
  });
}
