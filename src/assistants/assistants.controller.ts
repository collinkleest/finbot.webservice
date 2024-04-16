import { Controller, Get } from '@nestjs/common';
import { OpenaiService } from 'src/openai/openai.service';

@Controller('assistants')
export class AssistantsController {
  constructor(private openAiService: OpenaiService) {}

  @Get('list')
  public getAssistants() {
    const client = this.openAiService.getOpenAiClient();
    return client.beta.assistants.list();
  }
}
