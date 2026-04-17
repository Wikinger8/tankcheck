'use client';

import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FuelType, FUEL_TYPE_LABELS } from '@tankcheck/shared';
import { useStationDetail } from '@/hooks/useStationDetail';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PriceDisplay } from '@/components/stations/PriceDisplay';

const StationMap = dynamic(() => import('@/components/map/StationMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[50vh] bg-gray-200 animate-pulse" />,
});

export default function StationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { station, loading, error } = useStationDetail(id);
  const { latitude, longitude } = useGeolocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        </header>
        <div className="w-full h-[50vh] bg-gray-200 animate-pulse" />
        <div className="px-4 py-4 space-y-4">
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-24 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Fehler</h1>
        </header>
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <p className="text-gray-600 mb-4">{error || 'Tankstelle nicht gefunden.'}</p>
          <Button variant="primary" onClick={() => router.back()}>
            Zurück
          </Button>
        </div>
      </div>
    );
  }

  const fuelTypes: Array<{ key: 'e5' | 'e10' | 'diesel'; type: FuelType }> = [
    { key: 'e5', type: FuelType.E5 },
    { key: 'e10', type: FuelType.E10 },
    { key: 'diesel', type: FuelType.DIESEL },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 truncate">{station.brand}</h1>
          <p className="text-sm text-gray-500 truncate">{station.name}</p>
        </div>
      </header>

      {/* Map */}
      <div className="w-full h-[50vh]">
        <StationMap
          station={{ lat: station.lat, lng: station.lng, name: station.name }}
          userLocation={latitude && longitude ? { lat: latitude, lng: longitude } : undefined}
        />
      </div>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Price cards */}
        <div className="grid grid-cols-3 gap-3">
          {fuelTypes.map(({ key, type }) => (
            <Card key={key} className="flex flex-col items-center justify-center py-4">
              <PriceDisplay
                price={station[key]}
                fuelType={type}
              />
            </Card>
          ))}
        </div>

        {/* Opening times */}
        {station.openingTimes && station.openingTimes.length > 0 && (
          <Card>
            <h2 className="font-semibold text-gray-900 mb-3">Öffnungszeiten</h2>
            <ul className="space-y-2">
              {station.openingTimes.map((time, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{time.text}</span>
                  <span className="text-gray-900 font-medium">
                    {time.start} - {time.end}
                  </span>
                </li>
              ))}
            </ul>
            {station.wholeDay && (
              <p className="text-sm text-emerald-600 mt-2 font-medium">24 Stunden geöffnet</p>
            )}
          </Card>
        )}

        {/* Address */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-2">Adresse</h2>
          <p className="text-sm text-gray-600 mb-3">
            {station.street} {station.houseNumber}
            <br />
            {station.postCode} {station.place}
          </p>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="md" className="w-full">
              Route planen
            </Button>
          </a>
        </Card>

        {/* Attribution */}
        <p className="text-xs text-gray-400 text-center pb-4">
          Preisdaten: CC BY 4.0 - tankerkoenig.de
        </p>
      </main>
    </div>
  );
}
