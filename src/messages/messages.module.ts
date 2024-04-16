import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { OpenaiService } from 'src/openai/openai.service';

@Module({
  providers: [MessagesService, OpenaiService],
  controllers: [MessagesController],
})
export class MessagesModule {}
