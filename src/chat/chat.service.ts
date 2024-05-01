import { Injectable } from '@nestjs/common';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { MessagesService } from 'src/messages/messages.service';
import { ThreadsService } from 'src/threads/threads.service';

@Injectable()
export class ChatService {
  constructor(
    private threadsService: ThreadsService,
    private messagesService: MessagesService,
  ) {}

  private isRunFinished(run: Run): boolean {
    const { status } = run;
    // Check if the run has completed or failed
    if (status === 'completed' || status === 'failed') {
      return true;
    }
    // Check if the run is in any other state (queued, requires_action, cancelling)
    return false;
  }

  async updateExistingChat(threadId: string, content: string) {
    const run = await this.messagesService.createMessageAndRun(
      threadId,
      content,
      'user',
    );
    let isFinished = false;
    while (!isFinished) {
      const currRun = await this.threadsService.retrieveRun(threadId, run.id);
      isFinished = this.isRunFinished(currRun);
      if (!isFinished) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    return await this.messagesService.getMessages(threadId);
  }

  async streamExistingChat(threadId: string, content: string): Promise<string> {
    return this.messagesService.processStream(threadId, content, 'user')
  }

  async createNewChat(userId: string, content: string) {
    const run = await this.threadsService.createThreadAndRun(
      userId,
      'user',
      content,
    );
    let isFinished = false;
    while (!isFinished) {
      const currRun = await this.threadsService.retrieveRun(
        run.thread_id,
        run.id,
      );
      isFinished = this.isRunFinished(currRun);
      if (!isFinished) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    return await this.messagesService.getMessages(run.thread_id);
  }
}
