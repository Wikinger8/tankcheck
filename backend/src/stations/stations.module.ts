import { Module } from '@nestjs/common';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { TankerkoenigModule } from '../tankerkoenig/tankerkoenig.module';

@Module({
  imports: [TankerkoenigModule],
  controllers: [StationsController],
  providers: [StationsService],
})
export class StationsModule {}
