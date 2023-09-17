import { classNames, getAvatarUrl, relativeDate } from "@deal/utils-client";
import CommentInput from "./CommentInput";
import { useChatMessagesQuery } from "@deal/hooks";
import { config } from "@deal/utils-client";
import { useEffect } from "react";
import { socket } from "../socket";
import { IconCrown } from "@tabler/icons-react";

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
    const channel = gameId ? `game.${gameId}.chat` : "message.created";

    function onNewChat() {
      refetch();
    }

    socket.on(channel, onNewChat);

    return () => {
      socket.off(channel, onNewChat);
    };
  }, []);

  return (
    <>
      <div className="max-h-[500px] overflow-scroll">
        {chat?.count === 0 && (
          <p className="text-sm mb-4 text-center">
            There are no chat messages. Be the first one to chime in!
          </p>
        )}

        {chat?.data.map((message, idx) => {
          const isAdmin = config.admins.includes(message.user.username);

          return (
            <div
              className={classNames("chat chat-start", {
                "chat--admin": isAdmin,
              })}
              key={idx}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={getAvatarUrl(message.user.username)}
                    className="h-8 w-8 rounded-full bg-gray-300"
                  />
                </div>
              </div>
              <div className="chat-header flex items-center space-x-1">
                {isAdmin && (
                  <span>
                    <IconCrown className="w-5 h-5" />
                  </span>
                )}
                <span>{message.user.username}</span>
              </div>
              <div className="chat-bubble">{message.content}</div>
              <div className="chat-footer">
                {relativeDate(message.created_at)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2">
        <CommentInput gameId={gameId} />
      </div>
    </>
  );
}
