'use client';

import { useState, useCallback, useEffect } from 'react';
import { getItem, setItem, removeItem, StorageKey } from '@/lib/storage';

type GeoStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';

interface UseGeolocationReturn {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  status: GeoStatus;
  requestLocation: () => void;
  isConsented: boolean;
  resetConsent: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [isConsented, setIsConsented] = useState(false);

  useEffect(() => {
    const consent = getItem<boolean>(StorageKey.GEO_CONSENT, false);
    setIsConsented(consent);
    if (consent) {
      requestBrowserLocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestBrowserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable');
      setError('Geolocation wird von Ihrem Browser nicht unterstützt.');
      return;
    }

    setStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setStatus('granted');
        setError(null);
      },
      (err) => {
        setStatus('denied');
        setError(
          err.code === 1
            ? 'Standortzugriff wurde verweigert.'
            : 'Standort konnte nicht ermittelt werden.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const requestLocation = useCallback(() => {
    setItem(StorageKey.GEO_CONSENT, true);
    setIsConsented(true);
    requestBrowserLocation();
  }, [requestBrowserLocation]);

  const resetConsent = useCallback(() => {
    removeItem(StorageKey.GEO_CONSENT);
    setIsConsented(false);
    setLatitude(null);
    setLongitude(null);
    setStatus('idle');
    setError(null);
  }, []);

  return {
    latitude,
    longitude,
    error,
    loading: status === 'requesting',
    status,
    requestLocation,
    isConsented,
    resetConsent,
  };
}
