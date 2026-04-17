'use client';

import { useState, useCallback } from 'react';
import { getHistory, recordPrices, getPriceTrend, getWeeklyPattern } from '@/lib/price-history';

export function usePriceHistory(stationId: string) {
  const [history, setHistory] = useState(() => getHistory(stationId));

  const record = useCallback(
    (prices: { e5: number | false; e10: number | false; diesel: number | false }) => {
      recordPrices(stationId, prices);
      setHistory(getHistory(stationId));
    },
    [stationId],
  );

  const trend = useCallback(
    (fuelType: 'e5' | 'e10' | 'diesel', currentPrice: number) =>
      getPriceTrend(stationId, fuelType, currentPrice),
    [stationId],
  );

  const weekly = useCallback(
    (fuelType: 'e5' | 'e10' | 'diesel') => getWeeklyPattern(stationId, fuelType),
    [stationId],
  );

  return { history, record, trend, weekly };
}
