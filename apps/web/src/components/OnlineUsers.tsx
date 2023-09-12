import { useAuthQuery } from "@deal/hooks";
import { socket } from "../socket";
import { useState, useEffect } from "react";

function OnlineUsers() {
  const { data: currentUser } = useAuthQuery();
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);

  useEffect(() => {
    function updateOnlineCount(count: number) {
      setOnlineUsersCount(count);
    }

    // Let the server know this is an authenticated user
    if (currentUser) {
      socket.emit("authenticated", currentUser.user_id);
    }

    socket.on("onlineCount", updateOnlineCount);

    return () => {
      socket.off("onlineCount", updateOnlineCount);
    };
  }, [currentUser]);

  return (
    <span className="text-green-600 font-medium">
      Online users: {onlineUsersCount}
    </span>
  );
}

export default OnlineUsers;
