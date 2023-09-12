import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;

  // Maps userId => Set of Socket Client IDs.
  // This helps track a user's multiple connections (from different devices/browsers).
  private onlineUsersMap = new Map<string, Set<string>>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection() {
    // Don't increment onlineCount here, we'll do it when authenticated event is received
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    for (const [userId, clientIds] of this.onlineUsersMap.entries()) {
      if (clientIds.has(client.id)) {
        clientIds.delete(client.id);

        // If the user has no more active connections, remove them from onlineUsersMap
        if (clientIds.size === 0) {
          this.onlineUsersMap.delete(userId);
        }

        break; // Exit the loop early since we found the user
      }
    }

    this.broadcastMessage('onlineCount', this.onlineUsersMap.size);
  }

  @SubscribeMessage('authenticated')
  handleAuthenticated(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ): void {
    console.log('handleAuthenticated', userId);
    if (!this.onlineUsersMap.has(userId)) {
      this.onlineUsersMap.set(userId, new Set());
    }
    const clientIds = this.onlineUsersMap.get(userId);
    clientIds.add(client.id);
    this.broadcastMessage('onlineCount', this.onlineUsersMap.size);
  }

  broadcastMessage(key, value) {
    this.server.emit(key, value);
  }
}
