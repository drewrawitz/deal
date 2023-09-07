import { Injectable } from '@nestjs/common';
import { Cards } from '@deal/models';

@Injectable()
export class CardsService {
  private cards = Cards;

  getShuffledDeck(): number[] {
    // Duplicate each card according to its deck_quantity
    const deck: number[] = [];
    for (const card of this.cards) {
      for (let i = 0; i < card.deck_quantity; i++) {
        deck.push(card.id);
      }
    }

    // Shuffle the resulting list of cards
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]]; // swap elements
    }

    return deck;
  }

  getCardById(card_id: number) {
    return this.cards.find((card) => card.id === card_id);
  }
}
