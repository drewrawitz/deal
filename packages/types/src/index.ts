import { GameEvents, Game, GamePlayers, User, Message } from "@deal/models";

export enum SoundTriggers {
  ENTER_ROOM = "ENTER_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  START_GAME = "START_GAME",
}

export interface CreateMessageReturn extends Message {}

export interface LoginParams {
  email: string;
  password: string;
}

export interface PlayerFields {
  id: User["id"];
  username: User["id"];
  avatar: User["avatar"];
}

export interface PaginatedResult<T> {
  data: T;
  count: number;
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  last_page: number;
}

export interface CreateGameResponse extends Game {}
export interface JoinGameResponse extends GamePlayers {}

export interface LeaveGameResponse {
  hasDeletedGame: boolean;
  success: boolean;
}

export type ListChatMessagesResponse = {
  content: Message["content"];
  created_at: Message["created_at"];
  user: PlayerFields;
};

export type ListGamesResponse = {
  id: Game["id"];
  status: Game["status"];
  created_at: Game["created_at"];
  started_at: Game["started_at"];
  players: {
    position: GamePlayers["position"];
    player: PlayerFields;
  }[];
  owner: PlayerFields;
};

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
