export enum StorageKey {
  FAVORITES = 'tankcheck_favorites',
  ALERTS = 'tankcheck_alerts',
  SETTINGS = 'tankcheck_settings',
  GEO_CONSENT = 'tankcheck_geo_consent',
}

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function getItem<T>(key: string, defaultValue: T): T {
  if (!isClient()) return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

export function removeItem(key: string): void {
  if (!isClient()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Storage unavailable
  }
}
