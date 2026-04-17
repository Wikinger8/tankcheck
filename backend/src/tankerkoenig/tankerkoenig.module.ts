import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TankerkoenigService } from './tankerkoenig.service';

@Module({
  imports: [HttpModule],
  providers: [TankerkoenigService],
  exports: [TankerkoenigService],
})
export class TankerkoenigModule {}
