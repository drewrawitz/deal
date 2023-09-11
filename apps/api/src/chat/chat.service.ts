import { CreateChatMessageDto, GetChatMessagesDto } from '@deal/dto';
import { CurrentUser } from '@deal/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  async getMessages(query: GetChatMessagesDto) {
    return {
      query,
    };
  }

  async createMessage(user: CurrentUser, body: CreateChatMessageDto) {
    return {
      user,
      body,
    };
  }
}
