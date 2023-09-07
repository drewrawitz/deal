import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { socket } from "./socket";
import viteLogo from "/vite.svg";
// import { useGamesQuery } from "@deal/hooks";
import "./App.css";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [games, setGames] = useState<any>([]);
  // const { data: games } = useGamesQuery();

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
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
