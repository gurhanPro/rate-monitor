import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private readonly logger: Logger = new Logger(TelegramService.name);
  private readonly bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
  }

  async sendEcoCashRateMessage(chatId: string, message: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
      this.logger.log(`Telegram message sent to ${chatId}`);
    } catch (error) {
      this.logger.error(`Error sending telegram message to ${chatId}: ${error}`);
    }
  }
}
