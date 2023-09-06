import { Cards, Properties } from '@deal/models';
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
  private cards = Cards;
  private properties = Properties;

  constructor(initialState: GameState) {
    this.gameState = initialState;
  }

  private getCardById(card_id: number) {
    return this.cards.find((card) => card.id === card_id);
  }

  private getPropertyColor(card_id: number) {
    const find = this.properties.find((property) =>
      property.cards.includes(card_id),
    );

    return find?.color;
  }

  private calculateSets(player_id: string) {
    const player = this.gameState.players[player_id];
    const { board } = player;
    const sets: Record<string, number[]> = {};

    for (const property of this.properties) {
      // Get all valid cards for a property (both specific and wildcards)
      const validCards = [...property.cards, ...property.wildcards];

      // Filter the player's properties to get cards of the current color
      const playerCardsOfColor = board
        .filter((prop) => validCards.includes(prop.card))
        .map((prop) => prop.card);

      if (playerCardsOfColor.length > 0) {
        console.log({ playerCardsOfColor, cards: property.cards });
      }

      // Check if player has enough cards to form a set
      if (playerCardsOfColor.length >= property.cards.length) {
        sets[property.color] = playerCardsOfColor;
      }
    }

    player.sets = sets;
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
          board: [],
          sets: [],
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

    if (['property', 'wildcard'].includes(card.type)) {
      const color = this.getPropertyColor(card.id) ?? event.data.color;

      this.gameState.players[event.player_id].board.push({
        color,
        card: card.id,
      });
    }

    this.calculateSets(event.player_id);

    // Increment the number of actions taken
    this.gameState.currentTurn.actionsTaken++;
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
