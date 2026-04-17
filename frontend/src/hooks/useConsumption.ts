'use client';

import { useState, useCallback } from 'react';
import {
  getEntries,
  addEntry,
  deleteEntry,
  getStats,
  type ConsumptionEntry,
} from '@/lib/consumption';

export function useConsumption() {
  const [entries, setEntries] = useState<ConsumptionEntry[]>(() => getEntries());

  const add = useCallback((entry: Omit<ConsumptionEntry, 'id'>) => {
    addEntry(entry);
    setEntries(getEntries());
  }, []);

  const remove = useCallback((id: string) => {
    deleteEntry(id);
    setEntries(getEntries());
  }, []);

  const stats = getStats(entries);

  return { entries, add, remove, stats };
}
