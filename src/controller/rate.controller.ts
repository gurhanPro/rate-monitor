import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RateService } from 'src/service/rate.service';

@Controller()
@ApiTags('Rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get('/rate/eco_cash')
  @ApiOperation({ summary: 'Get the current eco_cash rate' })
  async getCurrentEcoCashRate(): Promise<any> {
    return await this.rateService.getEcoRate();
  }

  @Get('/rate/mama_money')
  @ApiOperation({ summary: 'Get the current mama_money rate' })
  async getCurrentMamaMoneyRate(): Promise<any> {
    return await this.rateService.getMamaRate();
  }

  @Get('/rates/eco_cash/today')
  @ApiOperation({ summary: 'Get the historical rates from eco_cash in the last 24hrs' })
  async getTodayEcoCashRates(): Promise<number[]> {
    return await this.rateService.getTodayEcoCashRates();
  }

  @Get('/rates/mama_money/today')
  @ApiOperation({ summary: 'Get the historical rates from mama_money in the last 24hrs' })
  async getTodayMamaMoneyRates(): Promise<number[]> {
    return await this.rateService.getTodayMamaMoneyRates();
  }
}
