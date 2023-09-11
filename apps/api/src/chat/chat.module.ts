import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Message } from '@deal/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesGateway } from '../games/games.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [ChatController],
  providers: [ChatService, GamesGateway],
})
export class ChatModule {}
