import { Request, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { Request as RequestType } from 'express';
import { GameIdParamDto } from '@deal/dto';

@Controller({
  path: 'games',
  version: '1',
})
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  async createGame(@Request() req: RequestType) {
    return this.gamesService.createGame(req.user);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:game_id/start')
  async startGame(@Param() params: GameIdParamDto) {
    return this.gamesService.startGame(params.game_id);
  }
}
