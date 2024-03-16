import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { CardType } from "@deal/types";
import BaseModal from "./BaseModal";
import { useRef, useState } from "react";
import { classNames } from "@deal/utils-client";
import { useAuthQuery, useGameStateQuery } from "@deal/hooks";

interface CardActionModalProps {
  card: CardType;
  gameId: number;
  onPlayAction: (card: CardType, isFlipped: boolean, playerId?: string) => void;
  onAddToBank: (card: CardType) => void;
}

const CardActionModal = NiceModal.create(
  ({ card, gameId, onPlayAction, onAddToBank }: CardActionModalProps) => {
    const modal = useModal();
    const selectedPlayerRef = useRef<HTMLSelectElement>(null);
    const { data: currentUser } = useAuthQuery();
    const { data: state } = useGameStateQuery(gameId);
    const [isFlipped, setFlipped] = useState(false);

    const players = (state?.players ? Object.entries(state.players) : []).map(
      ([value, user]) => ({
        label: user.username,
        value,
      })
    );
    const playersMinusCurrentUser = players.filter(
      (p) => p.value !== currentUser?.user_id
    );
    const mustSelectPlayer = (["debt_collector"] as string[]).includes(
      card.slug
    );

    const onClose = () => {
      modal.hide();

      // Wait for the animation to fully close and then remove from DOM
      setTimeout(() => {
        modal.remove();
      }, 200);
    };

    const playAction = () => {
      const playerId = selectedPlayerRef.current?.value;
      onPlayAction(card, isFlipped, playerId);
      onClose();
    };

    const addToBank = () => {
      onAddToBank(card);
      onClose();
    };

    const onClickFlipCard = () => {
      setFlipped(() => !isFlipped);
    };

    const canFlipCard = card.type === "wildcard";

    return (
      <BaseModal heading={card.name} show={modal.visible} onClose={onClose}>
        <div className="p-5">
          <img
            src={`/cards/${card.id}.jpeg`}
            className={classNames("w-[100px] mx-auto mb-4", {
              "rotate-180": isFlipped,
            })}
          />
          {canFlipCard && (
            <div className="text-center">
              <button
                className="text-sky-500 font-medium hover:underline text-sm mb-4"
                onClick={onClickFlipCard}
              >
                Flip Card
              </button>
            </div>
          )}
          {card.description && (
            <p className="text-sm text-center mb-4">{card.description}</p>
          )}
          {mustSelectPlayer && (
            <div className="mb-3">
              <label
                htmlFor="player"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Player
              </label>
              <div className="mt-2">
                <select
                  id="player"
                  name="player"
                  ref={selectedPlayerRef}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  {playersMinusCurrentUser.map((p) => {
                    return (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={playAction}
            className="rounded-md w-full bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-900 hover:bg-gray-800/80"
          >
            Play Action Card
          </button>
          <span className="block text-center text-sm my-2">or</span>
          <button
            type="button"
            onClick={addToBank}
            className="rounded-md w-full bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Add to Bank (${card.value}M)
          </button>
        </div>
      </BaseModal>
    );
  }
);

export default CardActionModal;
