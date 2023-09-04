import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { CardsModule } from '../cards/cards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game, GameEvents, GamePlayers } from '@deal/models';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, GameEvents, GamePlayers]),
    CardsModule,
  ],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
