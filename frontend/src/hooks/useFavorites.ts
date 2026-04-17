'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Station, FavoriteStation } from '@tankcheck/shared';
import { getItem, setItem } from '@/lib/storage';

const STORAGE_KEY = 'tankcheck_favorites';
const FAVORITES_CHANGED_EVENT = 'favorites-changed';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteStation[]>([]);

  const loadFavorites = useCallback(() => {
    const stored = getItem<FavoriteStation[]>(STORAGE_KEY, []);
    setFavorites(stored);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    const handleChange = () => {
      loadFavorites();
    };
    window.addEventListener(FAVORITES_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(FAVORITES_CHANGED_EVENT, handleChange);
  }, [loadFavorites]);

  const dispatchChange = useCallback(() => {
    window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
  }, []);

  const getFavorites = useCallback((): FavoriteStation[] => {
    return getItem<FavoriteStation[]>(STORAGE_KEY, []);
  }, []);

  const addFavorite = useCallback(
    (station: Station) => {
      const current = getFavorites();
      if (current.some((f) => f.stationId === station.id)) return;
      const favorite: FavoriteStation = {
        stationId: station.id,
        name: station.name,
        brand: station.brand,
        street: station.street,
        houseNumber: station.houseNumber,
        place: station.place,
        postCode: station.postCode,
        lat: station.lat,
        lng: station.lng,
        addedAt: new Date().toISOString(),
      };
      const updated = [...current, favorite];
      setItem(STORAGE_KEY, updated);
      setFavorites(updated);
      dispatchChange();
    },
    [getFavorites, dispatchChange]
  );

  const removeFavorite = useCallback(
    (stationId: string) => {
      const current = getFavorites();
      const updated = current.filter((f) => f.stationId !== stationId);
      setItem(STORAGE_KEY, updated);
      setFavorites(updated);
      dispatchChange();
    },
    [getFavorites, dispatchChange]
  );

  const isFavorite = useCallback(
    (stationId: string): boolean => {
      return favorites.some((f) => f.stationId === stationId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (station: Station) => {
      if (isFavorite(station.id)) {
        removeFavorite(station.id);
      } else {
        addFavorite(station);
      }
    },
    [isFavorite, removeFavorite, addFavorite]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
