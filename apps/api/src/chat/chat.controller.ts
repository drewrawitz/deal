import {
  Request,
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request as RequestType } from 'express';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { CreateChatMessageDto, GetChatMessagesDto } from '@deal/dto';

@Controller({
  path: 'chat',
  version: '1',
})
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChatMessages(@Query() query: GetChatMessagesDto) {
    return this.chatService.getMessages(query);
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async createChatMessage(
    @Request() req: RequestType,
    @Body() body: CreateChatMessageDto,
  ) {
    return this.chatService.createMessage(req.user, body);
  }
}
