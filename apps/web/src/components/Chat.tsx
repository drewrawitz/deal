import { getAvatarUrl, relativeDate } from "@deal/utils-client";
import CommentInput from "./CommentInput";
import { useChatMessagesQuery } from "@deal/hooks";
import { useEffect } from "react";
import { socket } from "../socket";

interface ChatProps {
  gameId?: number;
}

export default function Chat(props: ChatProps) {
  const { gameId } = props;
  const { data: chat, refetch } = useChatMessagesQuery({
    take: 50,
    ...(gameId && {
      game_id: gameId,
    }),
  });

  useEffect(() => {
    function onNewChat() {
      refetch();
    }

    socket.on("message.created", onNewChat);

    return () => {
      socket.off("message.created", onNewChat);
    };
  }, []);

  return (
    <>
      <div className="max-h-[500px] overflow-scroll">
        {chat?.data.map((message, idx) => {
          return (
            <div className="chat chat-start" key={idx}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={getAvatarUrl(message.user.username)}
                    className="h-8 w-8 rounded-full bg-gray-300"
                  />
                </div>
              </div>
              <div className="chat-header">{message.user.username}</div>
              <div className="chat-bubble">{message.content}</div>
              <div className="chat-footer">
                {relativeDate(message.created_at)}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <CommentInput />
      </div>
    </>
  );
}
