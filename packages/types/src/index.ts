import { GameEvents, Game, GamePlayers, User, Message } from "@deal/models";

export enum SoundTriggers {
  ENTER_ROOM = "ENTER_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  START_GAME = "START_GAME",
}

export interface CreateMessageReturn extends Message {}

export type CardType = {
  id: number;
  slug: string;
  name: string;
  description: string;
  type: "action" | "money" | "rent" | "wildcard" | "property";
  value: number;
  deck_quantity: number;
  charge_amount?: number;
  photo: string | null;
};

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

export interface DealToPlayer {
  username: string;
  cards: number[];
}

export interface DealEvent {
  event_type: "deal";
  data: {
    remainingDeck: number[];
    dealtCards: Record<string, DealToPlayer>;
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
    isFlipped?: boolean;
    targetPlayerId?: string;
    rentCharged?: number;
  };
}

export interface PlayerTurnEvent {
  event_type: "playerTurn";
  data: {
    player_id: string;
  };
}

export interface PayDuesEvent {
  event_type: "payDues";
  player_id: string;
  data: {
    card: number;
    value: number;
    from: "bank" | "board";
  };
}

export interface DiscardEvent {
  event_type: "discard";
  player_id: string;
  data: {
    card: number;
  };
}

type SpecificGameEvent =
  | ShuffleEvent
  | DealEvent
  | PlayerTurnEvent
  | DrawEvent
  | BankEvent
  | PlayEvent
  | DiscardEvent
  | PayDuesEvent;

export type TypedGameEvent = Omit<GameEvents, "data" | "event_type"> &
  SpecificGameEvent;

export type GameActivityResponse = {
  sequence: number;
  player_id: string | null;
  username: string | null;
  action: string;
  data: Record<string, any>;
};

export type GameProperties = {
  color: string;
  card: number;
  value: number;
  isFlipped?: boolean;
  rentCharged?: number;
};

export type GameState = {
  currentTurn: {
    player_id: string;
    username: string;
    actionsTaken: number;
    hasDrawnCards: boolean;
  };
  lastSequence: number;
  players: Record<
    string,
    {
      username: string;
      hand?: number[];
      bank: number[];
      board: GameProperties[];
      boardValue: number;
      bankValue: number;
      numCards: number;
      sets: any;
    }
  >;
  deck: number[];
  discardPile: number[];
  myHand: number[];
  waitingForPlayers: {
    owner: string;
    card: number;
    moneyOwed?: number;
    progress: Record<
      string,
      {
        value: number;
        isComplete: boolean;
      }
    >;
  } | null;
};

declare global {
  namespace Express {
    interface User extends CurrentUser {}
  }
}
