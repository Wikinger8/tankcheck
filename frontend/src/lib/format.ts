export function formatPrice(price: number | false | undefined | null): string {
  if (!price && price !== 0) return '\u2014';
  return price.toLocaleString('de-DE', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}
