'use client';

import Link from 'next/link';
import type { FavoriteStation, StationPrices } from '@tankcheck/shared';

interface FavoritesListProps {
  favorites: FavoriteStation[];
  prices: Record<string, StationPrices>;
  onRemove: (id: string) => void;
}

function formatPrice(price: number | false): string {
  if (price === false) return '-';
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{fav.brand}</p>
                <p className="text-sm text-gray-600 truncate">{fav.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {fav.street} {fav.houseNumber}, {fav.postCode} {fav.place}
                </p>
                {stationPrices && (
                  <div className="flex gap-3 mt-2">
                    {stationPrices.e5 !== false && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        E5: {formatPrice(stationPrices.e5)}
                      </span>
                    )}
                    {stationPrices.e10 !== false && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        E10: {formatPrice(stationPrices.e10)}
                      </span>
                    )}
                    {stationPrices.diesel !== false && (
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
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
                className="ml-3 flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
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
