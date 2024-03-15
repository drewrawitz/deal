import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { CardType } from "@deal/types";
import BaseModal from "./BaseModal";
import { useState } from "react";
import { classNames } from "@deal/utils-client";

interface CardActionModalProps {
  card: CardType;
  onPlayAction: (card: CardType, isFlipped: boolean) => void;
  onAddToBank: (card: CardType) => void;
}

const CardActionModal = NiceModal.create(
  ({ card, onPlayAction, onAddToBank }: CardActionModalProps) => {
    const modal = useModal();
    const [isFlipped, setFlipped] = useState(false);

    const onClose = () => {
      modal.hide();

      // Wait for the animation to fully close and then remove from DOM
      setTimeout(() => {
        modal.remove();
      }, 200);
    };

    const playAction = () => {
      onPlayAction(card, isFlipped);
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
