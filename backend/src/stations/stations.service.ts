import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TankerkoenigService } from '../tankerkoenig/tankerkoenig.service';
import { FuelType, SortOption, Station, StationDetail } from '@tankcheck/shared';

/**
 * Orchestriert Tankstellen-Abfragen mit Redis-Caching.
 * Cache-Strategie: lat/lng auf 3 Dezimalstellen gerundet (~110m),
 * damit nahe beieinander liegende Anfragen denselben Cache-Eintrag treffen.
 */
@Injectable()
export class StationsService {
  constructor(
    private readonly tankerkoenigService: TankerkoenigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async search(
    lat: number,
    lng: number,
    rad: number,
    type: FuelType,
    sort: SortOption,
  ): Promise<Station[]> {
    const latKey = lat.toFixed(3);
    const lngKey = lng.toFixed(3);
    const cacheKey = `stations:search:${latKey}:${lngKey}:${rad}:${type}:${sort}`;

    const cached = await this.cacheManager.get<Station[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.tankerkoenigService.searchStations(
      lat,
      lng,
      rad,
      type,
      sort,
    );

    // TTL 5 Minuten (300s) - entspricht Tankerkoenig Rate-Limit-Empfehlung
    await this.cacheManager.set(cacheKey, response.stations, 300000);

    return response.stations;
  }

  async getDetail(id: string): Promise<StationDetail> {
    const cacheKey = `stations:detail:${id}`;

    const cached = await this.cacheManager.get<StationDetail>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.tankerkoenigService.getStationDetail(id);

    // TTL 1 Stunde - Oeffnungszeiten aendern sich selten
    await this.cacheManager.set(cacheKey, response.station, 3600000);

    return response.station;
  }
}
