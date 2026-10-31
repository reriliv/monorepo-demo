import { Controller, Get, Render, Res, } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';
import fs from 'fs';
import path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getHello() {
    return {};
    // return this.appService.getHello();
    // return fs.readFileSync('./views/index.html', 'utf-8');
    // return res.status(200).write(fs.readFileSync(path.join(__dirname, './views/index.html'), 'utf-8'));
  }
}
