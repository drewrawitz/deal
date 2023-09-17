import React, { createContext, useState, useEffect } from "react";
import { useAuthQuery } from "@deal/hooks";
import { socket } from "../socket";

interface OnlineUsersProviderProps {
  children: React.ReactNode;
}

interface OnlineUsersContextProps {
  onlineUsersCount: number;
}

export const OnlineUsersContext = createContext<
  OnlineUsersContextProps | undefined
>(undefined);

export const OnlineUsersProvider: React.FC<OnlineUsersProviderProps> = ({
  children,
}) => {
  const { data: currentUser } = useAuthQuery();
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);

  useEffect(() => {
    function updateOnlineCount(count: number) {
      setOnlineUsersCount(count);
    }

    if (currentUser) {
      socket.emit("authenticated", currentUser.user_id);
    }

    socket.on("onlineCount", updateOnlineCount);

    return () => {
      socket.off("onlineCount", updateOnlineCount);
    };
  }, [currentUser]);

  return (
    <OnlineUsersContext.Provider value={{ onlineUsersCount }}>
      {children}
    </OnlineUsersContext.Provider>
  );
};
