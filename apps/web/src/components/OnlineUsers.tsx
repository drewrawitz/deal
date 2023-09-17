import { useOnlineUsers } from "../hooks/useOnlineUsers";

function OnlineUsers() {
  const { onlineUsersCount } = useOnlineUsers();

  return (
    <span className="text-green-600 font-medium">
      Online users: {onlineUsersCount}
    </span>
  );
}

export default OnlineUsers;
