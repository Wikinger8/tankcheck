'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { StationDetail } from '@tankcheck/shared';

export function useStationDetail(id: string) {
  const [station, setStation] = useState<StationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getStationDetail(id);
      setStation(response.station);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { station, loading, error, refetch: fetchDetail };
}
