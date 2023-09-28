import { GameProperties } from "@deal/types";

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
