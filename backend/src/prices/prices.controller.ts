import { Controller, Get, Query } from '@nestjs/common';
import { PricesService } from './prices.service';
import { GetPricesDto } from './dto/get-prices.dto';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get()
  async getPrices(@Query() query: GetPricesDto) {
    const prices = await this.pricesService.getPrices(query.ids);
    return { ok: true, prices };
  }
}
