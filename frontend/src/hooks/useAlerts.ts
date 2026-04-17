'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PriceAlert } from '@tankcheck/shared';
import { getItem, setItem } from '@/lib/storage';

const STORAGE_KEY = 'tankcheck_alerts';

export function useAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  const loadAlerts = useCallback(() => {
    const stored = getItem<PriceAlert[]>(STORAGE_KEY, []);
    setAlerts(stored);
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const getAlerts = useCallback((): PriceAlert[] => {
    return getItem<PriceAlert[]>(STORAGE_KEY, []);
  }, []);

  const addAlert = useCallback(
    (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'lastTriggered'>) => {
      const current = getAlerts();
      const newAlert: PriceAlert = {
        ...alert,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        lastTriggered: null,
      };
      const updated = [...current, newAlert];
      setItem(STORAGE_KEY, updated);
      setAlerts(updated);
    },
    [getAlerts]
  );

  const removeAlert = useCallback(
    (id: string) => {
      const current = getAlerts();
      const updated = current.filter((a) => a.id !== id);
      setItem(STORAGE_KEY, updated);
      setAlerts(updated);
    },
    [getAlerts]
  );

  const updateAlert = useCallback(
    (id: string, changes: Partial<PriceAlert>) => {
      const current = getAlerts();
      const updated = current.map((a) =>
        a.id === id ? { ...a, ...changes } : a
      );
      setItem(STORAGE_KEY, updated);
      setAlerts(updated);
    },
    [getAlerts]
  );

  return { alerts, addAlert, removeAlert, updateAlert };
}
