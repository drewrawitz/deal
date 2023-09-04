import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CardsService } from '../cards/cards.service';
import { CurrentUser } from '@deal/types';
import { Game, GameStatus, GameEvents, GamePlayers } from '@deal/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
    @InjectRepository(GamePlayers)
    private readonly gamePlayersRepo: Repository<GamePlayers>,
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
      .leftJoinAndSelect('game.players', 'players')
      .where('game.id = :id', { id: game_id })
      .getOne();

    // Make sure this Game exists
    if (!game) {
      throw new NotFoundException();
    }

    const numPlayers = game.players.length;

    // Make sure the Game has not already started
    if (game.status !== 'waiting') {
      throw new BadRequestException('Game has already started');
    }

    // Make sure the Game has at least 2 players joined
    if (numPlayers < 2) {
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
        const shuffleEvent = this.eventsRepo.create({
          game_id,
          sequence: 1,
          event_type: 'shuffle',
          data: {
            cards,
          },
        });

        await transactionalEntityManager.save(GameEvents, shuffleEvent);

        // Now, let's deal the cards.
        const dealtCards: Record<number, number[]> = {};

        for (let i = 0; i < 5 * numPlayers; i++) {
          const currentPlayerId = game.players[i % numPlayers].player_id; // This ensures an alternating pattern.

          if (!dealtCards[currentPlayerId]) {
            dealtCards[currentPlayerId] = [];
          }

          dealtCards[currentPlayerId].push(cards[i]);
        }

        // Remove the dealt cards from the deck
        cards.splice(0, 5 * numPlayers);

        // 3. Create a new event for the deal
        const dealEvent = this.eventsRepo.create({
          game_id,
          sequence: 2,
          event_type: 'deal',
          data: {
            dealtCards,
            remainingDeck: cards,
          },
        });

        await transactionalEntityManager.save(GameEvents, dealEvent);

        return dealEvent;
      },
    );
  }

  async joinGame(user: CurrentUser, game_id: number) {
    const game = await this.gameRepo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.players', 'players')
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

    // Make sure the Game doesn't have too many players
    if (game.players.length >= 4) {
      throw new BadRequestException('This game is full.');
    }

    // Check if this player has already joined this game
    const playerIds = game.players.map((p) => p.player_id);
    if (playerIds.includes(user.user_id)) {
      throw new BadRequestException('You have already joined this game.');
    }

    // Determine the position for the new player
    const positionsTaken = new Set(game.players.map((p) => p.position));
    let newPosition = 1;
    while (positionsTaken.has(newPosition)) {
      newPosition++;
    }

    // All looks valid. Add the player to the game
    const gamePlayer = this.gamePlayersRepo.create({
      game_id: game_id,
      player_id: user.user_id,
      position: newPosition,
    });

    return await this.gamePlayersRepo.save(gamePlayer);
  }
}
