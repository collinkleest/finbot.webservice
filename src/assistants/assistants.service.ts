import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Assistant, AssistantsPage } from 'openai/resources/beta/assistants';
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export class AssistantsService {
    private openAi: OpenAI;
    constructor(private openAiService: OpenaiService) {
        this.openAi = this.openAiService.getOpenAiClient();
    }

    async listAssistants(): Promise<AssistantsPage> {
        return await this.openAi.beta.assistants.list()
    }

    async getAssistant(assistant_id: string): Promise<Assistant> {
        return await this.openAi.beta.assistants.retrieve(
            assistant_id
        );
    }

}

