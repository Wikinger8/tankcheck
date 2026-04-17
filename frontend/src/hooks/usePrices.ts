'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { StationPrices } from '@tankcheck/shared';
import { api } from '@/lib/api';

export function usePrices(stationIds: string[]) {
  const [prices, setPrices] = useState<Record<string, StationPrices>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stabilize the stationIds reference to avoid infinite re-renders
  const idsKey = stationIds.join(',');
  const stableIds = useMemo(() => stationIds, [idsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPrices = useCallback(async () => {
    if (stableIds.length === 0) {
      setPrices({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allPrices: Record<string, StationPrices> = {};

      // Batch requests: max 10 IDs per request
      for (let i = 0; i < stableIds.length; i += 10) {
        const batch = stableIds.slice(i, i + 10);
        const batchPrices = await api.getPrices(batch);
        Object.assign(allPrices, batchPrices);
      }

      setPrices(allPrices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Preise');
    } finally {
      setLoading(false);
    }
  }, [stableIds]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return { prices, loading, error, refetch: fetchPrices };
}
