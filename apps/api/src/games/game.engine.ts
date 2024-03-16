import { Cards, Properties, Wildcards } from '@deal/models';
import {
  BankEvent,
  CardType,
  DealEvent,
  DealToPlayer,
  DiscardEvent,
  DrawEvent,
  GameState,
  PayDuesEvent,
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
  private wildcards = Wildcards;

  constructor(user_id: string, initialState: GameState) {
    this.currentUserId = user_id;
    this.gameState = initialState;
  }

  private getCardById(card_id: number): CardType | undefined {
    return this.cards.find((card) => card.id === card_id);
  }

  private getPropertyColor(card_id: number, isFlipped: boolean) {
    const find = this.properties.find((property) =>
      property.cards.includes(card_id),
    );

    if (find) {
      return find.color;
    }

    const wild = this.wildcards[card_id];
    if (wild) {
      return isFlipped ? wild.flipped : wild.primary;
    }

    return undefined;
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
          bankValue: 0,
          boardValue: 0,
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

  private addCardToBoard(
    playerId: string,
    cardId: number,
    color = null,
    isFlipped = false,
  ) {
    const card = this.getCardById(cardId);
    const propertyColor = this.getPropertyColor(card.id, isFlipped) ?? color;

    this.gameState.players[playerId].board.push({
      color: propertyColor,
      card: card.id,
      isFlipped,
    });
    this.gameState.players[playerId].boardValue += card.value;
  }

  private addCardToBank(playerId: string, cardId: number) {
    const card = this.getCardById(cardId);

    // Add the card to the bank pile
    this.gameState.players[playerId].bank.push(cardId);
    this.gameState.players[playerId].bankValue += card.value;
  }

  private handleBankEvent(event: BankEvent) {
    // Add the card to the bank and calculate the value
    this.addCardToBank(event.player_id, event.data.card);

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
      case 'birthday':
        this.gameState.waitingForPlayers = {
          owner: event.player_id,
          card: card.id,
          moneyOwed: card.value,
          progress: Object.keys(this.gameState.players)
            .filter((p) => p !== event.player_id)
            .reduce((acc, player) => {
              acc[player] = {
                cards: [],
                value: 0,
                isComplete: false,
              };
              return acc;
            }, {}),
        };
        break;

      case 'debt_collector':
        this.gameState.waitingForPlayers = {
          owner: event.player_id,
          card: card.id,
          moneyOwed: card.charge_amount ?? 0,
          progress: {
            [event.data.targetPlayerId]: {
              cards: [],
              value: 0,
              isComplete: false,
            },
          },
        };
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

  private removeCardFromBank(cardId: number, playerId: string) {
    const card = this.getCardById(cardId);
    const player = this.gameState.players[playerId];

    if (!player) {
      throw new Error(`Player not found`);
    }

    const playerBank = player.bank;
    const newPlayerBank = playerBank.filter((c) => c !== cardId);

    player.bank = newPlayerBank;
    player.bankValue -= card.value;
  }

  private handlePayDuesEvent(event: PayDuesEvent) {
    const { waitingForPlayers, players } = this.gameState;
    if (!waitingForPlayers) {
      return;
    }

    const card = this.getCardById(event.data.card);
    if (!card) {
      throw new Error(`Card ${event.data.card} not found`);
    }

    // Handling card payment from bank
    if (event.data.from === 'bank') {
      this.removeCardFromBank(card.id, event.player_id);
      waitingForPlayers.progress[event.player_id].value += card.value;
    }

    // TODO: Allow players to pay from their board
    if (event.data.from === 'board') {
      // coming soon
    }

    // Transfer the card to the requester
    this.addCardToBank(waitingForPlayers.owner, card.id);

    const playerProgress = waitingForPlayers.progress[event.player_id];
    const player = players[event.player_id];
    const moneyOwed = waitingForPlayers.moneyOwed - playerProgress.value;
    const hasEnoughMoney = player.bankValue + player.boardValue >= moneyOwed;

    // Update completion status based on the current payment or player's total worth
    if (
      playerProgress.value >= waitingForPlayers.moneyOwed ||
      !hasEnoughMoney
    ) {
      playerProgress.isComplete = true;
    }

    // Finalize if all dues have been paid or if any player can no longer pay
    const allDuesPaid = Object.values(waitingForPlayers.progress).every(
      (progress) => progress.isComplete,
    );

    if (allDuesPaid) {
      this.gameState.waitingForPlayers = null;
    }
  }

  private handleDiscardEvent(event: DiscardEvent) {
    const card = this.getCardById(event.data.card);

    if (!card) {
      throw new Error(`Card ${event.data.card} not found`);
    }

    // Remove from hand
    this.removeCardFromHand(event.data.card, event.player_id);
  }

  private handlePlayEvent(event: PlayEvent) {
    const card = this.getCardById(event.data.card);
    const { isFlipped } = event.data;
    console.log('handle play event', event);

    if (!card) {
      throw new Error(`Card ${event.data.card} not found`);
    }

    if (['property', 'wildcard'].includes(card.type)) {
      this.addCardToBoard(
        event.player_id,
        card.id,
        event.data.color,
        isFlipped,
      );
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
      case 'discard':
        this.handleDiscardEvent(event);
        break;
      case 'payDues':
        this.handlePayDuesEvent(event);
        break;
    }
  }

  // Getter for the game state
  get state(): GameState {
    return this.gameState;
  }
}
