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
  loading: () => <div className="w-full h-full bg-[#141418] animate-pulse" />,
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
      <div className="mx-3 mt-2 rounded-xl bg-[#141418] border border-[#00e5a0]/30 p-3.5 shadow-lg shadow-[#00e5a0]/5 active:scale-[0.98] transition-transform">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <BrandIcon brand={cheapest.brand} size={36} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#00e5a0] uppercase tracking-widest">Bestpreis</span>
                {typeof cheapest.dist === 'number' && (
                  <span className="text-[10px] text-[#555566]">{formatDistance(cheapest.dist)}</span>
                )}
              </div>
              <p className="text-white font-bold text-sm truncate">{cheapest.brand}</p>
              <p className="text-[#555566] text-xs truncate">{cheapest.street} {cheapest.houseNumber}, {cheapest.place}</p>
            </div>
          </div>
          <div className="text-right shrink-0 pl-3">
            <p className="text-[#00e5a0] text-2xl font-extrabold tabular-nums tracking-tight">{price.toFixed(3)}</p>
            <p className="text-[#555566] text-[10px] font-bold uppercase">€/Liter</p>
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
      <div className="min-h-screen bg-[#0c0c0f]">
        <GeolocationConsent isOpen={true} onRequestLocation={requestLocation} onManualEntry={() => {}} />
      </div>
    );
  }

  if (geoLoading || !latitude || !longitude) {
    return (
      <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#00e5a0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#555566] text-sm">Standort wird ermittelt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ paddingBottom: 'calc(56px + var(--safe-bottom))' }}>
      <div className="absolute top-0 left-0 right-0 z-[999] pt-2 space-y-0">
        <div className="mx-3 bg-[#0c0c0f]/90 backdrop-blur-sm rounded-xl border border-[#2a2a34] p-2.5">
          <FuelTypeSelector value={fuelType} onChange={setFuelType} />
        </div>
        {!loading && stations.length > 0 && (
          <CheapestHero stations={stations} fuelKey={fuelKey} />
        )}
      </div>
      <div className="flex-1">
        {loading ? (
          <div className="w-full h-full bg-[#141418] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#00e5a0] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <MapOverview stations={stations} userLat={latitude} userLng={longitude} selectedFuel={fuelType} />
        )}
      </div>
    </div>
  );
}
