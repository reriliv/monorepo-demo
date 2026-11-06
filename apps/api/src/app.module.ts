import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './routes/user/user.module';
import { ConversationModule } from './routes/conversation/conversation.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, ConversationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
