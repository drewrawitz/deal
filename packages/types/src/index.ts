import { GameEvents, Game } from "@deal/models";

export interface ListGamesResponse extends Game {}

export enum GameStatus {
  WAITING = "waiting",
  IN_PROGRESS = "in_progress",
  ABANDONDED = "abandoned",
  FINISHED = "finished",
}

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
  player_id: string;
  data: {
    cardsDrawn: number[];
  };
}

export interface BankEvent {
  event_type: "bank";
  player_id: string;
  data: {
    card: number;
    value: number;
  };
}

export interface PlayEvent {
  event_type: "play";
  player_id: string;
  data: {
    card: number;
    color?: string;
  };
}

export interface PlayerTurnEvent {
  event_type: "playerTurn";
  data: {
    player_id: string;
  };
}

type SpecificGameEvent =
  | ShuffleEvent
  | DealEvent
  | PlayerTurnEvent
  | DrawEvent
  | BankEvent
  | PlayEvent;

export type TypedGameEvent = Omit<GameEvents, "data" | "event_type"> &
  SpecificGameEvent;

type GameProperties = {
  color: string;
  card: number;
};

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
      board: GameProperties[];
      sets: any;
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
