export function formatPrice(price: number | false): string {
  if (price === false) return '\u2014';
  return price.toLocaleString('de-DE', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}
