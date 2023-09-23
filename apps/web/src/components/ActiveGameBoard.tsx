import { classNames, getAvatarUrl } from "@deal/utils-client";
import Activity from "./Activity";
import Layout from "../Layout";
import Section from "./Section";
import Chat from "./Chat";
import { useGameStateQuery } from "@deal/hooks";

interface ActiveGameBoardProps {
  gameId: number;
}

// const players = [
//   {
//     username: "defekt7x",
//     hand: 3,
//     bank: 5,
//     isCurrentPlayer: true,
//     sets: [
//       [
//         {
//           color: "brown",
//           image: "/brown-property-card.jpeg",
//           card: 1,
//         },
//         {
//           color: "brown",
//           image: "/brown-property-card.jpeg",
//           card: 1,
//         },
//       ],
//       [
//         {
//           color: "red",
//           image: "/red-property-card.jpeg",
//           card: 1,
//         },
//         {
//           color: "red",
//           image: "/red-property-card.jpeg",
//           card: 1,
//         },
//         {
//           color: "red",
//           image: "/prop-wild.jpeg",
//           card: 1,
//         },
//       ],
//     ],
//   },
//   {
//     username: "kimmy1285",
//     hand: 6,
//     bank: 2,
//     isCurrentPlayer: false,
//   },
//   {
//     username: "DASdealer",
//     hand: 7,
//     bank: 0,
//     isCurrentPlayer: false,
//   },
// ];

export default function ActiveGameBoard(props: ActiveGameBoardProps) {
  const { gameId } = props;
  const { data: state, isFetching } = useGameStateQuery(gameId);
  console.log({ state });

  if (isFetching) {
    return <Layout heading="Loading...">&nbsp;</Layout>;
  }

  if (!state) {
    return "Game not found";
  }

  return (
    <Layout
      heading={`Game #${gameId}`}
      slot={
        <div className="text-center space-y-2">
          <div className="font-mono text-xl text-white">
            {state.currentTurn?.username}
          </div>
          <div className="font-mono rounded-md bg-red-400 px-2 py-0.5 text-white">
            You're up!
          </div>
          <div className="flex items-center justify-center space-x-2">
            {Array.from({ length: 3 }, (_, i) => {
              return state.currentTurn?.actionsTaken > i ? (
                <span className="block h-5 w-5 rounded-full bg-red-400"></span>
              ) : (
                <span
                  key={i}
                  className="block h-5 w-5 rounded-full border-2 border-red-400"
                ></span>
              );
            })}
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <div className="space-y-8">
            <Section heading="Game Board">
              <div className="divide-y-2 divide-[#ADC4D7]/60">
                {Object.values(state.players).map((player) => {
                  const isCurrentPlayer =
                    state.currentTurn?.username === player.username;
                  const bankTotal = 0;
                  console.log(player.bank);

                  return (
                    <div key={player.username}>
                      <div
                        className={classNames(
                          "space-y-3 p-4",
                          isCurrentPlayer ? "bg-[#ADC4D7]/30" : "bg-white"
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
                                {bankTotal}M
                              </span>
                            </div>
                            <span className="inline-block bg-blue-500 rounded-md text-white px-2 py-1">
                              {player.username}
                            </span>
                            <span className="block">
                              Hand: {player.hand.length}
                            </span>
                          </div>
                          <div className="flex-1 flex items-start space-x-12">
                            {/* {player.sets?.map((set, idx) => {
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
                                  key={`${player.username}-${idx}`}
                                >
                                  {set.map((card, idx2) => {
                                    return (
                                      <img
                                        key={idx2}
                                        src={card.image}
                                        className="max-w-[50px]"
                                      />
                                    );
                                  })}
                                </div>
                              );
                            })} */}
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
            <Chat gameId={gameId} />
          </Section>
        </div>
      </div>
    </Layout>
  );
}
