import { Module } from '@nestjs/common';
import { AssistantsController } from './assistants.controller';
import { OpenaiService } from 'src/openai/openai.service';

@Module({
  controllers: [AssistantsController],
  providers: [OpenaiService],
})
export class AssistantsModule {}
