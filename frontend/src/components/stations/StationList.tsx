'use client';

import type { Station } from '@tankcheck/shared';
import { FuelType } from '@tankcheck/shared';
import { StationCard } from './StationCard';
import { Button } from '@/components/ui/Button';

interface StationListProps {
  stations: Station[];
  selectedFuel: FuelType;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export function StationList({
  stations,
  selectedFuel,
  loading,
  error,
  onRetry,
}: StationListProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 text-red-400 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <p className="text-gray-600 mb-4">{error}</p>
        {onRetry && (
          <Button variant="primary" size="md" onClick={onRetry}>
            Erneut versuchen
          </Button>
        )}
      </div>
    );
  }

  if (!loading && stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 text-gray-300 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <p className="text-gray-500">Keine Tankstellen gefunden</p>
      </div>
    );
  }

  // Calculate price range for color coding
  const fuelKey = selectedFuel as 'e5' | 'e10' | 'diesel';
  const prices = stations
    .map((s) => s[fuelKey])
    .filter((p): p is number => typeof p === 'number');
  const priceMin = prices.length > 0 ? Math.min(...prices) : 0;
  const priceMax = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <div className="flex flex-col gap-3">
      {stations.map((station) => (
        <StationCard
          key={station.id}
          station={station}
          selectedFuel={selectedFuel}
          priceMin={priceMin}
          priceMax={priceMax}
        />
      ))}
    </div>
  );
}
