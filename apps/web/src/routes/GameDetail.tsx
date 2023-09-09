import { classNames, getAvatarUrl } from "@deal/utils-client";
import Layout from "../Layout";
import Activity from "../components/Activity";
import Chat from "../components/Chat";
import Section from "../components/Section";

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
  return (
    <Layout
      heading="Game #123"
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
