import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { CardType } from "@deal/types";
import BaseModal from "./BaseModal";

interface DiscardCardModalProps {
  card: CardType;
  onDiscard: (card: CardType) => void;
}

const DiscardCardModal = NiceModal.create(
  ({ card, onDiscard }: DiscardCardModalProps) => {
    const modal = useModal();

    const onClose = () => {
      modal.hide();

      // Wait for the animation to fully close and then remove from DOM
      setTimeout(() => {
        modal.remove();
      }, 200);
    };

    const discardCard = () => {
      onDiscard(card);
      onClose();
    };

    return (
      <BaseModal heading={card.name} show={modal.visible} onClose={onClose}>
        <div className="p-5">
          <img
            src={`/cards/${card.id}.jpeg`}
            className="w-[100px] mx-auto mb-4"
          />
          {card.description && (
            <p className="text-sm text-center mb-4">{card.description}</p>
          )}
          <button
            type="button"
            onClick={discardCard}
            className="rounded-md w-full bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-900 hover:bg-gray-800/80"
          >
            Discard Card
          </button>
        </div>
      </BaseModal>
    );
  }
);

export default DiscardCardModal;
