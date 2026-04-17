import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { of } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { TankerkoenigService } from './tankerkoenig.service';
import { FuelType, SortOption } from '../../../packages/shared/src';

describe('TankerkoenigService', () => {
  let service: TankerkoenigService;
  let httpService: HttpService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'tankerkoenigApiKey') return 'test-api-key';
      return undefined;
    }),
  };

  const createAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TankerkoenigService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TankerkoenigService>(TankerkoenigService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchStations', () => {
    it('should call list.php with correct params', async () => {
      const mockResponse = createAxiosResponse({
        ok: true,
        license: 'CC BY 4.0',
        data: 'MTS-K',
        status: 'ok',
        stations: [
          {
            id: '1',
            name: 'Test Station',
            brand: 'Test',
            street: 'Test St',
            houseNumber: '1',
            postCode: 12345,
            place: 'Berlin',
            lat: 52.52,
            lng: 13.405,
            dist: 1.5,
            diesel: 1.459,
            e5: 1.659,
            e10: 1.599,
            isOpen: true,
          },
        ],
      });

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.searchStations(
        52.52,
        13.405,
        5,
        FuelType.E5,
        SortOption.PRICE,
      );

      expect(httpService.get).toHaveBeenCalledWith(
        'https://creativecommons.tankerkoenig.de/json/list.php',
        {
          params: {
            lat: 52.52,
            lng: 13.405,
            rad: 5,
            type: 'e5',
            sort: 'price',
            apikey: 'test-api-key',
          },
        },
      );

      expect(result.ok).toBe(true);
      expect(result.stations).toHaveLength(1);
      expect(result.stations[0].name).toBe('Test Station');
    });

    it('should throw HttpException when API returns ok=false', async () => {
      const mockResponse = createAxiosResponse({
        ok: false,
        license: '',
        data: '',
        status: 'error',
        stations: [],
        message: 'API key invalid',
      });

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      await expect(
        service.searchStations(52.52, 13.405, 5, FuelType.E5, SortOption.PRICE),
      ).rejects.toThrow(HttpException);

      await expect(
        service.searchStations(52.52, 13.405, 5, FuelType.E5, SortOption.PRICE),
      ).rejects.toThrow('API key invalid');
    });
  });

  describe('getPrices', () => {
    it('should call prices.php with comma-separated IDs', async () => {
      const ids = ['uuid-1', 'uuid-2'];
      const mockResponse = createAxiosResponse({
        ok: true,
        license: 'CC BY 4.0',
        data: 'MTS-K',
        prices: {
          'uuid-1': { status: 'open' as const, e5: 1.659, e10: 1.599, diesel: 1.459 },
          'uuid-2': { status: 'closed' as const, e5: false, e10: false, diesel: false },
        },
      });

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getPrices(ids);

      expect(httpService.get).toHaveBeenCalledWith(
        'https://creativecommons.tankerkoenig.de/json/prices.php',
        {
          params: {
            ids: 'uuid-1,uuid-2',
            apikey: 'test-api-key',
          },
        },
      );

      expect(result.ok).toBe(true);
      expect(result.prices['uuid-1'].e5).toBe(1.659);
    });
  });

  describe('getStationDetail', () => {
    it('should call detail.php with correct id', async () => {
      const mockResponse = createAxiosResponse({
        ok: true,
        license: 'CC BY 4.0',
        data: 'MTS-K',
        status: 'ok',
        station: {
          id: 'test-uuid',
          name: 'Test Station',
          brand: 'Test',
          street: 'Test St',
          houseNumber: '1',
          postCode: 12345,
          place: 'Berlin',
          lat: 52.52,
          lng: 13.405,
          diesel: 1.459,
          e5: 1.659,
          e10: 1.599,
          isOpen: true,
          openingTimes: [{ text: 'Mo-Fr', start: '06:00', end: '22:00' }],
          overrides: [],
          wholeDay: false,
          state: 'Berlin',
        },
      });

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getStationDetail('test-uuid');

      expect(httpService.get).toHaveBeenCalledWith(
        'https://creativecommons.tankerkoenig.de/json/detail.php',
        {
          params: {
            id: 'test-uuid',
            apikey: 'test-api-key',
          },
        },
      );

      expect(result.ok).toBe(true);
      expect(result.station.name).toBe('Test Station');
    });

    it('should throw HttpException when API returns ok=false', async () => {
      const mockResponse = createAxiosResponse({
        ok: false,
        license: '',
        data: '',
        status: 'error',
        station: null as any,
        message: 'Station not found',
      });

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      await expect(service.getStationDetail('bad-uuid')).rejects.toThrow(
        HttpException,
      );
      await expect(service.getStationDetail('bad-uuid')).rejects.toThrow(
        'Station not found',
      );
    });
  });
});
