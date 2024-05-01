import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssistantsModule } from './assistants/assistants.module';
import { OpenaiModule } from './openai/openai.module';
import { UserModule } from './user/user.module';
import { MongooseConfigModule } from './mongoose/mongoose.module';
import { ThreadsModule } from './threads/threads.module';
import { MessagesModule } from './messages/messages.module';
import { HealthModule } from './health/health.module';
import { ChatModule } from './chat/chat.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    AssistantsModule,
    OpenaiModule,
    UserModule,
    MongooseConfigModule,
    ThreadsModule,
    MessagesModule,
    HealthModule,
    ChatModule,
    FilesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
