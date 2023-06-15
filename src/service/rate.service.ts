import { Injectable, NotFoundException, CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { getEcoCashRate, getMamaMoneyRate } from './axios.service';
import { EcoCashQuote } from '../Entity/EcoCashQuote';
import { MamaMoneyQuote } from '../Entity/MamaMoney';
import { TelegramService } from './telegram.service';
import { Constants } from 'src/configs/app.constants';
import { AppConfigs } from 'src/configs/app.configs';


@Injectable()
export class RateService {
  private readonly logger: Logger = new Logger(RateService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    @InjectRepository(EcoCashQuote)
    private readonly ecoCashQuoteRepository: Repository<EcoCashQuote>,

    @InjectRepository(MamaMoneyQuote)
    private readonly mamaMoneyQuoteRepository: Repository<MamaMoneyQuote>,
    private readonly telegramService: TelegramService,

  ) {
    setInterval(this.monitorEcoCashRate.bind(this), Constants.ECO_CASH_INTERVAL_IN_SECONDS * 1000);
    setInterval(this.monitorMamaMoneyRate.bind(this), Constants.MAMA_MONEY_INTERVAL_IN_SECONDS * 1000);
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


  private async monitorMamaMoneyRate() {
    try {
      this.logger.log('starting to monitor mama money')

      const freshlyFetchedRate: any = await getMamaMoneyRate();
      this.logger.log('FreshlyFetchedRate is: ', freshlyFetchedRate)


      const cachedRate: any = await this.cacheManager.get(Constants.CACHE_MAMA_MONEY_RATE_KEY)
      this.logger.log('cachedRate is ', cachedRate)

      if (cachedRate && JSON.stringify(cachedRate) === JSON.stringify(freshlyFetchedRate)) {
        this.logger.log('Rate is already in cache, no further action needed', cachedRate)
        return;
      }

      this.logger.log('updating cache ')

      await this.cacheManager.set(
        Constants.CACHE_MAMA_MONEY_RATE_KEY,
        freshlyFetchedRate,
        { ttl: Constants.DURABLE_CACHE_TTL_IN_SECONDS }
      )

      const newQuote = new MamaMoneyQuote();

      this.logger.log('saving new rate in db ')

      this.setMamaMoneyEntity(newQuote, freshlyFetchedRate);
      await this.mamaMoneyQuoteRepository.save(newQuote);

      this.logger.log('sending telegram notification')
      const logoFileUrl = AppConfigs.MAMA_MONEY_LOGO_TELEGRAM_URL;

      const telegramMessage = [
        `You send ${freshlyFetchedRate['amount']} ZAR`,
        `They receive $${freshlyFetchedRate['receivable-amount']}`,
        `Mama's fee is ${freshlyFetchedRate['mama-fee-value']} ZAR`,
        `Total to pay is ${freshlyFetchedRate['amount']} ZAR`,
        `1.00 USD = ${Number(freshlyFetchedRate['derived-exchange-rate']).toFixed(2)} ZAR`,

      ]
      // const message = `The rate has changed to:\n${JSON.stringify(telegramMessage, null, 2)}`;
        let message = 'MAM MONEY RATE\n\ rate has changed to:\n\n';

      for(let k of telegramMessage){
        message += `${k}\n`;
      };

      await this.telegramService.sendEcoCashRateMessage(AppConfigs.ECO_CASH_WATCH_CHAT_ID, message, logoFileUrl);
    } catch (error) {
      console.error('Error monitoring rate:', error.message);
    }
  }

  private async monitorEcoCashRate() {
    try {
      this.logger.log('starting to monitor')

      const freshlyFetchedRate = await getEcoCashRate(5000);
      this.logger.log('FreshlyFetchedRate is: ', freshlyFetchedRate)


      const cachedEcoCashRate: any = await this.cacheManager.get(Constants.CACHE_ECO_RATE_KEY)
      this.logger.log('cachedEcoCashRate is ', cachedEcoCashRate)

      if (cachedEcoCashRate && JSON.stringify(cachedEcoCashRate) === JSON.stringify(freshlyFetchedRate)) {
        this.logger.log('Rate is already in cache, no further action needed', cachedEcoCashRate)
        return;
      }

      this.logger.log('updating cache ')

      await this.cacheManager.set(
        Constants.CACHE_ECO_RATE_KEY,
        freshlyFetchedRate,
        { ttl: Constants.DURABLE_CACHE_TTL_IN_SECONDS }
      )

      const newQuote = new EcoCashQuote();

      this.logger.log('saving new rate in db ')

      this.setEntity(newQuote, freshlyFetchedRate);
      await this.ecoCashQuoteRepository.save(newQuote);

      this.logger.log('sending telegram notification')

      const logoFileUrl = AppConfigs.ECO_CASH_LOGO_TELEGRAM_URL;

      const telegramMessage = {
        'Amount to pay': `ZAR ${freshlyFetchedRate.amount_to_pay}`,
        'Our transfer fees': `ZAR ${freshlyFetchedRate.amount_to_pay - freshlyFetchedRate.sending_amount}`,
        'Beneficiary receives': `USD ${freshlyFetchedRate.recipient_amount}`,
        'Rate': `Current rate 1 ZAR = ${Number((freshlyFetchedRate.rate)).toFixed(3)} USD, excluding transfer fees`,
      }

      // const message = `The rate has changed to:\n${JSON.stringify(telegramMessage, null, 2)}`;
      let message = 'ECO-CASH RATE\nThe rate has changed to:\n💰💰💰💰💰💰\n';

      Object.entries(telegramMessage).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });

      await this.telegramService.sendEcoCashRateMessage(AppConfigs.ECO_CASH_WATCH_CHAT_ID, message, logoFileUrl);
    } catch (error) {
      console.error('Error monitoring rate:', error.message);
    }
  }

  private setMamaMoneyEntity(newQuote: MamaMoneyQuote, freshlyFetchedRate: any) {
    newQuote.amount = freshlyFetchedRate['amount'];
    newQuote.payoutExchangeRate = freshlyFetchedRate['payout-exchange-rate']
    newQuote.receivableAmount = freshlyFetchedRate['receivable-amount']
    newQuote.payoutCurrency = freshlyFetchedRate['payout-currency']
    newQuote.senderCurrency = freshlyFetchedRate['sender-currency']
    newQuote.mamaFeeType = freshlyFetchedRate['mama-fee-type']
    newQuote.mamaFeeValue = freshlyFetchedRate['mama-fee-value']
    newQuote.customerFee = freshlyFetchedRate['customer-fee']
    newQuote.derivedExchangeRate = freshlyFetchedRate['derived-exchange-rate']
    newQuote.settlementExchangeRate = freshlyFetchedRate['settlement-exchange-rate']
    newQuote.settlementCurrency = freshlyFetchedRate['settlement-currency']
  }

  private setEntity(newQuote: EcoCashQuote, freshlyFetchedRate: any) {
    newQuote.receive = freshlyFetchedRate.receive;
    newQuote.sendingAmount = freshlyFetchedRate.sending_amount;
    newQuote.recipientAmount = freshlyFetchedRate.recipient_amount;
    newQuote.rate = freshlyFetchedRate.rate;
    newQuote.reverseRate = freshlyFetchedRate.reverse_rate;
    newQuote.fees = freshlyFetchedRate.fees;
    newQuote.vat = freshlyFetchedRate.vat;
    newQuote.sendingMinLimit = freshlyFetchedRate.sending_min_limit;
    newQuote.sendingMaxLimit = freshlyFetchedRate.sending_max_limit;
    newQuote.receivingMinLimit = freshlyFetchedRate.receiving_min_limit;
    newQuote.receivingMaxLimit = freshlyFetchedRate.receiving_max_limit;
  }
}