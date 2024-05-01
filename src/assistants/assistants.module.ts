import { Module } from '@nestjs/common';
import { AssistantsController } from './assistants.controller';
import { OpenaiService } from 'src/openai/openai.service';
import { AssistantsService } from './assistants.service';

@Module({
  controllers: [AssistantsController],
  providers: [OpenaiService, AssistantsService],
})
export class AssistantsModule {}
