import toast from "react-hot-toast";
import { classNames, getAvatarUrl } from "@deal/utils-client";
import Layout from "../Layout";
import Activity from "../components/Activity";
import Chat from "../components/Chat";
import Section from "../components/Section";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthQuery, useGameQuery } from "@deal/hooks";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import AudioPlayer from "../components/AudioPlayer";
import { SoundTriggers } from "@deal/types";
import { soundFileMapping } from "../utils/config";
import JoinGameButton from "../components/JoinGameButton";
import KickPlayerButton from "../components/KickPlayerButton";
import { useQueryClient } from "@tanstack/react-query";
import StartGameButton from "../components/StartGameButton";

function NotFound() {
  return (
    <section>
      <div className="overflow-hidden rounded-lg bg-white shadow p-6">
        <p>This game was not found.</p>
      </div>
    </section>
  );
}

const players = [
  {
    username: "defekt7x",
    hand: 3,
    bank: 5,
    isCurrentPlayer: true,
    sets: [
      [
        {
          color: "brown",
          image: "/brown-property-card.jpeg",
          card: 1,
        },
        {
          color: "brown",
          image: "/brown-property-card.jpeg",
          card: 1,
        },
      ],
      [
        {
          color: "red",
          image: "/red-property-card.jpeg",
          card: 1,
        },
        {
          color: "red",
          image: "/red-property-card.jpeg",
          card: 1,
        },
        {
          color: "red",
          image: "/prop-wild.jpeg",
          card: 1,
        },
      ],
    ],
  },
  {
    username: "kimmy1285",
    hand: 6,
    bank: 2,
    isCurrentPlayer: false,
  },
  {
    username: "DASdealer",
    hand: 7,
    bank: 0,
    isCurrentPlayer: false,
  },
];

