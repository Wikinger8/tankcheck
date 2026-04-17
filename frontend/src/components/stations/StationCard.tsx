import Link from 'next/link';
import type { Station } from '@tankcheck/shared';
import { FuelType } from '@tankcheck/shared';
import { BrandIcon } from './BrandIcon';
import { formatDistance } from '@/lib/distance';

interface StationCardProps {
  station: Station;
  selectedFuel: FuelType;
  priceMin?: number;
  priceMax?: number;
}

function PriceChip({ label, price, color }: { label: string; price: number | false; color: string }) {
  if (typeof price !== 'number') return null;
  return (
    <div className={`flex flex-col items-center rounded-xl px-3 py-2 ${color}`}>
      <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{label}</span>
      <span className="text-base font-extrabold tabular-nums">{price.toFixed(3)}<span className="text-xs ml-0.5">€</span></span>
    </div>
  );
}

function getCheapestColor(price: number, min: number, max: number): string {
  if (max === min) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800';
  const ratio = (price - min) / (max - min);
  if (ratio <= 0.33) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800';
  if (ratio <= 0.66) return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800';
  return 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-800';
}

export function StationCard({ station, selectedFuel, priceMin, priceMax }: StationCardProps) {
  const fuelKey = selectedFuel === FuelType.ALL ? null : (selectedFuel as 'e5' | 'e10' | 'diesel');
  const mainPrice = fuelKey ? station[fuelKey] : null;
  const mainColor = typeof mainPrice === 'number' && priceMin !== undefined && priceMax !== undefined
    ? getCheapestColor(mainPrice, priceMin, priceMax)
    : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200';

  return (
    <Link href={`/station/${station.id}`}>
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <BrandIcon brand={station.brand} size={36} />
              <div className="min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate text-[15px]">{station.brand}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{station.street} {station.houseNumber}, {station.place}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {typeof station.dist === 'number' && (
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{formatDistance(station.dist)}</span>
              )}
              <span className={`w-2 h-2 rounded-full shrink-0 ${station.isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </div>
          </div>

          {fuelKey && typeof mainPrice === 'number' ? (
            <div className={`mt-3 flex items-center justify-center rounded-xl py-2.5 ${mainColor}`}>
              <span className="text-2xl font-extrabold tabular-nums tracking-tight">{mainPrice.toFixed(3)}</span>
              <span className="text-sm font-bold ml-1 opacity-70">€/L</span>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <PriceChip label="E5" price={station.e5} color="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" />
              <PriceChip label="E10" price={station.e10} color="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" />
              <PriceChip label="Diesel" price={station.diesel} color="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
