import { Injectable } from '@nestjs/common';
import ollama from 'ollama';
import type { Response } from 'express';
import path from 'path';
import fs from 'fs';

@Injectable()
export class ConversationService {
  constructor() { }

  /* async streamChat(prompt: string, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      let fullMessage = '';
      const stream = await ollama.chat({
        model: 'SetneufPT/Qwopus3.5-4B-Coder-MTP_Q4_64k_8GB-GPU', // 换成你本地实际可用的模型名 
        messages: [{ role: 'user', content: prompt }],
        tools: [],
        stream: true,
      });

      for await (const chunk of stream) {
        console.log("chunk", chunk);
        if (chunk.message.content) {
          fullMessage += chunk.message.content;
          res.write(`data: ${JSON.stringify({ type: 'text', content: chunk.message.content })}\n\n`);
        }
      }

      console.log("stream done");
      console.log(fullMessage);

      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    } catch (e) {
      console.log("Ollama Error:", e);
      res.write(`data: ${JSON.stringify({ type: 'error', content: (e as Error).message })}\n\n`);
      res.end();
    }
  } */

  async streamChat(prompt: string, sessionId: string, res: any) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 1. 定义工具
    const tools = [{
      type: 'function',
      function: {
        name: 'read_file',
        description: '读取文件内容',
        parameters: {
          type: 'object',
          required: ['path'],
          properties: { path: { type: 'string' } }
        }
      }
    }];

    // 2. 构建对话历史（如果是多轮，这里应该从数据库拉取历史记录）
    const messages: any[] = [
      { role: 'user', content: prompt }
    ];

    try {
      // 第一轮请求
      const response = await ollama.chat({
        model: 'qwen2.5-coder:7b',
        messages,
        tools,
        stream: false, // 工具调用阶段通常不流式输出，以便一次拿到完整 tool_calls
      });

      // 3. 检查模型是否要调用工具
      if (response.message.tool_calls && response.message.tool_calls.length > 0) {
        // 将模型的消息记录进历史
        messages.push(response.message);

        for (const toolCall of response.message.tool_calls) {
          const { name, arguments: args } = toolCall.function;
          let toolResult = '';

          // 通知前端正在执行工具
          res.write(`data: ${JSON.stringify({ type: 'tool_call', content: { name, args } })}\n\n`);

          // 4. 执行真实工具逻辑
          if (name === 'read_file') {
            try {
              // 强烈建议：必须限制路径，防止模型读取系统敏感文件
              const safePath = path.join(process.cwd(), args.path);
              toolResult = fs.readFileSync(safePath, 'utf-8');
            } catch (err) {
              toolResult = `读取文件失败: ${(err as Error).message}`;
            }
          }

          // 5. 将工具执行结果塞回历史
          messages.push({
            role: 'tool',
            content: toolResult, // 真实的文件内容
          });
        }

        // 6. 带着工具结果进行第二轮请求，让模型生成最终回答（并流式输出）
        const finalStream = await ollama.chat({
          model: 'qwen2.5-coder:7b',
          messages,
          stream: true,
        });

        let fullContent = '';
        for await (const chunk of finalStream) {
          if (chunk.message.content) {
            fullContent += chunk.message.content;
            res.write(`data: ${JSON.stringify({ type: 'text', content: chunk.message.content })}\n\n`);
          }
        }

        // 保存 fullContent 到数据库...
      } else {
        // 模型不需要工具，直接输出结果（如果是流式，需要把这个 response 重新包成 stream）
        // 为了简单，这里直接输出纯文本
        res.write(`data: ${JSON.stringify({ type: 'text', content: response.message.content })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();

    } catch (error) {
      console.error(error);
      res.write(`data: ${JSON.stringify({ type: 'error', content: (error as Error).message })}\n\n`);
      res.end();
    }
  }
}
