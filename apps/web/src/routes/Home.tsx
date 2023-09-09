import { useState, useEffect } from "react";
import { socket } from "../socket";
import { useGamesQuery } from "@deal/hooks";

function Home() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  //   const [games, setGames] = useState<any>([]);
  const { data: games } = useGamesQuery();

  console.log({ games });

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onNewGame(value: any) {
      console.log("NEW GAME!!", value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("game.created", onNewGame);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("game.created", onNewGame);
    };
  }, []);

  console.log({ isConnected });

  return (
    <>
      <div>
        Homepage
        <br />
        <br />
        okay!
        <br />
        <br />
        Homepage
        <br />
        <br />
        okay!
        <br />
        <br />
        Homepage
        <br />
        <br />
        okay!
        <br />
        <br />
        Homepage
        <br />
        <br />
        okay!
        <br />
        <br />
        Homepage
        <br />
        <br />
        okay!
        <br />
        <br />
      </div>
    </>
  );
}

export default Home;
