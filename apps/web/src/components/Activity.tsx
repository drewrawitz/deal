import { classNames, getCardById } from "@deal/utils-client";
import { useGameActivityQuery, useGameStateQuery } from "@deal/hooks";
import { useEffect, useMemo, useRef } from "react";
import type { GameActivityResponse } from "@deal/types";
import { useParams } from "react-router-dom";

export default function Activity() {
  const { gameId } = useParams();
  const { data: activity } = useGameActivityQuery(Number(gameId));
  const { data: state } = useGameStateQuery(Number(gameId));
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredActivity = useMemo(
    () =>
      activity?.filter(
        (a) => !["shuffle", "deal", "playerTurn"].includes(a.action)
      ) ?? [],
    [activity]
  );

  const getUsernameFromId = (playerId: string) => {
    return state?.players?.[playerId]?.username;
  };

  const descriptions = (activity: GameActivityResponse) => {
    const card = activity.data?.card ? getCardById(activity.data.card) : null;

    const getPlayCardDescription = () => {
      const conditions = [
        {
          cond: card?.slug === "debt_collector",
          description: `charges ${getUsernameFromId(
            activity.data?.targetPlayerId
          )} 5M`,
        },
        {
          cond: true,
          description: "plays a card",
        },
      ];

      const find = conditions.find((c) => c.cond);

      return find?.description ?? "-";
    };

    const mapping: Record<string, string> = {
      bank: `banks a card (${activity.data?.value}M)`,
      draw: `draws ${activity.data?.cardsDrawn} cards`,
      end: `ends turn`,
      play: getPlayCardDescription(),
      discard: `discards a card`,
      payDues: `pays with`,
    };

    const defaultDescription = activity.action;

    return mapping[activity.action] || defaultDescription;
  };

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  }, [filteredActivity.length]);

  return (
    <div ref={scrollRef} className="max-h-[500px] overflow-y-auto p-1">
      <ul role="list" className="space-y-6">
        {filteredActivity.map((activityItem, activityItemIdx) => (
          <li key={activityItem.sequence} className="relative flex gap-x-4">
            <div
              className={classNames(
                activityItemIdx === filteredActivity.length - 1
                  ? "h-6"
                  : "-bottom-6",
                "absolute left-0 top-0 flex w-6 justify-center"
              )}
            >
              <div className="w-px bg-gray-200" />
            </div>

            <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
              <div className="h-6 w-6 text-xs font-semibold flex items-center justify-center rounded-full bg-gray-100 ring-1 ring-gray-300">
                {activityItemIdx + 1}
              </div>
            </div>
            <div className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
              <div>
                <span className="font-medium text-gray-900">
                  {activityItem.username}
                </span>{" "}
                {descriptions(activityItem)}
              </div>

              {activityItem.data?.card && (
                <img
                  src={`/cards/${activityItem.data?.card}.jpeg`}
                  className={classNames("max-w-[40px] mt-2", {
                    "rotate-180": activityItem.data?.isFlipped,
                  })}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
