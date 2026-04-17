import { Test, TestingModule } from '@nestjs/testing';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { FuelType, SortOption, Station, StationDetail } from '@tankcheck/shared';

describe('StationsController', () => {
  let controller: StationsController;
  let service: StationsService;

  const mockStations: Station[] = [
    {
      id: 'uuid-1',
      name: 'Shell Berlin',
      brand: 'Shell',
      street: 'Hauptstr.',
      houseNumber: '10',
      postCode: 10115,
      place: 'Berlin',
      lat: 52.52,
      lng: 13.405,
      dist: 1.2,
      diesel: 1.459,
      e5: 1.659,
      e10: 1.599,
      isOpen: true,
    },
    {
      id: 'uuid-2',
      name: 'Aral Berlin',
      brand: 'Aral',
      street: 'Nebenstr.',
      houseNumber: '5',
      postCode: 10117,
      place: 'Berlin',
      lat: 52.521,
      lng: 13.41,
      dist: 2.1,
      diesel: 1.479,
      e5: 1.679,
      e10: 1.619,
      isOpen: true,
    },
  ];

  const mockStationDetail: StationDetail = {
    id: 'uuid-1',
    name: 'Shell Berlin',
    brand: 'Shell',
    street: 'Hauptstr.',
    houseNumber: '10',
    postCode: 10115,
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
  };

  const mockStationsService = {
    search: jest.fn().mockResolvedValue(mockStations),
    getDetail: jest.fn().mockResolvedValue(mockStationDetail),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StationsController],
      providers: [
        {
          provide: StationsService,
          useValue: mockStationsService,
        },
      ],
    }).compile();

    controller = module.get<StationsController>(StationsController);
    service = module.get<StationsService>(StationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should return stations from service', async () => {
      const query = {
        lat: 52.52,
        lng: 13.405,
        rad: 5,
        type: FuelType.E5,
        sort: SortOption.PRICE,
      };

      const result = await controller.search(query);

      expect(service.search).toHaveBeenCalledWith(
        52.52,
        13.405,
        5,
        FuelType.E5,
        SortOption.PRICE,
      );
      expect(result).toEqual({ ok: true, stations: mockStations });
      expect(result.stations).toHaveLength(2);
    });
  });

  describe('getDetail', () => {
    it('should return station detail from service', async () => {
      const result = await controller.getDetail('uuid-1');

      expect(service.getDetail).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual({ ok: true, station: mockStationDetail });
      expect(result.station.name).toBe('Shell Berlin');
      expect(result.station.openingTimes).toHaveLength(1);
    });
  });
});
