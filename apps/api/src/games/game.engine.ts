import { Cards, Properties } from '@deal/models';
import {
  BankEvent,
  CardType,
  DealEvent,
  DealToPlayer,
  DrawEvent,
  GameState,
  PlayEvent,
  PlayerTurnEvent,
  ShuffleEvent,
  TypedGameEvent,
} from '@deal/types';

export class GameEngine {
  private gameState: GameState;
  private currentUserId: string;
  private cards = Cards;
  private properties = Properties;

  constructor(user_id: string, initialState: GameState) {
    this.currentUserId = user_id;
    this.gameState = initialState;
  }

  private getCardById(card_id: number): CardType | undefined {
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
    const NUM_CARDS = 5;
    const numberOfPlayers = Object.keys(event.data.dealtCards).length;
    const cardsDealt = numberOfPlayers * NUM_CARDS;

    this.gameState.deck.splice(0, cardsDealt);

    if (event.data?.dealtCards[this.currentUserId]) {
      this.gameState.myHand = event.data.dealtCards[this.currentUserId].cards;
    }

    // Assign cards to players based on the event data.
    for (const [playerId, user] of Object.entries(event.data?.dealtCards) as [
      string,
      DealToPlayer,
    ][]) {
      const player = this.gameState[playerId];
      const { username } = user;

      if (player) {
        player.username = username;
        player.numCards = NUM_CARDS;
      } else {
        this.gameState.players[playerId] = {
          username,
          bank: [],
          board: [],
          sets: [],
          numCards: NUM_CARDS,
        };
      }
    }
  }

  private handlePlayerTurnEvent(event: PlayerTurnEvent) {
    this.gameState.currentTurn.player_id = event.data.player_id;
    this.gameState.currentTurn.actionsTaken = 0;
    this.gameState.currentTurn.hasDrawnCards = false;

    // Get username from player ID
    const username = this.gameState.players[event.data.player_id].username;
    this.gameState.currentTurn.username = username;
  }

  private handleDrawEvent(event: DrawEvent) {
    this.gameState.deck.splice(0, event.data.cardsDrawn.length);
    this.gameState.players[event.player_id].numCards +=
      event.data.cardsDrawn.length;

    if (event.player_id === this.currentUserId) {
      this.gameState.myHand.push(...event.data.cardsDrawn);
    }

    this.gameState.currentTurn.hasDrawnCards = true;
  }

  private handleBankEvent(event: BankEvent) {
    // Add the card to the bank pile
    this.gameState.players[event.player_id].bank.push(event.data.card);

    // Remove from hand
    this.removeCardFromHand(event.data.card, event.player_id);

    // Increment the number of actions taken
    this.gameState.currentTurn.actionsTaken++;
  }

  private handleActionCards(card: CardType, event: PlayEvent) {
    switch (card.slug) {
      case 'pass_go':
        const CARDS_TO_DRAW = 2;
        const cardsDrawn = this.gameState.deck.splice(0, CARDS_TO_DRAW);

        if (event.player_id === this.currentUserId) {
          this.gameState.myHand.push(...cardsDrawn);
        }

        this.gameState.players[event.player_id].numCards += CARDS_TO_DRAW;
        break;
    }
  }

  private removeCardFromHand(cardId: number, playerId: string) {
    if (playerId === this.currentUserId) {
      // Find the index of the first occurrence of the card in the user's hand
      const cardIndex = this.gameState.myHand.indexOf(cardId);

      // If the card is found, remove it from the hand
      if (cardIndex !== -1) {
        this.gameState.myHand.splice(cardIndex, 1);
      }
    }

    // Decrement the number of cards in the player's hand
    this.gameState.players[playerId].numCards--;
  }

  private handlePlayEvent(event: PlayEvent) {
    const card = this.getCardById(event.data.card);

    if (!card) {
      throw new Error(`Card ${event.data.card} not found`);
    }

    if (['property', 'wildcard'].includes(card.type)) {
      const color = this.getPropertyColor(card.id) ?? event.data.color;
      console.log('get color', color);

      this.gameState.players[event.player_id].board.push({
        color,
        card: card.id,
      });
    } else {
      // Add the card to the discard pile
      this.gameState.discardPile.push(event.data.card);
    }

    // Handle individual cards
    this.handleActionCards(card, event);

    // Increment the number of actions taken
    this.gameState.currentTurn.actionsTaken++;

    // Remove from hand
    this.removeCardFromHand(event.data.card, event.player_id);

    // Calculate if a player has formed a set
    this.calculateSets(event.player_id);
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
