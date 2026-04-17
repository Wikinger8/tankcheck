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

function PriceChip({ label, price, accent }: { label: string; price: number | false; accent: string }) {
  if (typeof price !== 'number') return null;
  return (
    <div className="flex flex-col items-center rounded-lg bg-[#1c1c22] border border-[#2a2a34] px-3 py-2">
      <span className="text-[10px] font-bold text-[#555566] uppercase">{label}</span>
      <span className={`text-sm font-extrabold tabular-nums ${accent}`}>{price.toFixed(3)}<span className="text-[10px] ml-0.5">€</span></span>
    </div>
  );
}

function getPriceColor(price: number, min: number, max: number): string {
  if (max === min) return 'text-[#00e5a0]';
  const ratio = (price - min) / (max - min);
  if (ratio <= 0.33) return 'text-[#00e5a0]';
  if (ratio <= 0.66) return 'text-[#fbbf24]';
  return 'text-[#ef4444]';
}

export function StationCard({ station, selectedFuel, priceMin, priceMax }: StationCardProps) {
  const fuelKey = selectedFuel === FuelType.ALL ? null : (selectedFuel as 'e5' | 'e10' | 'diesel');
  const mainPrice = fuelKey ? station[fuelKey] : null;
  const priceColor = typeof mainPrice === 'number' && priceMin !== undefined && priceMax !== undefined
    ? getPriceColor(mainPrice, priceMin, priceMax)
    : 'text-[#e8e8ec]';

  return (
    <Link href={`/station/${station.id}`}>
      <div className="rounded-xl bg-[#141418] border border-[#2a2a34] hover:border-[#3a3a48] active:scale-[0.98] transition-all duration-150 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <BrandIcon brand={station.brand} size={36} />
              <div className="min-w-0">
                <p className="font-bold text-white truncate text-[15px]">{station.brand}</p>
                <p className="text-xs text-[#555566] truncate">{station.street} {station.houseNumber}, {station.place}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {typeof station.dist === 'number' && (
                <span className="text-[11px] text-[#555566] font-medium tabular-nums">{formatDistance(station.dist)}</span>
              )}
              <span className={`w-2 h-2 rounded-full shrink-0 ${station.isOpen ? 'bg-[#00e5a0]' : 'bg-[#ef4444]'}`} />
            </div>
          </div>

          {fuelKey && typeof mainPrice === 'number' ? (
            <div className="mt-3 flex items-center justify-center rounded-lg bg-[#1c1c22] border border-[#2a2a34] py-2.5">
              <span className={`text-2xl font-extrabold tabular-nums tracking-tight ${priceColor}`}>{mainPrice.toFixed(3)}</span>
              <span className="text-sm font-bold ml-1 text-[#555566]">€/L</span>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <PriceChip label="E5" price={station.e5} accent="text-[#60a5fa]" />
              <PriceChip label="E10" price={station.e10} accent="text-[#00e5a0]" />
              <PriceChip label="Diesel" price={station.diesel} accent="text-[#fbbf24]" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
