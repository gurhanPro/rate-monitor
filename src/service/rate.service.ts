import { Injectable, NotFoundException, CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { getEcoCashRate } from './axios.service';
import { EcoCashQuote } from '../Entity/EcoCashQuote';
import { MamaMoneyQuote } from '../Entity/MamaMoney';
import { TelegramService } from './telegram.service';


@Injectable()
export class RateService {
  private readonly logger: Logger = new Logger(TelegramService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    @InjectRepository(EcoCashQuote)
    private readonly ecoCashQuoteRepository: Repository<EcoCashQuote>,

    @InjectRepository(MamaMoneyQuote)
    private readonly mamaMoneyQuoteRepository: Repository<MamaMoneyQuote>,
    private readonly telegramService: TelegramService,

  ) {
    // Start monitoring the rate every minute when the service is created
    setInterval(this.monitorEcoCashRate.bind(this), 20000);
    // setInterval(this.monitorEcoCashRate.bind(this), 60 * 1000);
    // setInterval(this.monitorMamaMoneyRate.bind(this), 60 * 1000);
  }

  async getCurrentEcoCastRate(): Promise<any> {
    const latestRate = await this.ecoCashQuoteRepository.findOne({
      order: { created_at: 'DESC' },
    });

    if (!latestRate) {
      throw new NotFoundException('No rates found');
    }
    return latestRate
  }

  async getCurrentMamaMoneyRate(): Promise<any> {
    const latestRate = await this.mamaMoneyQuoteRepository.findOne({
      order: { created_at: 'DESC' },
    });

    if (!latestRate) {
      throw new NotFoundException('No rates found');
    }
    return latestRate
  }

  async getTodayRates(): Promise<number[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the start of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Set the time to the start of the next day

    const todayRates = await this.ecoCashQuoteRepository.find({
      where: {
        created_at: Between(today, tomorrow),
      },
    });

    if (todayRates.length === 0) {
      throw new NotFoundException('No rates found for today');
    }

    return todayRates.map((quote) => quote.rate);
  }


  async getRate(): Promise<any> {
    const response = await getEcoCashRate(5000);
    console.log(response.data);

    return response.data;
  }
  private async monitorEcoCashRate() {
    try {
      this.logger.log('starting to monitor')
      // Call the endpoint that returns the rate
      const response = await getEcoCashRate(5000);
      // this.logger.log('current ecocash rate', response)

      // const newRate = response.data.rate;

      // this.logger.log('new rate', newRate)

      // // Check if the rate is already cached
      // const cacheKey = 'ecoCashRate';
      // const cachedRate = await this.cacheManager.get(cacheKey);
      // this.logger.log('cachedRate is ', cachedRate)
      
      // if (cachedRate !== undefined && cachedRate === newRate) {
      //   // Rate is already in cache, no further action needed
      //   return;
      // }

      // // Update the cache with the new rate
      // await this.cacheManager.set(cacheKey, newRate);

      // // Save the new quote to the database
      // const newQuote = new EcoCashQuote();
      // newQuote.rate = newRate;
      // await this.ecoCashQuoteRepository.save(newQuote);

      // // Send a Telegram notification
      // const message = `The rate has changed to ${newRate}.`;
      // await this.telegramService.sendEcoCashRateMessage('TELEGRAM_CHAT_ID', message);
    } catch (error) {
      console.error('Error monitoring rate:', error.message);
    }
  }
}