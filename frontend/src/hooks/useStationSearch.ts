'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [stations, setStations] = useState<Station[]>([]);
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
        type: fuelType,
        sort: sortBy,
      });
      setStations(response.stations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten.');
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, [lat, lng, rad, fuelType, sortBy]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  return { stations, loading, error, refetch: fetchStations };
}
