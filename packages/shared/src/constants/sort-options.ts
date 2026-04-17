export enum SortOption {
  PRICE = 'price',
  DISTANCE = 'dist',
}

export const SORT_OPTION_LABELS: Record<SortOption, string> = {
  [SortOption.PRICE]: 'Preis',
  [SortOption.DISTANCE]: 'Entfernung',
};
