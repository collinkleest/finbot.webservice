export class CreateMessageDto {
  readonly threadId: string;
  readonly role: 'user' | 'assistant';
  readonly content: string;
}
