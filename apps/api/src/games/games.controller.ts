import {
  Request,
  Controller,
  Query,
  Param,
  Body,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { Request as RequestType } from 'express';
import {
  GameActionBodyDto,
  GameIdParamDto,
  GetGamesDto,
  KickPlayerFromGameBodyDto,
} from '@deal/dto';

@Controller({
  path: 'games',
  version: '1',
})
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async getGames(@Query() query: GetGamesDto) {
    return this.gamesService.getGames(query);
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async createGame(@Request() req: RequestType) {
    return this.gamesService.createGame(req.user);
  }

  @Get('/:game_id')
  async getGameById(@Param() params: GameIdParamDto) {
    return this.gamesService.getSingleGame(params.game_id);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:game_id/start')
  async startGame(@Param() params: GameIdParamDto) {
    return this.gamesService.startGame(params.game_id);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:game_id/join')
  async joinGame(@Request() req: RequestType, @Param() params: GameIdParamDto) {
    return this.gamesService.joinGame(req.user, params.game_id);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:game_id/leave')
  async leaveGame(
    @Request() req: RequestType,
    @Param() params: GameIdParamDto,
  ) {
    return this.gamesService.leaveGame(req.user, params.game_id);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:game_id/kick')
  async kickPlayerFromGame(
    @Request() req: RequestType,
    @Param() params: GameIdParamDto,
    @Body() body: KickPlayerFromGameBodyDto,
  ) {
    return this.gamesService.kickPlayerFromGame(req.user, params.game_id, body);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:game_id/action')
  async gameAction(
    @Request() req: RequestType,
    @Param() params: GameIdParamDto,
    @Body() body: GameActionBodyDto,
  ) {
    return this.gamesService.gameAction(req.user, params.game_id, body);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/:game_id/state')
  async getGameState(
    @Request() req: RequestType,
    @Param() params: GameIdParamDto,
  ) {
    return this.gamesService.getGameState(req.user, params.game_id);
  }
}
