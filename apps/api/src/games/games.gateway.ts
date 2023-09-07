import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class GamesGateway {
  @WebSocketServer() server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('message', message);
  }

  broadcastMessage(key, value) {
    this.server.emit(key, value);
  }
}
