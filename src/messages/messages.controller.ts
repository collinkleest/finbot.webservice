import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateMessageDto } from './create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    const { threadId, role, content } = createMessageDto;
    return await this.messagesService.createMessageAndRun(
      threadId,
      content,
      role,
    );
  }

  @Get(':threadId')
  async getMessages(@Param('threadId') threadId: string) {
    return await this.messagesService.getMessages(threadId);
  }
}
