import { useQuery } from "@tanstack/react-query";
import Api from "@deal/sdk";

const getCurrentUser = async () => {
  return Api.Auth.me();
};

export function useAuthQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => getCurrentUser(),
    staleTime: 1000 * 60 * 60, // 1 hour
    keepPreviousData: true,
    placeholderData: null,
  });
}
