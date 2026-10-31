import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ConversationService } from './conversation.service';

@Controller("/conversation")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }

  @Get()
  findAll() {
    return {
      conversations: []
    };
  }

  @Post("/chat")
  async chat() {
    const response = await fetch("http://localhost:3000/conversation/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Hello, how are you?"
      })
    });
    const data = await response.json();
    console.log("data", data);
    return data;
    return {
      message: "This action chats with the conversation"
    };
  }

  @Post("/chatSse")
  async chatSse(@Body() body: { message: string, id: string; }) {
    const response = await fetch("http://localhost:3000/conversation/chatSse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: body.message,
        stream: true
      })
    });
    const data = await response.json();
    console.log("data", data);
    return data;
  }

  // @Get("stream")
  // async stream(@Query("prompt") prompt: string, @Res() res: Response) {
  //   if (!prompt) {
  //     return res.status(400).send("Prompt is required");
  //   }
  //   await this.conversationService.streamChat(prompt, res);
  // }
  @Post('chat/stream')
  async chatStream(
    @Body('prompt') prompt: string,
    @Body('sessionId') sessionId: string,
    @Res() res: Response,
  ) {
    await this.conversationService.streamChat(prompt, sessionId, res);
  }
}
