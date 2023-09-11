import { useQuery } from "@tanstack/react-query";
import Api from "@deal/sdk";
import { GetChatMessagesDto } from "@deal/dto";
import { paginatedPlaceholder } from "../shared/helpers";

const getChatMessages = async (opts: GetChatMessagesDto) => {
  return Api.Chat.list(opts);
};

export function useChatMessagesQuery(opts: GetChatMessagesDto) {
  return useQuery({
    queryKey: ["chat", JSON.stringify(opts)],
    queryFn: () => getChatMessages(opts),
    staleTime: 1000 * 60 * 60, // 1 hour
    keepPreviousData: true,
    placeholderData: paginatedPlaceholder,
  });
}
