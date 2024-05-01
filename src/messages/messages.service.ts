import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { APIPromise } from 'openai/core';
import { AssistantStreamEvent } from 'openai/resources/beta/assistants/assistants';
import { MessageDeltaEvent, TextDeltaBlock } from 'openai/resources/beta/threads/messages';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { env } from 'src/env';
import { OpenaiService } from 'src/openai/openai.service';
import { Readable, Stream } from 'stream';

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

  // async createMessageAndStream(
  //   threadId: string,
  //   message: string,
  //   role: 'user' | 'assistant',
  // ): Promise<string> {

  //   const stream = await this.client.beta.threads.runs.create(threadId, {
  //     assistant_id: env.assistant_id,
  //     stream: true
  //   });
    
  //   for await (const event of stream) {
  //     const val = event.data as any

  //     if (val?.object === "thread.message.delta") {

  //       const delta = ((val as MessageDeltaEvent).delta.content[0] as TextDeltaBlock)?.text
  //       console.log(delta)
  //     }
  //   }

  //   return
  // }

  async processStream( threadId: string, message: string, role: 'user' | 'assistant',): Promise<string> {

    await this.client.beta.threads.messages.create(threadId, {
      content: message,
      role: role,
    });

    return new Promise<string>((resolve, reject) => {
      const readableStream = new Readable({
        read() {}
      });
  
      const threadStream = this.client.beta.threads.runs.stream(threadId, {
        assistant_id: env.assistant_id,
        stream: true
      });
  
      threadStream.on('textDelta', async (chunk) => {
  
        if (typeof chunk === 'object') {
          readableStream.push(JSON.stringify(chunk));
        } else if (typeof chunk === 'string') {
          readableStream.push(chunk);
        } else {
          readableStream.destroy(new Error('Unexpected chunk type'));
          return;
        }
      });

      threadStream.on('error', (err) => {
        reject(err);
      });

      readableStream.on('data', (data) => {
        try {
          const val = JSON.parse(data);
          if (val?.object === "thread.message.delta") {
            const text = ((val as MessageDeltaEvent).delta.content[0] as  TextDeltaBlock)?.text as string;
            if (text) {
              console.log(text)
              resolve(text);
            }
          }
        } catch (err) {
          // Incomplete JSON, wait for more data
        }
      });
  
      readableStream.on('error', (err) => {
        reject(err);
      });
    });
  }




  async getMessages(
    threadId: string,
  ): Promise<OpenAI.Beta.Threads.Messages.MessagesPage> {
    const threadMessages =
      await this.client.beta.threads.messages.list(threadId);
    return threadMessages;
  }
}
