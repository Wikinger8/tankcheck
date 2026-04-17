import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import configuration from './config/configuration';
import { TankerkoenigModule } from './tankerkoenig/tankerkoenig.module';
import { StationsModule } from './stations/stations.module';
import { PricesModule } from './prices/prices.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: configService.get<string>('redisUrl'),
        }),
        ttl: 300000,
      }),
    }),
    TankerkoenigModule,
    StationsModule,
    PricesModule,
    HealthModule,
  ],
})
export class AppModule {}
