import { getItem, setItem } from './storage';

interface PriceSnapshot {
  timestamp: number;
  e5: number | false;
  e10: number | false;
  diesel: number | false;
}

type PriceHistoryStore = Record<string, PriceSnapshot[]>;

const KEY = 'tankcheck_price_history';
const MAX_ENTRIES = 100;
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function pruneOld(snapshots: PriceSnapshot[]): PriceSnapshot[] {
  const cutoff = Date.now() - MAX_AGE_MS;
  return snapshots.filter((s) => s.timestamp > cutoff).slice(-MAX_ENTRIES);
}

export function recordPrices(
  stationId: string,
  prices: { e5: number | false; e10: number | false; diesel: number | false },
): void {
  const store = getItem<PriceHistoryStore>(KEY, {});
  const existing = store[stationId] || [];
  const last = existing[existing.length - 1];
  if (last && Date.now() - last.timestamp < 5 * 60 * 1000) return;
  existing.push({ timestamp: Date.now(), ...prices });
  store[stationId] = pruneOld(existing);
  setItem(KEY, store);
}

export function getHistory(stationId: string): PriceSnapshot[] {
  const store = getItem<PriceHistoryStore>(KEY, {});
  return pruneOld(store[stationId] || []);
}

export function getWeeklyPattern(
  stationId: string,
  fuelType: 'e5' | 'e10' | 'diesel',
): { day: string; avgPrice: number }[] {
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const buckets: Record<number, number[]> = {};
  for (let i = 0; i < 7; i++) buckets[i] = [];

  const history = getHistory(stationId);
  for (const snap of history) {
    const val = snap[fuelType];
    if (typeof val === 'number') {
      buckets[new Date(snap.timestamp).getDay()].push(val);
    }
  }

  return days.map((day, i) => {
    const vals = buckets[i];
    const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    return { day, avgPrice: Math.round(avg * 1000) / 1000 };
  });
}

export function getPriceTrend(
  stationId: string,
  fuelType: 'e5' | 'e10' | 'diesel',
  currentPrice: number,
): 'up' | 'down' | 'stable' {
  const history = getHistory(stationId);
  if (history.length < 2) return 'stable';
  const prev = history[history.length - 2];
  const prevPrice = prev[fuelType];
  if (typeof prevPrice !== 'number') return 'stable';
  const diff = currentPrice - prevPrice;
  if (diff > 0.005) return 'up';
  if (diff < -0.005) return 'down';
  return 'stable';
}
