import type { CardType, GameProperties } from "@deal/types";
import Cards from "./data/cards.json";

export function getCardById(card_id: number): CardType | undefined {
  return Cards.find((card: any) => card.id === card_id) as CardType;
}

export function groupByColor(data: GameProperties[]): GameProperties[][] {
  const grouped: { [key: string]: GameProperties[] } = data.reduce(
    (acc: { [key: string]: GameProperties[] }, curr) => {
      if (!acc[curr.color]) {
        acc[curr.color] = [];
      }
      acc[curr.color].push(curr);
      return acc;
    },
    {}
  );

  return Object.values(grouped);
}
