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
    <div className="space-y-3">
      {favorites.map((fav) => {
        const stationPrices = prices[fav.stationId];
        return (
          <Link
            key={fav.stationId}
            href={`/station/${fav.stationId}`}
            className="block"
          >
            <div className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg shadow-black/5 dark:shadow-black/20 p-4 flex items-center justify-between hover:shadow-xl transition-all duration-300">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate">{fav.brand}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{fav.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                  {fav.street} {fav.houseNumber}, {fav.postCode} {fav.place}
                </p>
                {stationPrices && (
                  <div className="flex gap-3 mt-2">
                    {stationPrices.e5 !== false && (
                      <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                        E5: {formatPrice(stationPrices.e5)}
                      </span>
                    )}
                    {stationPrices.e10 !== false && (
                      <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                        E10: {formatPrice(stationPrices.e10)}
                      </span>
                    )}
                    {stationPrices.diesel !== false && (
                      <span className="text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
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
                className="ml-3 flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
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
