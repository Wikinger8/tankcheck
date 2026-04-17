'use client';

import { useMemo } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { usePrices } from '@/hooks/usePrices';
import { useLanguage } from '@/contexts/LanguageContext';
import FavoritesList from '@/components/favorites/FavoritesList';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const stationIds = useMemo(() => favorites.map((f) => f.stationId), [favorites]);
  const { prices, loading } = usePrices(stationIds);
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="mx-auto max-w-lg px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('favorites.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{favorites.length} gespeichert</p>

        {loading && favorites.length > 0 && (
          <div className="space-y-3">
            {Array.from({ length: Math.min(favorites.length, 3) }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 animate-pulse">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3 mb-1" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && favorites.length > 0 && (
          <FavoritesList favorites={favorites} prices={prices} onRemove={removeFavorite} />
        )}

        {favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
              <svg className="h-10 w-10 text-gray-300 dark:text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{t('favorites.empty')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[260px]">{t('favorites.emptyDesc')}</p>
          </div>
        )}
      </div>
    </main>
  );
}
