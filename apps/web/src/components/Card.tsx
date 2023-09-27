import NiceModal from "@ebay/nice-modal-react";
import { Cards } from "@deal/utils-client";
import { GameActionBodyDto } from "@deal/dto";
import React from "react";
import CardActionModal from "./modals/CardActionModal";
import { CardType } from "@deal/types";

interface CardProps {
  card: number;
  onCardAction?: (data: GameActionBodyDto) => void;
}

const Card: React.FC<CardProps> = ({ card, onCardAction }) => {
  const data = Cards.find((c) => c.id === card) as CardType;

  if (!data) {
    console.error(`Card ${card} not found`);
    return;
  }

  const onPlayAction = (card: CardType) => {
    if (!onCardAction) return;

    onCardAction({
      action: "placeCard",
      data: {
        card: card.id,
        placement: "board",
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

  const showActionModal = () => {
    NiceModal.show(CardActionModal, {
      card: data,
      onPlayAction,
      onAddToBank,
    });
  };

  const onClickCard = () => {
    if (!onCardAction) return;

    if (data.type === "money") {
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
      <img src={`/cards/${card}.jpeg`} />
    </button>
  );
};

export default Card;