export default function GameDetail() {
  const { data: currentUser } = useAuthQuery();
  const { gameId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentSound, setCurrentSound] = useState<SoundTriggers | null>(null);
  const { data, refetch, isInitialLoading, isError } = useGameQuery(
    Number(gameId)
  );
  const canStartGame = data?.players?.length && data.players.length > 1;
  const isOwner = data?.owner?.id === currentUser?.user_id;

  const playSound = (sound: SoundTriggers) => {
    setCurrentSound(sound);
    setTimeout(() => setCurrentSound(null), 1000);
  };

  useEffect(() => {
    const channel_join = `game.${gameId}.players.join`;
    const channel_leave = `game.${gameId}.players.leave`;
    const channel_kicked = `game.${gameId}.players.kicked`;
    const channel_change = `game.${gameId}.change`;

    function onGameChange() {
      refetch();
    }

    function onPlayersJoin() {
      playSound(SoundTriggers.ENTER_ROOM);
      refetch();
    }

    function onPlayersLeave() {
      playSound(SoundTriggers.LEAVE_ROOM);
      refetch();
    }

    function onPlayersKicked(playerId: string) {
      if (currentUser?.user_id === playerId) {
        navigate("/games");
        toast("You have been kicked from the game.", {
          icon: "🚨",
        });
        queryClient.invalidateQueries(["games"]);
      }

      onPlayersLeave();
    }

    socket.on(channel_join, onPlayersJoin);
    socket.on(channel_leave, onPlayersLeave);
    socket.on(channel_kicked, onPlayersKicked);
    socket.on(channel_change, onGameChange);

    return () => {
      socket.off(channel_join, onPlayersJoin);
      socket.off(channel_leave, onPlayersLeave);
      socket.off(channel_kicked, onPlayersKicked);
      socket.off(channel_change, onGameChange);
    };
  }, [currentUser]);

  if (isError) {
    return (
      <Layout heading="Game Not Found">
        <NotFound />
      </Layout>
    );
  }

  if (isInitialLoading) {
    return <Layout heading="Loading...">&nbsp;</Layout>;
  }

  if (data?.status === "waiting") {
    return (
      <Layout
        heading={`Game #${gameId}`}
        slot={
          <div className="space-y-4 text-right">
            {canStartGame ? (
              <StartGameButton game={data} />
            ) : (
              <div className="font-mono rounded-md bg-blue-400 px-2 py-0.5 text-white">
                Waiting for players
              </div>
            )}
          </div>
        }
      >
        {currentSound && (
          <AudioPlayer
            soundFile={soundFileMapping[currentSound]}
            play={Boolean(currentSound)}
          />
        )}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="grid grid-cols-1 gap-4 lg:col-span-2">
            <div className="space-y-8">
              <Section
                heading="Game Lobby"
                slot={<JoinGameButton game={data} />}
              >
                <div className="grid grid-cols-5">
                  {Array.from({ length: 5 }, (_, i) => {
                    const findPlayer = data?.players?.find(
                      (p) => p.position === i + 1
                    );

                    return (
                      <div key={i} className="py-4">
                        <h4 className="text-lg font-semibold mb-2">
                          Seat {i + 1}
                        </h4>

                        {findPlayer ? (
                          <div>
                            <img
                              src={getAvatarUrl(findPlayer.player.username)}
                              alt={findPlayer.player.username}
                              className="h-8 w-8 rounded-full bg-gray-300"
                            />
                            <div className="truncate text-sm mt-1">
                              {findPlayer.player.username}
                            </div>
                            {findPlayer.player.id === data.owner.id ? (
                              <span className="text-xs bg-blue-800 text-white py-1 px-2 rounded-md">
                                Owner
                              </span>
                            ) : isOwner ? (
                              <KickPlayerButton
                                game={data}
                                player={findPlayer.player}
                              />
                            ) : null}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Empty</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Section heading="Match Chat">
              <Chat gameId={Number(gameId)} />
            </Section>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      heading={`Game #${gameId}`}
      slot={
        <div className="text-center space-y-2">
          <div className="font-mono text-xl text-white">defekt7x</div>
          <div className="font-mono rounded-md bg-red-400 px-2 py-0.5 text-white">
            You're up!
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="block h-5 w-5 rounded-full bg-red-400"></span>
            <span className="block h-5 w-5 rounded-full border-2 border-red-400"></span>
            <span className="block h-5 w-5 rounded-full border-2 border-red-400"></span>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <div className="space-y-8">
            <Section heading="Game Board">
              <div className="divide-y-2 divide-[#ADC4D7]/60">
                {players.map((player) => {
                  return (
                    <div key={player.username}>
                      <div
                        className={classNames(
                          "space-y-3 p-4",
                          player.isCurrentPlayer
                            ? "bg-[#ADC4D7]/30"
                            : "bg-white"
                        )}
                      >
                        <div className="flex space-x-12">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <img
                                src={getAvatarUrl(player.username)}
                                className="h-10 w-10 rounded-full bg-gray-300"
                              />
                              <span className="block font-mono text-4xl font-bold text-body">
                                {player.bank}M
                              </span>
                            </div>
                            <span className="inline-block bg-blue-500 rounded-md text-white px-2 py-1">
                              {player.username}
                            </span>
                            <span className="block">Hand: {player.hand}</span>
                          </div>
                          <div className="flex-1 flex items-start space-x-12">
                            {player.sets?.map((set, idx) => {
                              return (
                                <div
                                  className={classNames(
                                    "flex p-1",
                                    set?.[0]?.color === "brown"
                                      ? "bg-[#81471D]"
                                      : "",
                                    set?.[0]?.color === "red"
                                      ? "bg-[#CE0F12]"
                                      : ""
                                  )}
                                  key={idx}
                                >
                                  {set.map((card) => {
                                    return (
                                      <img
                                        key={card.card}
                                        src={card.image}
                                        className="max-w-[50px]"
                                      />
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
            <Section heading="My Hand">
              <div className="grid grid-cols-7 gap-2">
                <img src="/red-property-card.jpeg" />
                <img src="/brown-property-card.jpeg" />
                <img src="/5m.jpeg" />
                <img src="/rent-wild.jpeg" />
                <img src="/prop-wild.jpeg" />
              </div>
            </Section>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Section heading="Match History">
            <div className="max-h-[500px] overflow-y-scroll p-1">
              <Activity />
            </div>
          </Section>
          <Section heading="Match Chat">
            <Chat />
          </Section>
        </div>
      </div>
    </Layout>
  );
}
