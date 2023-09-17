import { CreateChatMessageDto, GetChatMessagesDto } from '@deal/dto';
import { Message } from '@deal/models';
import { CurrentUser } from '@deal/types';
import { paginateResponse } from '@deal/utils-client';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GamesGateway } from '../games/games.gateway';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private gamesGateway: GamesGateway,
  ) {}

  async getMessages(query: GetChatMessagesDto) {
    const { take, page, game_id } = query;
    const skip = (page - 1) * take;

    const qb = this.messageRepo
      .createQueryBuilder('message')
      .leftJoin('message.user', 'user')
      .leftJoin('message.game', 'game')
      .select([
        'user.id',
        'user.username',
        'user.avatar',
        'message.content',
        'message.created_at',
      ])
      .limit(take)
      .offset(skip)
      .orderBy('message.created_at', 'DESC');

    if (query.game_id) {
      qb.andWhere('game.id = :game_id', { game_id });
    } else {
      qb.andWhere('game.id is null');
    }

    const [messages, count] = await qb.getManyAndCount();

    return paginateResponse(messages, count, page, take);
  }

  async createMessage(user: CurrentUser, body: CreateChatMessageDto) {
    const message = this.messageRepo.create({
      user_id: user.user_id,
      content: body.content,
      ...(body.game_id && { game_id: body.game_id }),
    });

    const newMessage = await this.messageRepo.save(message);

    // Send a WS event to the client
    this.gamesGateway.broadcastMessage(
      !body.game_id ? 'message.created' : `game.${body.game_id}.chat`,
      {
        id: newMessage.id,
      },
    );

    return newMessage;
  }
}
