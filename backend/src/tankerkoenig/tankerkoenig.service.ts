import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  TKListResponse,
  TKDetailResponse,
  TKPricesResponse,
  FuelType,
  SortOption,
} from '../../../packages/shared/src';

/**
 * HTTP-Client fuer die Tankerkoenig API (https://creativecommons.tankerkoenig.de).
 * Kapselt alle API-Aufrufe und validiert die Antworten (ok-Flag).
 * Der API-Key wird serverseitig injiziert und nie an den Client weitergegeben.
 */
@Injectable()
export class TankerkoenigService {
  private readonly baseUrl = 'https://creativecommons.tankerkoenig.de/json/';
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('tankerkoenigApiKey', '');
  }

  // Umkreissuche: liefert Tankstellen + Preise im angegebenen Radius (max 25km)
  async searchStations(
    lat: number,
    lng: number,
    rad: number,
    type: FuelType,
    sort: SortOption,
  ): Promise<TKListResponse> {
    const response = await firstValueFrom(
      this.httpService.get<TKListResponse>(`${this.baseUrl}list.php`, {
        params: {
          lat,
          lng,
          rad,
          type,
          sort,
          apikey: this.apiKey,
        },
      }),
    );

    if (!response.data.ok) {
      throw new HttpException(
        response.data.message || 'Tankerkoenig API error',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return response.data;
  }

  // Batch-Preisabfrage: max 10 Tankstellen-IDs gleichzeitig
  async getPrices(ids: string[]): Promise<TKPricesResponse> {
    const response = await firstValueFrom(
      this.httpService.get<TKPricesResponse>(`${this.baseUrl}prices.php`, {
        params: {
          ids: ids.join(','),
          apikey: this.apiKey,
        },
      }),
    );

    if (!response.data.ok) {
      throw new HttpException(
        response.data.message || 'Tankerkoenig API error',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return response.data;
  }

  // Detailabfrage: Oeffnungszeiten, Overrides, wholeDay - nur fuer Detailansicht
  async getStationDetail(id: string): Promise<TKDetailResponse> {
    const response = await firstValueFrom(
      this.httpService.get<TKDetailResponse>(`${this.baseUrl}detail.php`, {
        params: {
          id,
          apikey: this.apiKey,
        },
      }),
    );

    if (!response.data.ok) {
      throw new HttpException(
        response.data.message || 'Tankerkoenig API error',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return response.data;
  }
}
