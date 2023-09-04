import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CardsService } from '../cards/cards.service';
import { CurrentUser, GameState, TypedGameEvent } from '@deal/types';
import { Game, GameStatus, GameEvents, GamePlayers } from '@deal/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameActionBodyDto } from '@deal/dto';
import { GameEngine } from './game.engine';

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
          },
        });

        await transactionalEntityManager.save(GameEvents, dealEvent);

        // 4. Determine the starting player (based on position)
        const startingPlayer = game.players.find((p) => p.position === 1);

        if (!startingPlayer) {
          throw new Error('No player with position 1 found.'); // This should ideally never happen
        }

        // 5. Create a playerTurn event for the starting player
        const playerTurnEvent = this.eventsRepo.create({
          game_id,
          sequence: 3,
          event_type: 'playerTurn',
          data: {
            player_id: startingPlayer.player_id,
          },
        });

        await transactionalEntityManager.save(GameEvents, playerTurnEvent);

        return playerTurnEvent;
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

  async fetchGameEvents(game_id: number): Promise<TypedGameEvent[]> {
    const data = await this.eventsRepo.find({
      where: { game_id },
      order: { sequence: 'ASC' },
    });

    return data as TypedGameEvent[];
  }

  async getGameState(game_id: number): Promise<GameState> {
    // 1. Game Initialization
    const initialState: GameState = {
      currentTurn: {
        player_id: '',
        actionsTaken: 0,
        hasDrawnCards: false,
      },
      lastSequence: 0,
      players: {},
      deck: [],
      discardPile: [],
    };

    const engine = new GameEngine(initialState);

    // 2. Event Processing
    const events = await this.fetchGameEvents(game_id);
    events.sort((a, b) => a.sequence - b.sequence);

    for (const event of events) {
      engine.applyEvent(event);
    }

    return engine.state;
  }

  async gameAction(
    user: CurrentUser,
    game_id: number,
    body: GameActionBodyDto,
  ) {
    const game = await this.gameRepo
      .createQueryBuilder('game')
      .where('game.id = :id', { id: game_id })
      .getOne();

    // Make sure this Game exists
    if (!game) {
      throw new NotFoundException();
    }

    // Make sure the Game is still in progress
    if (game.status !== 'in_progress') {
      throw new BadRequestException('Game is currently not in progress.');
    }

    // Get the game state
    const state = await this.getGameState(game_id);

    if (state.currentTurn.player_id !== user.user_id) {
      throw new BadRequestException('It is not your turn.');
    }

    const { action } = body;
    if (action === 'drawCards') {
      if (state.currentTurn.actionsTaken > 0) {
        throw new BadRequestException(
          'You have already drawn your cards this turn.',
        );
      }

      // Figure out how many cards to draw.
      const cardsToDraw = 2;
      const cardsDrawn = state.deck.splice(0, cardsToDraw);

      const event = this.eventsRepo.create({
        game_id,
        player_id: user.user_id,
        sequence: state.lastSequence + 1,
        event_type: 'draw',
        data: {
          cardsDrawn,
        },
      });

      await this.eventsRepo.save(event);
    }

    return {
      state,
    };
  }
}
