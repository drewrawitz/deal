import { getAvatarUrl } from "@deal/utils-client";
import CommentInput from "./CommentInput";

export default function Chat() {
  const chat = [
    {
      username: "defekt7x",
      timestamp: "5 minutes ago",
      message: "Hopefully there's no drama in this chat!",
    },
    {
      username: "Ste",
      timestamp: "10 minutes ago",
      message: "This is a Chat message! Woohoo!!",
    },
    {
      username: "kimmy1285",
      timestamp: "1 hour ago",
      message:
        "this is the same thing i asked michael about months ago but didnt know what it was when somoene had 90 wins but only played 2 games nd michael didnt wan tto look into it...",
    },
  ];

  return (
    <>
      {chat.map((message, idx) => {
        return (
          <div className="chat chat-start" key={idx}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  src={getAvatarUrl(message.username)}
                  className="h-8 w-8 rounded-full bg-gray-300"
                />
              </div>
            </div>
            <div className="chat-header">{message.username}</div>
            <div className="chat-bubble">{message.message}</div>
            <div className="chat-footer">{message.timestamp}</div>
          </div>
        );
      })}
      <div>
        <CommentInput />
      </div>
    </>
  );
}
