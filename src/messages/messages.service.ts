import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { env } from 'src/env';
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export class MessagesService {
  private client: OpenAI;
  constructor(private openAiService: OpenaiService) {
    this.client = this.openAiService.getOpenAiClient();
  }

  async createMessageAndRun(
    threadId: string,
    message: string,
    role: 'user' | 'assistant',
  ): Promise<Run> {
    await this.client.beta.threads.messages.create(threadId, {
      content: message,
      role: role,
    });
    const run = await this.client.beta.threads.runs.create(threadId, {
      assistant_id: env.assistant_id,
    });
    return run;
  }

  async getMessages(
    threadId: string,
  ): Promise<OpenAI.Beta.Threads.Messages.MessagesPage> {
    const threadMessages =
      await this.client.beta.threads.messages.list(threadId);
    return threadMessages;
  }
}
