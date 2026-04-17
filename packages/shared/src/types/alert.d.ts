import { FuelType } from '../constants/fuel-types';
export interface PriceAlert {
    id: string;
    stationId: string;
    stationName: string;
    stationBrand: string;
    fuelType: FuelType;
    threshold: number;
    createdAt: string;
    lastTriggered: string | null;
}
//# sourceMappingURL=alert.d.ts.map