import { Controller, Get, Post } from '@nestjs/common';

@Controller("/conversation")
export class ConversationController {
  @Get()
  findAll() {
    return {
      conversations: []
    };
  }

  @Post("/chat")
  chat() {
    return {
      message: "This action chats with the conversation"
    };
  }
}
