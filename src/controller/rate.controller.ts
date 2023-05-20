import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RateService } from 'src/service/rate.service';

@Controller()
@ApiTags('Rates')
export class RatepController {
  constructor(private readonly rateService: RateService) {}

  @Get('/rate')
  @ApiOperation({ summary: 'Get the current rate' })
  async getCurrentRate(): Promise<any> {
    return await this.rateService.getRata();
  }

  @Get('/rates')
  @ApiOperation({ summary: 'Get the historical rates from today' })
  async getTodayRates(): Promise<number[]> {
    return await this.rateService.getRata();
  }
}
