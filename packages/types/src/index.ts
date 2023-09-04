import { GameEvents } from "@deal/models";

export interface CurrentUser {
  account_id: string;
  email: string;
  user_id: string;
  username: string;
}

export interface ShuffleEvent {
  event_type: "shuffle";
  data: {
    cards: number[];
  };
}

export interface DealEvent {
  event_type: "deal";
  data: {
    remainingDeck: number[];
    dealtCards: Record<string, number[]>;
  };
}

export interface DrawEvent {
  event_type: "draw";
  data: {
    cardsDrawn: number[];
  };
}

export interface PlayerTurnEvent {
  event_type: "playerTurn";
  data: {
    player_id: string;
  };
}

type SpecificGameEvent = ShuffleEvent | DealEvent | PlayerTurnEvent | DrawEvent;

export type TypedGameEvent = Omit<GameEvents, "data" | "event_type"> &
  SpecificGameEvent;

export type GameState = {
  currentTurn: {
    player_id: string;
    actionsTaken: number;
    hasDrawnCards: boolean;
  };
  lastSequence: number;
  players: Record<
    string,
    {
      hand: number[];
      bank: number[];
    }
  >;
  deck: number[];
  discardPile: number[];
};

declare global {
  namespace Express {
    interface User extends CurrentUser {}
  }
}
