import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { Thread } from 'openai/resources/beta/threads/threads';
import { Role } from 'src/common';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadService: ThreadsService) {}

  @Post()
  async createEmptyThread(@Query('userId') userId: string): Promise<any> {
    return this.threadService.createEmptyThread(userId);
  }

  @Get()
  async getThreads(@Query('threadIds') threadIds: string): Promise<Thread[]> {
    const threadIdsParsed = threadIds.split(',');
    return this.threadService.retrieveThreads(threadIdsParsed);
  }

  @Post('run')
  async createThreadAndRun(
    @Body()
    { userId, role, content }: { userId: string; role: Role; content: string },
  ) {
    return await this.threadService.createThreadAndRun(userId, role, content);
  }

  @Get(':threadId/run/:runId')
  async retrieveRun(
    @Param('threadId') threadId: string,
    @Param('runId') runId: string,
  ) {
    return await this.threadService.retrieveRun(threadId, runId);
  }
}
