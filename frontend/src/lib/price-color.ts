export function getPriceColor(price: number, min: number, max: number): string {
  if (max === min) return 'text-emerald-600';
  const ratio = (price - min) / (max - min);
  if (ratio <= 0.33) return 'text-emerald-600';
  if (ratio <= 0.66) return 'text-amber-600';
  return 'text-red-600';
}
