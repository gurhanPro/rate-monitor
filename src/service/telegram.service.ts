import { Injectable, Logger } from '@nestjs/common';
import { AppConfigs } from 'src/configs/app.configs';
import { Telegraf } from 'telegraf';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger: Logger = new Logger(TelegramService.name);
  private readonly bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(AppConfigs.ECO_TELEGRAM_BOT_TOKEN);
  }

  async sendEcoCashRateMessage(chatId: string, message: string, photoUrl: string): Promise<void> {
    try {
      const response = await axios.get(photoUrl, { responseType: 'stream' });
      await this.bot.telegram.sendPhoto(chatId, { source: response.data }, { caption: message });
      this.logger.log(`Telegram message sent to ${chatId}`);
    } catch (error) {
      this.logger.error(`Error sending telegram message to ${chatId}: ${error}`);
    }
  }
}
