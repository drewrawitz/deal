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
    const gameState: GameState = {
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

    // 2. Event Processing
    const events = await this.fetchGameEvents(game_id);
    events.sort((a, b) => a.sequence - b.sequence);

    const lastSequence = events?.[events.length - 1]?.sequence ?? 0;
    gameState.lastSequence = lastSequence;

    for (const event of events) {
      switch (event.event_type) {
        case 'shuffle':
          gameState.deck = event.data.cards;
          break;
        case 'deal':
          const numberOfPlayers = Object.keys(event.data.dealtCards).length;
          const cardsDealt = numberOfPlayers * 5;
          gameState.deck.splice(0, cardsDealt);

          // Assign cards to players based on the event data.
          for (const [playerId, cards] of Object.entries(
            event.data?.dealtCards,
          ) as [string, number[]][]) {
            const player = gameState[playerId];
            if (player) {
              player.hand = cards;
            } else {
              gameState.players[playerId] = {
                hand: cards,
                bank: [],
              };
            }
          }
          break;
        case 'playerTurn':
          gameState.currentTurn.player_id = event.data.player_id;
          gameState.currentTurn.actionsTaken = 0;
          break;
        case 'draw':
          gameState.deck.splice(0, event.data.cardsDrawn.length);
          gameState.players[event.player_id].hand.push(
            ...event.data.cardsDrawn,
          );
          gameState.currentTurn.hasDrawnCards = true;
          break;
      }
    }

    return gameState;
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
