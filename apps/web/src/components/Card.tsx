import NiceModal from "@ebay/nice-modal-react";
import { classNames, getCardById } from "@deal/utils-client";
import { GameActionBodyDto } from "@deal/dto";
import React from "react";
import CardActionModal from "./modals/CardActionModal";
import { CardType } from "@deal/types";
import DiscardCardModal from "./modals/DiscardCardModal";
import { useGameEngine } from "../providers/game.context";

interface CardProps {
  card: number;
  display?: "set" | "default";
  onCardAction?: (data: GameActionBodyDto) => void;
  onPayDues?: (card: number) => void;
  mustDiscard?: boolean;
  isFlipped?: boolean;
}

const Card: React.FC<CardProps> = ({
  card,
  display = "default",
  mustDiscard = false,
  isFlipped = false,
  onCardAction,
  onPayDues,
}) => {
  const { state } = useGameEngine();
  const data = getCardById(card);

  if (!data) {
    console.error(`Card ${card} not found`);
    return;
  }

  const onPlayAction = (
    card: CardType,
    isFlipped: boolean,
    playerId?: string
  ) => {
    if (!onCardAction) return;

    onCardAction({
      action: "placeCard",
      data: {
        card: card.id,
        placement: "board",
        isFlipped,
        ...(playerId && {
          targetPlayerId: playerId,
        }),
      },
    });
  };

  const onAddToBank = (card: CardType) => {
    if (!onCardAction) return;

    onCardAction({
      action: "placeCard",
      data: {
        card: card.id,
        placement: "bank",
      },
    });
  };

  const onDiscard = (card: CardType) => {
    if (!onCardAction) return;

    onCardAction({
      action: "discard",
      data: {
        card: card.id,
      },
    });
  };

  const showActionModal = () => {
    NiceModal.show(CardActionModal, {
      card: data,
      state,
      onPlayAction,
      onAddToBank,
    });
  };

  const showDiscardModal = () => {
    NiceModal.show(DiscardCardModal, {
      card: data,
      onDiscard,
    });
  };

  const onClickCard = () => {
    if (onPayDues) {
      onPayDues(data.id);
      return;
    }

    if (!onCardAction) return;

    // If the player must discard a card, then show the discard modal
    if (mustDiscard) {
      showDiscardModal();
    } else if (data.type === "money") {
      onCardAction({
        action: "placeCard",
        data: {
          card: data.id,
          placement: "bank",
        },
      });
    } else {
      showActionModal();
    }
  };

  return (
    <button onClick={onClickCard}>
      <img
        src={`/cards/${card}.jpeg`}
        className={classNames(display === "set" && "max-w-[80px]", {
          "rotate-180": isFlipped,
        })}
      />
    </button>
  );
};

export default Card;
