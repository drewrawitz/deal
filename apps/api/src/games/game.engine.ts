import {
  DealEvent,
  DrawEvent,
  GameState,
  PlayerTurnEvent,
  ShuffleEvent,
  TypedGameEvent,
} from '@deal/types';

export class GameEngine {
  private gameState: GameState;

  constructor(initialState: GameState) {
    this.gameState = initialState;
  }

  // Event handlers
  private handleShuffleEvent(event: ShuffleEvent) {
    this.gameState.deck = event.data.cards;
  }

  private handleDealEvent(event: DealEvent) {
    const numberOfPlayers = Object.keys(event.data.dealtCards).length;
    const cardsDealt = numberOfPlayers * 5;

    this.gameState.deck.splice(0, cardsDealt);

    // Assign cards to players based on the event data.
    for (const [playerId, cards] of Object.entries(event.data?.dealtCards) as [
      string,
      number[],
    ][]) {
      const player = this.gameState[playerId];
      if (player) {
        player.hand = cards;
      } else {
        this.gameState.players[playerId] = {
          hand: cards,
          bank: [],
        };
      }
    }
  }

  private handlePlayerTurnEvent(event: PlayerTurnEvent) {
    this.gameState.currentTurn.player_id = event.data.player_id;
    this.gameState.currentTurn.actionsTaken = 0;
  }

  private handleDrawEvent(event: DrawEvent) {
    this.gameState.deck.splice(0, event.data.cardsDrawn.length);
    this.gameState.players[event.player_id].hand.push(...event.data.cardsDrawn);
    this.gameState.currentTurn.hasDrawnCards = true;
  }

  // Public method to apply an event
  applyEvent(event: TypedGameEvent) {
    this.gameState.lastSequence = event.sequence;

    switch (event.event_type) {
      case 'shuffle':
        this.handleShuffleEvent(event);
        break;
      case 'deal':
        this.handleDealEvent(event);
        break;
      case 'playerTurn':
        this.handlePlayerTurnEvent(event);
        break;
      case 'draw':
        this.handleDrawEvent(event);
        break;
    }
  }

  // Methods for other game actions, validations, etc.
  validatePlayerTurn(userId: string): boolean {
    console.log('validate player turn', userId);
    return true;
  }

  // Getter for the game state
  get state(): GameState {
    return this.gameState;
  }
}
