export enum FuelType {
  E5 = 'e5',
  E10 = 'e10',
  DIESEL = 'diesel',
  ALL = 'all',
}

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  [FuelType.E5]: 'Super E5',
  [FuelType.E10]: 'Super E10',
  [FuelType.DIESEL]: 'Diesel',
  [FuelType.ALL]: 'Alle',
};
