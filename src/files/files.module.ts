import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { OpenaiService } from 'src/openai/openai.service';
import { AssistantsService } from 'src/assistants/assistants.service';

@Module({
  providers: [FilesService, OpenaiService, AssistantsService],
  controllers: [FilesController]
})
export class FilesModule {}
