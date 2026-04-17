'use client';

import { useState, useCallback } from 'react';
import { getItem, setItem } from '@/lib/storage';

interface StationNote {
  note: string;
  rating: number;
  updatedAt: string;
}

const KEY = 'tankcheck_station_notes';

export function useNotes(stationId: string) {
  const [data, setData] = useState<StationNote>(() => {
    const store = getItem<Record<string, StationNote>>(KEY, {});
    return store[stationId] || { note: '', rating: 0, updatedAt: '' };
  });

  const save = useCallback(
    (note: string, rating: number) => {
      const store = getItem<Record<string, StationNote>>(KEY, {});
      const updated = { note, rating, updatedAt: new Date().toISOString() };
      store[stationId] = updated;
      setItem(KEY, store);
      setData(updated);
    },
    [stationId],
  );

  return { note: data.note, rating: data.rating, save };
}
