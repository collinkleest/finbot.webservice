import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { Thread } from 'openai/resources/beta/threads/threads';
import { Role } from 'src/common';
import { env } from 'src/env';
import { OpenaiService } from 'src/openai/openai.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ThreadsService {
  private client: OpenAI;
  constructor(
    private readonly openAiService: OpenaiService,
    private userService: UserService,
  ) {
    this.client = this.openAiService.getOpenAiClient();
  }

  async createEmptyThread(_userId: string): Promise<Thread> {
    const thread = await this.client.beta.threads.create();
    const user = await this.userService.findById(_userId);
    await user.updateOne({ threads: [...user.threads, thread.id] });
    return thread;
  }

  async deleteThread(_userId: string, threadId: string): Promise<string[]> {
    const user = await this.userService.findById(_userId);
    const newThreadList = user.threads.filter((thread) => thread !== threadId)

    await user.updateOne({ threads: [...newThreadList] });
    return newThreadList;
  }

  async retrieveThreads(threadIds: string[]): Promise<Thread[]> {
    const threads = [];
    for (const threadId of threadIds) {
      const thread = await this.client.beta.threads.retrieve(threadId);
      threads.push(thread);
    }
    return threads;
  }

  async createThreadAndRun(
    userId: string,
    role: Role,
    content: string,
  ): Promise<Run> {
    const run = await this.client.beta.threads.createAndRun({
      assistant_id: env.assistant_id,
      thread: {
        messages: [{ role: role, content: content }],
      },
    });
    const user = await this.userService.findById(userId);
    await user.updateOne({ threads: [...user.threads, run.thread_id] });
    return run;
  }

  async retrieveRun(threadId: string, runId: string): Promise<Run> {
    const run = await this.client.beta.threads.runs.retrieve(threadId, runId);
    return run;
  }
}
