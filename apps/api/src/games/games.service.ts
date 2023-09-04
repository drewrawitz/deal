import { Injectable } from '@nestjs/common';
import { CardsService } from '../cards/cards.service';
import { CurrentUser } from '@deal/types';
import { Game } from '@deal/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
    private cardsService: CardsService,
  ) {}

  async createGame(user: CurrentUser) {
    const cards = await this.cardsService.getShuffledDeck();
    const game = this.gameRepo.create({
      players: [
        {
          player_id: user.user_id,
          position: 1,
        },
      ],
    });

    const savedGame = await this.gameRepo.save(game);

    return {
      user,
      savedGame,
      length: cards.length,
      cards,
    };
  }
}
