'use client';

import { useState, useEffect, useCallback } from 'react';
import { FuelType } from '@tankcheck/shared';
import { getItem, setItem, StorageKey } from '@/lib/storage';

interface Settings {
  fuelType: FuelType;
  radius: number;
  darkMode: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  fuelType: FuelType.DIESEL,
  radius: 5,
  darkMode: false,
};

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const stored = getItem<Settings>(StorageKey.SETTINGS, DEFAULT_SETTINGS);
    setSettingsState(stored);
  }, []);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...partial };
      setItem(StorageKey.SETTINGS, next);
      return next;
    });
  }, []);

  return { settings, updateSettings };
}
