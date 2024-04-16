import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssistantsModule } from './assistants/assistants.module';
import { OpenaiModule } from './openai/openai.module';
import { UserModule } from './user/user.module';
import { MongooseConfigModule } from './mongoose/mongoose.module';

@Module({
  imports: [AssistantsModule, OpenaiModule, UserModule, MongooseConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
