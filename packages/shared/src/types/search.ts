import { FuelType } from '../constants/fuel-types';
import { SortOption } from '../constants/sort-options';

export interface SearchParams {
  lat: number;
  lng: number;
  rad: number;
  type: FuelType;
  sort: SortOption;
}
