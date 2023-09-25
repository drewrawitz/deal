import NiceModal from "@ebay/nice-modal-react";
import { Cards } from "@deal/utils-client";
import React from "react";
import CardActionModal from "./modals/CardActionModal";
import { CardType } from "@deal/types";

interface CardProps {
  card: number;
}

const Card: React.FC<CardProps> = ({ card }) => {
  const data = Cards.find((c) => c.id === card);

  if (!data) {
    console.error(`Card ${card} not found`);
    return;
  }

  const showActionModal = () => {
    NiceModal.show(CardActionModal, { card: data as CardType });
  };

  return (
    <button onClick={showActionModal}>
      <img src={`/cards/${card}.jpeg`} />
    </button>
  );
};

export default Card;
