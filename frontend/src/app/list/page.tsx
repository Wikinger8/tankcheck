'use client';

import { useState, useCallback } from 'react';
import { SortOption } from '@tankcheck/shared';
import type { Station } from '@tankcheck/shared';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSettings } from '@/hooks/useSettings';
import { useStationSearch } from '@/hooks/useStationSearch';
import { useLanguage } from '@/contexts/LanguageContext';
import { GeolocationConsent } from '@/components/consent/GeolocationConsent';
import { FuelTypeSelector } from '@/components/stations/FuelTypeSelector';
import { SortSelector } from '@/components/stations/SortSelector';
import { StationList } from '@/components/stations/StationList';
import { StationListSkeleton } from '@/components/stations/StationListSkeleton';
import { CitySearch } from '@/components/search/CitySearch';
import { FilterBar } from '@/components/filters/FilterBar';

export default function HomePage() {
  const { latitude, longitude, loading: geoLoading, isConsented, requestLocation } = useGeolocation();
  const { settings, updateSettings } = useSettings();
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.PRICE);
  const [filteredStations, setFilteredStations] = useState<Station[] | null>(null);

  const { stations, loading: stationsLoading, error, refetch } = useStationSearch({
    lat: latitude,
    lng: longitude,
    rad: settings.radius,
    fuelType: settings.fuelType,
    sortBy,
  });

  const handleFilter = useCallback((filtered: Station[]) => {
    setFilteredStations(filtered);
  }, []);

  const displayStations = filteredStations ?? stations;

  if (!isConsented) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 px-4 py-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-blue-600">
              <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
              <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z" clipRule="evenodd" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('home.title')}</h1>
          </div>
        </header>
        <GeolocationConsent
          isOpen={true}
          onRequestLocation={requestLocation}
          onManualEntry={() => {}}
        />
      </div>
    );
  }

  if (geoLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 px-4 py-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-blue-600">
              <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
              <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z" clipRule="evenodd" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('home.title')}</h1>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-blue-600">
              <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
              <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z" clipRule="evenodd" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('home.title')}</h1>
          </div>
          {latitude && longitude && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span>{t('home.locationActive')}</span>
            </div>
          )}
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <CitySearch onLocationSelect={() => {}} />

        <button
          onClick={refetch}
          className="w-full text-center text-sm text-blue-600 dark:text-blue-400 font-medium py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          {t('home.refresh')}
        </button>

        <FuelTypeSelector
          value={settings.fuelType}
          onChange={(fuelType) => updateSettings({ fuelType })}
        />

        <SortSelector value={sortBy} onChange={setSortBy} />

        <FilterBar stations={stations} onFilter={handleFilter} />

        {stationsLoading ? (
          <StationListSkeleton />
        ) : (
          <StationList
            stations={displayStations}
            selectedFuel={settings.fuelType}
            loading={stationsLoading}
            error={error}
            onRetry={refetch}
          />
        )}
      </main>
    </div>
  );
}
