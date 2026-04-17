import { Module } from '@nestjs/common';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { TankerkoenigModule } from '../tankerkoenig/tankerkoenig.module';

@Module({
  imports: [TankerkoenigModule],
  controllers: [PricesController],
  providers: [PricesService],
})
export class PricesModule {}
