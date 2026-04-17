import { FuelType, FUEL_TYPE_LABELS } from '@tankcheck/shared';
import { formatPrice } from '@/lib/format';

interface PriceDisplayProps {
  price: number | false;
  fuelType: FuelType;
  colorClass?: string;
}

export function PriceDisplay({ price, fuelType, colorClass = '' }: PriceDisplayProps) {
  if (price === false) {
    return (
      <div className="text-right">
        <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">&mdash;</span>
        <p className="text-xs text-gray-500 dark:text-gray-400">{FUEL_TYPE_LABELS[fuelType]}</p>
      </div>
    );
  }

  const formatted = formatPrice(price);
  const mainPart = formatted.slice(0, -1);
  const lastDigit = formatted.slice(-1);

  return (
    <div className="text-right">
      <span className={`text-2xl font-bold ${colorClass || 'text-gray-900 dark:text-white'}`}>
        {mainPart}
        <sup className="text-sm">{lastDigit}</sup>
      </span>
      <p className="text-xs text-gray-500 dark:text-gray-400">{FUEL_TYPE_LABELS[fuelType]}</p>
    </div>
  );
}
