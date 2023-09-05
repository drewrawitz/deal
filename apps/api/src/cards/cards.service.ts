import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '@deal/models';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async getShuffledDeck(): Promise<number[]> {
    // Fetch all cards from the database
    const cards = await this.cardRepository.find();

    // Duplicate each card according to its deck_quantity
    const deck: number[] = [];
    for (const card of cards) {
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

  async getCardById(card_id: number) {
    return await this.cardRepository.findOneBy({ id: card_id });
  }
}
