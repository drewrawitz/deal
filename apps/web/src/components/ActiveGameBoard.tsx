import { classNames, getAvatarUrl, groupByColor } from "@deal/utils-client";
import Activity from "./Activity";
import Layout from "../Layout";
import Section from "./Section";
import Chat from "./Chat";
import {
  useAuthQuery,
  useGameStateQuery,
  useGamesMutations,
} from "@deal/hooks";
import { useEffect, useState } from "react";
import { handleError } from "../utils/shared";
import { socket } from "../socket";
import Card from "./Card";
import { GameActionBodyDto } from "@deal/dto";
import { useQueryClient } from "@tanstack/react-query";

interface ActiveGameBoardProps {
  gameId: number;
}

const MAX_ACTIONS = 3;

export default function ActiveGameBoard(props: ActiveGameBoardProps) {
  const { gameId } = props;
  const queryClient = useQueryClient();
  const { data: state, isInitialLoading } = useGameStateQuery(gameId);
  const { data: currentUser } = useAuthQuery();
  const { gameActionMutation } = useGamesMutations();
  const [isProcessing, setProcessing] = useState(false);

  useEffect(() => {
    const channel_action = `game.${gameId}.action`;

    function onGameAction() {
      queryClient.invalidateQueries(["game", gameId]);
    }

    socket.on(channel_action, onGameAction);

    return () => {
      socket.off(channel_action, onGameAction);
    };
  }, [currentUser]);

  const sendAction = async (body: GameActionBodyDto) => {
    try {
      setProcessing(true);
      await gameActionMutation.mutateAsync({
        game_id: gameId,
        body,
      });
    } catch (err) {
      handleError(err);
    } finally {
      setProcessing(false);
    }
  };

  const onClickDrawCards = async () => {
    return sendAction({
      action: "drawCards",
    });
  };

  const onClickEndTurn = async () => {
    return sendAction({
      action: "endTurn",
    });
  };

  const onCardAction = async (body: GameActionBodyDto) => {
    return sendAction(body);
  };

  if (isInitialLoading) {
    return <Layout heading="Loading...">&nbsp;</Layout>;
  }

  if (!state) {
    return "Game not found";
  }

  const isCurrentTurn = state.currentTurn?.username === currentUser?.username;
  const { hasDrawnCards, actionsTaken } = state.currentTurn;
  const hasTooManyCards = isCurrentTurn && state.myHand.length > 7;
  const mustDiscard = hasTooManyCards && actionsTaken === MAX_ACTIONS;
  const deckLength = state.deck.length;

  return (
    <Layout
      heading={`Game #${gameId}`}
      slot={
        <div className="flex items-center space-x-6">
          <div className="relative max-w-[70px]">
            <img src={`/cards/back.jpg`} />
            <span className="absolute bottom-0 left-0 text-center w-full bg-black bg-opacity-70 text-white font-semibold text-sm">
              {deckLength}
            </span>
          </div>
          {state.discardPile.length > 0 && (
            <div className="max-w-[70px]">
              <Card card={state.discardPile[state.discardPile.length - 1]} />
            </div>
          )}
          <div className="text-center space-y-2">
            <div className="font-mono text-xl text-white">
              {state.currentTurn?.username}
            </div>
            <div className="font-mono rounded-md bg-red-400 px-2 py-0.5 text-white">
              You're up!
            </div>
            <div className="flex items-center justify-center space-x-2">
              {Array.from({ length: MAX_ACTIONS }, (_, i) => {
                return state.currentTurn?.actionsTaken > i ? (
                  <span
                    key={i}
                    className="block h-5 w-5 rounded-full bg-red-400"
                  ></span>
                ) : (
                  <span
                    key={i}
                    className="block h-5 w-5 rounded-full border-2 border-red-400"
                  ></span>
                );
              })}
            </div>
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
                  const bankTotal = player.bankValue;
                  const sets = groupByColor(player.board);

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
                              Hand: {player.numCards ?? 0}
                            </span>
                          </div>
                          <div className="flex-1 flex items-start space-x-12">
                            {sets?.map((set, idx) => {
                              console.log(set);
                              return (
                                <div
                                  className={classNames(
                                    "flex p-1",
                                    set?.[0]?.color === "green" &&
                                      "bg-[#50B636]",
                                    set?.[0]?.color === "yellow" &&
                                      "bg-[#FEF200]",
                                    set?.[0]?.color === "light_blue" &&
                                      "bg-[#B6D6ED]",
                                    set?.[0]?.color === "blue" &&
                                      "bg-[#415CA1]",
                                    set?.[0]?.color === "pink" &&
                                      "bg-[#BD2978]",
                                    set?.[0]?.color === "orange" &&
                                      "bg-[#F09706]",
                                    set?.[0]?.color === "railroad" &&
                                      "bg-black",
                                    set?.[0]?.color === "brown" &&
                                      "bg-[#81471D]",
                                    set?.[0]?.color === "red" && "bg-[#CE0F12]"
                                  )}
                                  key={`${player.username}-${idx}`}
                                >
                                  {set.map((card, idx2) => {
                                    return (
                                      <Card
                                        key={idx2}
                                        card={card.card}
                                        isFlipped={card.isFlipped}
                                        display="set"
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
            <Section
              heading="My Hand"
              slot={
                <>
                  {!isCurrentTurn && (
                    <p className="text-sm text-gray-500">Waiting for turn...</p>
                  )}
                  {isCurrentTurn && !hasDrawnCards && (
                    <button
                      type="button"
                      onClick={onClickDrawCards}
                      disabled={isProcessing}
                      className="rounded-md bg-green-600 hover:bg-green-600/80 px-4 py-2 text-sm font-semibold text-white border-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Draw Cards
                    </button>
                  )}
                  {isCurrentTurn && hasDrawnCards && (
                    <button
                      type="button"
                      onClick={onClickEndTurn}
                      disabled={isProcessing}
                      className="rounded-md bg-red-600 hover:bg-red-600/80 px-4 py-2 text-sm font-semibold text-white border-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      End Turn
                    </button>
                  )}
                </>
              }
            >
              <ul className="grid grid-cols-7 gap-2">
                {state.myHand?.map((card, idx) => {
                  return (
                    <li key={idx}>
                      <Card
                        card={card}
                        onCardAction={isCurrentTurn ? onCardAction : undefined}
                        mustDiscard={mustDiscard}
                      />
                    </li>
                  );
                })}
              </ul>
            </Section>
            {currentUser && (
              <Section
                heading={`My Bank (${
                  state.players[currentUser.user_id].bankValue
                }M)`}
              >
                <ul className="grid grid-cols-7 gap-2">
                  {state.players[currentUser.user_id].bank?.map((card, idx) => {
                    return (
                      <li key={idx}>
                        <Card card={card} />
                      </li>
                    );
                  })}
                </ul>
              </Section>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Section heading="Match History">
            <Activity />
          </Section>
          <Section heading="Match Chat">
            <Chat gameId={gameId} />
          </Section>
        </div>
      </div>
    </Layout>
  );
}
