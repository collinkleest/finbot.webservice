import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('new')
  async createNewChat(
    @Body() { userId, content }: { userId: string; content: string },
  ) {
    return await this.chatService.createNewChat(userId, content);
  }

  @Post('existing')
  async updateExistingChat(
    @Body() { threadId, content }: { threadId: string; content: string },
  ) {
    return await this.chatService.updateExistingChat(threadId, content);
  }
}
