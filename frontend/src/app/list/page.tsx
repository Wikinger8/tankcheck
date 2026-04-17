'use client';

import { useState, useCallback } from 'react';
import { SortOption } from '@tankcheck/shared';
import type { Station } from '@tankcheck/shared';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSettings } from '@/hooks/useSettings';
import { useStationSearch } from '@/hooks/useStationSearch';
import { GeolocationConsent } from '@/components/consent/GeolocationConsent';
import { FuelTypeSelector } from '@/components/stations/FuelTypeSelector';
import { StationList } from '@/components/stations/StationList';
import { StationListSkeleton } from '@/components/stations/StationListSkeleton';
import { FilterBar } from '@/components/filters/FilterBar';

export default function ListPage() {
  const { latitude, longitude, loading: geoLoading, isConsented, requestLocation } = useGeolocation();
  const { settings, updateSettings } = useSettings();
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
        <GeolocationConsent isOpen={true} onRequestLocation={requestLocation} onManualEntry={() => {}} />
      </div>
    );
  }

  if (geoLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 px-4 pt-3 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Tankstellen</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={refetch}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
            </button>
            <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
              {(['price', 'dist'] as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    sortBy === opt
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {opt === 'price' ? 'Preis' : 'Nähe'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <FuelTypeSelector
          value={settings.fuelType}
          onChange={(fuelType) => updateSettings({ fuelType })}
        />

        <FilterBar stations={stations} onFilter={handleFilter} />
      </div>

      <main className="px-4 py-3 max-w-lg mx-auto pb-24">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
          {displayStations.length} Tankstellen im Umkreis von {settings.radius} km
        </p>
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
