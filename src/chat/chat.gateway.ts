import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { map } from 'rxjs/internal/operators/map';
import { Server } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { CursorPage } from 'openai/pagination';
import { Message } from 'openai/resources/beta/threads/messages';

@WebSocketGateway(80, { cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  handleMessage(
    userId: string,
    data: { threadId?: string, message: string; }
  ): Observable<WsResponse<CursorPage<Message>>> {
    this.logger.log(`Message received from user id: ${userId}`);
    this.logger.debug(`Payload: ${data}`);

    if (data.threadId) {
      return from(this.chatService.updateExistingChat(data.threadId, data.message)).pipe(
        map((message) => ({
          event: `ping:${userId}`,
          data: message,
        }))
      );
    }

    return from(this.chatService.createNewChat(userId, data.message)).pipe(
      map((message) => ({
        event: `ping:${userId}`,
        data: message,
      }))
    );
    
  }
}
