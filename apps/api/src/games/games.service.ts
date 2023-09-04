import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CardsService } from '../cards/cards.service';
import { CurrentUser } from '@deal/types';
import { Game, GameStatus, GameEvents } from '@deal/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
    @InjectRepository(GameEvents)
    private readonly eventsRepo: Repository<GameEvents>,
    private cardsService: CardsService,
  ) {}

  async createGame(user: CurrentUser) {
    const game = this.gameRepo.create({
      players: [
        {
          player_id: user.user_id,
          position: 1,
        },
      ],
    });

    return await this.gameRepo.save(game);
  }

  async startGame(game_id: number) {
    const game = await this.gameRepo
      .createQueryBuilder('game')
      .loadRelationCountAndMap('game.player_count', 'game.players')
      .where('game.id = :id', { id: game_id })
      .getOne();

    // Make sure this Game exists
    if (!game) {
      throw new NotFoundException();
    }

    // Make sure the Game has not already started
    if (game.status !== 'waiting') {
      throw new BadRequestException('Game has already started');
    }

    // Make sure the Game has at least 2 players joined
    if (game.player_count < 2) {
      throw new BadRequestException('Not enough players to start the game.');
    }

    // Shuffle the deck
    const cards = await this.cardsService.getShuffledDeck();

    // Run these DB events in a transaction
    return this.gameRepo.manager.transaction(
      async (transactionalEntityManager) => {
        // 1. Mark the game as in progress
        game.status = GameStatus.IN_PROGRESS;
        game.started_at = new Date();

        await transactionalEntityManager.save(Game, game);

        // 2. Create a new event for the shuffle
        const event = this.eventsRepo.create({
          game_id,
          sequence: 1,
          event_type: 'shuffle',
          data: {
            cards,
          },
        });

        await transactionalEntityManager.save(GameEvents, event);

        return event;
      },
    );
  }
}
