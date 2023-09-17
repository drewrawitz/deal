import { useContext } from "react";
import { OnlineUsersContext } from "../providers/online-users.context";

export const useOnlineUsers = () => {
  const context = useContext(OnlineUsersContext);

  if (!context) {
    throw new Error(
      "useOnlineUsers must be used within an OnlineUsersProvider"
    );
  }

  return context;
};
