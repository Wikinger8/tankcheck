'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FuelType, SortOption } from '@tankcheck/shared';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSettings } from '@/hooks/useSettings';
import { useStationSearch } from '@/hooks/useStationSearch';
import { FuelTypeSelector } from '@/components/stations/FuelTypeSelector';
import { BrandIcon } from '@/components/stations/BrandIcon';
import { GeolocationConsent } from '@/components/consent/GeolocationConsent';
import { formatDistance } from '@/lib/distance';

const MapOverview = dynamic(() => import('@/components/map/MapOverview'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 dark:bg-gray-900 animate-pulse" />,
});

function CheapestHero({ stations, fuelKey }: { stations: any[]; fuelKey: 'e5' | 'e10' | 'diesel' }) {
  const cheapest = stations.reduce<any | null>((best, s) => {
    const p = s[fuelKey];
    if (typeof p !== 'number') return best;
    if (!best || p < best[fuelKey]) return s;
    return best;
  }, null);

  if (!cheapest) return null;
  const price = cheapest[fuelKey] as number;

  return (
    <Link href={`/station/${cheapest.id}`}>
      <div className="mx-3 mt-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-white/20 rounded-xl p-1.5">
              <BrandIcon brand={cheapest.brand} size={32} />
            </div>
            <div className="min-w-0">
              <p className="text-emerald-50 text-[11px] font-semibold uppercase tracking-wider">Günstigste in der Nähe</p>
              <p className="text-white font-bold text-base truncate">{cheapest.brand}</p>
              <p className="text-emerald-100 text-xs truncate">{cheapest.street} {cheapest.houseNumber} · {typeof cheapest.dist === 'number' ? formatDistance(cheapest.dist) : cheapest.place}</p>
            </div>
          </div>
          <div className="text-right shrink-0 pl-3">
            <p className="text-white text-3xl font-extrabold tabular-nums tracking-tight">{price.toFixed(3)}</p>
            <p className="text-emerald-100 text-xs font-semibold">€/Liter</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

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

  const fuelKey = fuelType === FuelType.ALL ? 'diesel' : (fuelType as 'e5' | 'e10' | 'diesel');

  if (!isConsented) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <GeolocationConsent isOpen={true} onRequestLocation={requestLocation} onManualEntry={() => {}} />
      </div>
    );
  }

  if (geoLoading || !latitude || !longitude) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Standort wird ermittelt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pb-14 flex flex-col" style={{ paddingBottom: 'calc(56px + var(--safe-bottom))' }}>
      <div className="absolute top-0 left-0 right-0 z-[999] pt-2 px-3 space-y-0">
        <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg rounded-2xl shadow-lg shadow-black/5 border border-gray-200/50 dark:border-gray-800 p-2.5">
          <FuelTypeSelector value={fuelType} onChange={setFuelType} />
        </div>
        {!loading && stations.length > 0 && (
          <CheapestHero stations={stations} fuelKey={fuelKey} />
        )}
      </div>
      <div className="flex-1">
        {loading ? (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
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
