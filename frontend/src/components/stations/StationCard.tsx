import Link from 'next/link';
import type { Station } from '@tankcheck/shared';
import { FuelType } from '@tankcheck/shared';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PriceDisplay } from './PriceDisplay';
import { formatDistance } from '@/lib/distance';
import { getPriceColor } from '@/lib/price-color';
import { BrandIcon } from './BrandIcon';

interface StationCardProps {
  station: Station;
  selectedFuel: FuelType;
  priceMin?: number;
  priceMax?: number;
}

export function StationCard({ station, selectedFuel, priceMin, priceMax }: StationCardProps) {
  const fuelKey = selectedFuel === FuelType.ALL ? 'diesel' : selectedFuel;
  const price = station[fuelKey as 'e5' | 'e10' | 'diesel'];
  const colorClass =
    typeof price === 'number' && priceMin !== undefined && priceMax !== undefined
      ? getPriceColor(price, priceMin, priceMax)
      : '';

  return (
    <Link href={`/station/${station.id}`}>
      <Card className="active:bg-gray-50 dark:active:bg-gray-800 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <BrandIcon brand={station.brand} size={32} />
              <div className="min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate">{station.brand}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{station.name}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
              {station.street} {station.houseNumber}, {station.postCode} {station.place}
            </p>
          </div>
          <PriceDisplay
            price={price}
            fuelType={selectedFuel}
            colorClass={colorClass}
          />
        </div>
        <div className="flex items-center gap-2 mt-3">
          {station.dist !== undefined && (
            <Badge variant="gray">{formatDistance(station.dist)}</Badge>
          )}
          <Badge variant={station.isOpen ? 'success' : 'danger'}>
            {station.isOpen ? 'Ge\u00f6ffnet' : 'Geschlossen'}
          </Badge>
        </div>
      </Card>
    </Link>
  );
}
