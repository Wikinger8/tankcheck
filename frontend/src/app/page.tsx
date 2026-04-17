'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { FuelType, SortOption } from '@tankcheck/shared';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSettings } from '@/hooks/useSettings';
import { useStationSearch } from '@/hooks/useStationSearch';
import { FuelTypeSelector } from '@/components/stations/FuelTypeSelector';
import { GeolocationConsent } from '@/components/consent/GeolocationConsent';

const MapOverview = dynamic(() => import('@/components/map/MapOverview'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 dark:bg-gray-900 animate-pulse" />,
});

export default function HomePage() {
  const { latitude, longitude, loading: geoLoading, isConsented, requestLocation } = useGeolocation();
  const { settings } = useSettings();
  const [fuelType, setFuelType] = useState(settings.fuelType);

  const { stations, loading } = useStationSearch({
    lat: latitude,
    lng: longitude,
    rad: settings.radius,
    fuelType,
    sortBy: SortOption.DISTANCE,
  });

  if (!isConsented) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <GeolocationConsent
          isOpen={true}
          onRequestLocation={requestLocation}
          onManualEntry={() => {}}
        />
      </div>
    );
  }

  if (geoLoading || !latitude || !longitude) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">Standort wird ermittelt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pb-20 flex flex-col">
      <div className="absolute top-2 left-2 right-2 z-[999]">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-3">
          <FuelTypeSelector value={fuelType} onChange={setFuelType} />
        </div>
      </div>
      <div className="flex-1 relative">
        {loading ? (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-900 animate-pulse flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : (
          <MapOverview
            stations={stations}
            userLat={latitude}
            userLng={longitude}
            selectedFuel={fuelType}
          />
        )}
      </div>
    </div>
  );
}
