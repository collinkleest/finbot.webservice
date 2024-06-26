import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ThreadsService } from 'src/threads/threads.service';
import { MessagesService } from 'src/messages/messages.service';
import { UserService } from 'src/user/user.service';
import { OpenaiService } from 'src/openai/openai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.model';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    ChatService,
    ThreadsService,
    MessagesService,
    UserService,
    ChatGateway,
    OpenaiService,
  ],
})
export class ChatModule {}
