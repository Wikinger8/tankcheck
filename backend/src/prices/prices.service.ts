import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TankerkoenigService } from '../tankerkoenig/tankerkoenig.service';
import { StationPrices } from '../../../packages/shared/src';

@Injectable()
export class PricesService {
  constructor(
    private readonly tankerkoenigService: TankerkoenigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getPrices(idsString: string): Promise<Record<string, StationPrices>> {
    const ids = idsString.split(',');

    if (ids.length > 10) {
      throw new HttpException(
        'Maximum 10 station IDs allowed per request',
        HttpStatus.BAD_REQUEST,
      );
    }

    const cacheKey = `prices:${ids.sort().join(',')}`;

    const cached =
      await this.cacheManager.get<Record<string, StationPrices>>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.tankerkoenigService.getPrices(ids);

    await this.cacheManager.set(cacheKey, response.prices, 300000);

    return response.prices;
  }
}
