import { Card } from '@deal/models';
import {
  BankEvent,
  DealEvent,
  DrawEvent,
  GameState,
  PlayEvent,
  PlayerTurnEvent,
  ShuffleEvent,
  TypedGameEvent,
} from '@deal/types';

export class GameEngine {
  private gameState: GameState;
  private cardsData: Card[];

  constructor(initialState: GameState, cards?: Card[]) {
    this.gameState = initialState;
    this.cardsData = cards;
  }

  private getCardById(card_id: number) {
    return this.cardsData.find((card) => card.id === card_id);
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
    this.gameState.currentTurn.hasDrawnCards = false;
  }

  private handleDrawEvent(event: DrawEvent) {
    this.gameState.deck.splice(0, event.data.cardsDrawn.length);
    this.gameState.players[event.player_id].hand.push(...event.data.cardsDrawn);
    this.gameState.currentTurn.hasDrawnCards = true;
  }

  private handleBankEvent(event: BankEvent) {
    // Add the card to the bank pile
    this.gameState.players[event.player_id].bank.push(event.data.card);

    // Find the index of the first occurrence of the card in the user's hand
    const cardIndex = this.gameState.players[event.player_id].hand.indexOf(
      event.data.card,
    );

    // If the card is found, remove it from the hand
    if (cardIndex !== -1) {
      this.gameState.players[event.player_id].hand.splice(cardIndex, 1);
    }

    // Increment the number of actions taken
    this.gameState.currentTurn.actionsTaken++;
  }

  private handlePlayEvent(event: PlayEvent) {
    const card = this.getCardById(event.data.card);

    if (!card) {
      throw new Error(`Card ${event.data.card} not found`);
    }

    if (card.type === 'property') {
      console.log('PROP!!');
    }
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
      case 'bank':
        this.handleBankEvent(event);
        break;
      case 'play':
        this.handlePlayEvent(event);
        break;
    }
  }

  // Getter for the game state
  get state(): GameState {
    return this.gameState;
  }
}
