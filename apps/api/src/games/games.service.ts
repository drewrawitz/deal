import { Injectable } from '@nestjs/common';
import { CardsService } from '../cards/cards.service';

@Injectable()
export class GamesService {
  constructor(private cardsService: CardsService) {}

  async createGame() {
    const cards = await this.cardsService.getShuffledDeck();

    return {
      length: cards.length,
      cards,
    };
  }
}
