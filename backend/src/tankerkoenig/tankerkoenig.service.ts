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
} from '@tankcheck/shared';

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
