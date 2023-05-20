import { Module, CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateService } from './service/rate.service';
import { TelegramService } from './service/telegram.service';
import { EcoCashQuote } from './Entity/EcoCashQuote';
import { MamaMoneyQuote } from './Entity/MamaMoney';
import { RateController } from './controller/rate.controller';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

import { AppConfigs } from './configs/app.configs'

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: AppConfigs.DATABASE_HOST,
      port: 3306,
      username: AppConfigs.DATABASE_USERNAME,
      password: AppConfigs.DATABASE_PASSWORD,
      database: AppConfigs.DATABASE_NAME,
      synchronize: true,
      entities: [EcoCashQuote, MamaMoneyQuote],
    }),
    TypeOrmModule.forFeature([EcoCashQuote, MamaMoneyQuote]),
    CacheModule.register(),
  ],
  controllers: [RateController],
  providers: [
    RateService,
    TelegramService,

    // {
    //   provide: CACHE_MANAGER,
    //   useClass: Cache,
    // },
  ],
})
export class AppModule {}
