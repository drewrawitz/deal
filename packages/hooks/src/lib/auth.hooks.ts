import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "@deal/sdk";
import { LoginParams } from "@deal/types";

const getCurrentUser = async () => {
  return Api.Me.user();
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

export function useAuthMutations() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation(
    ({ email, password }: LoginParams) => Api.Auth.login(email, password),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["me"]);
      },
    }
  );

  const logoutMutation = useMutation(() => Api.Auth.logout(), {
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
    },
  });

  return {
    loginMutation,
    logoutMutation,
  };
}
