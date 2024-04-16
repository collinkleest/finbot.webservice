import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { Thread } from 'openai/resources/beta/threads/threads';
import { Role } from 'src/common';
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
      assistant_id: 'asst_xkE4TnKNEmAFwOkEZK0NWjox',
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