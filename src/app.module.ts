import * as redisStore from 'cache-manager-redis-store';
import { ClientOpts } from 'redis';
import { RedisManager, RedisModule } from '@liaoliaots/nestjs-redis';
import { Module, CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RateService } from './service/rate.service';
import { TelegramService } from './service/telegram.service';
import { EcoCashQuote } from './Entity/EcoCashQuote';
import { MamaMoneyQuote } from './Entity/MamaMoney';
import { RateController } from './controller/rate.controller';
import { AppConfigs } from './configs/app.configs';

@Module({
  imports: [

    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: AppConfigs.REDIS_HOST,
      port: AppConfigs.REDIS_PORT,
      db: AppConfigs.REDIS_DB,
    }),
    RedisModule.forRoot({
      config: {
        host: AppConfigs.REDIS_HOST,
        port: AppConfigs.REDIS_PORT,
        db: AppConfigs.REDIS_DB,
      },
    }),
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
  ],
  controllers: [RateController],
  providers: [
    RateService,
    TelegramService,
  ],
})
export class AppModule {}
