'use client';

import Link from 'next/link';
import type { FavoriteStation, StationPrices } from '@tankcheck/shared';

interface FavoritesListProps {
  favorites: FavoriteStation[];
  prices: Record<string, StationPrices>;
  onRemove: (id: string) => void;
}

function formatPrice(price: number | false | undefined): string {
  if (!price && price !== 0) return '-';
  return price.toFixed(3) + ' \u20AC';
}

export default function FavoritesList({ favorites, prices, onRemove }: FavoritesListProps) {
  if (favorites.length === 0) return null;

  return (
    <div className="space-y-2">
      {favorites.map((fav) => {
        const stationPrices = prices[fav.stationId];
        return (
          <Link
            key={fav.stationId}
            href={`/station/${fav.stationId}`}
            className="block"
          >
            <div className="rounded-xl bg-[#141418] border border-[#2a2a34] p-4 flex items-center justify-between active:bg-[#1c1c22] transition-all">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{fav.brand}</p>
                <p className="text-sm text-[#8888a0] truncate">{fav.name}</p>
                <p className="text-xs text-[#555566] truncate">
                  {fav.street} {fav.houseNumber}, {fav.postCode} {fav.place}
                </p>
                {stationPrices && (
                  <div className="flex gap-2 mt-2">
                    {stationPrices.e5 !== false && (
                      <span className="text-xs bg-[#1c1c22] border border-[#2a2a34] text-[#60a5fa] px-2 py-0.5 rounded-lg font-bold tabular-nums">
                        E5: {formatPrice(stationPrices.e5)}
                      </span>
                    )}
                    {stationPrices.e10 !== false && (
                      <span className="text-xs bg-[#1c1c22] border border-[#2a2a34] text-[#00e5a0] px-2 py-0.5 rounded-lg font-bold tabular-nums">
                        E10: {formatPrice(stationPrices.e10)}
                      </span>
                    )}
                    {stationPrices.diesel !== false && (
                      <span className="text-xs bg-[#1c1c22] border border-[#2a2a34] text-[#fbbf24] px-2 py-0.5 rounded-lg font-bold tabular-nums">
                        Diesel: {formatPrice(stationPrices.diesel)}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(fav.stationId);
                }}
                className="ml-3 flex-shrink-0 p-2 text-[#555566] hover:text-[#ef4444] transition-colors"
                aria-label={`${fav.name} aus Favoriten entfernen`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
