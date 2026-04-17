'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FuelType, SortOption } from '@tankcheck/shared';
import { api } from '@/lib/api';
import type { Station } from '@tankcheck/shared';

interface UseStationSearchParams {
  lat: number | null;
  lng: number | null;
  rad: number;
  fuelType: FuelType;
  sortBy: SortOption;
}

interface UseStationSearchReturn {
  stations: Station[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStationSearch({
  lat,
  lng,
  rad,
  fuelType,
  sortBy,
}: UseStationSearchParams): UseStationSearchReturn {
  const [rawStations, setRawStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStations = useCallback(async () => {
    if (lat === null || lng === null) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.searchStations({
        lat: lat.toString(),
        lng: lng.toString(),
        rad: rad.toString(),
        type: 'all',
        sort: 'dist',
      });
      setRawStations(response.stations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten.');
      setRawStations([]);
    } finally {
      setLoading(false);
    }
  }, [lat, lng, rad]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const stations = useMemo(() => {
    if (sortBy !== SortOption.PRICE) return rawStations;
    const fuelKey = fuelType === FuelType.ALL ? 'diesel' : (fuelType as 'e5' | 'e10' | 'diesel');
    return [...rawStations].sort((a, b) => {
      const pa = a[fuelKey];
      const pb = b[fuelKey];
      if (typeof pa !== 'number' && typeof pb !== 'number') return 0;
      if (typeof pa !== 'number') return 1;
      if (typeof pb !== 'number') return -1;
      return pa - pb;
    });
  }, [rawStations, fuelType, sortBy]);

  return { stations, loading, error, refetch: fetchStations };
}
