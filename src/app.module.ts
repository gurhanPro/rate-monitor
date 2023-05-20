import { Module } from '@nestjs/common';
import { RatepController } from './controller/rate.controller';
import { EmailService } from './service/email.service';
import { RateService } from './service/rate.service';
import { TelegramService } from './service/telegram.service';

@Module({
  imports: [],
  controllers: [RatepController],
  providers: [RateService, EmailService, TelegramService],
})
export class AppModule {}
