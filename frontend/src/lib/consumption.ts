import { getItem, setItem } from './storage';

export interface ConsumptionEntry {
  id: string;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  fuelType: 'e5' | 'e10' | 'diesel';
  stationName?: string;
  note?: string;
}

const KEY = 'tankcheck_consumption';

export function getEntries(): ConsumptionEntry[] {
  return getItem<ConsumptionEntry[]>(KEY, []).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function addEntry(entry: Omit<ConsumptionEntry, 'id'>): ConsumptionEntry {
  const entries = getItem<ConsumptionEntry[]>(KEY, []);
  const newEntry = { ...entry, id: crypto.randomUUID() };
  entries.push(newEntry);
  setItem(KEY, entries);
  return newEntry;
}

export function deleteEntry(id: string): void {
  const entries = getItem<ConsumptionEntry[]>(KEY, []);
  setItem(KEY, entries.filter((e) => e.id !== id));
}

export function getStats(entries: ConsumptionEntry[]) {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  let totalConsumption = 0;
  let segments = 0;
  for (let i = 1; i < sorted.length; i++) {
    const dist = sorted[i].odometer - sorted[i - 1].odometer;
    if (dist > 0) {
      totalConsumption += (sorted[i].liters / dist) * 100;
      segments++;
    }
  }
  return {
    avgConsumption: segments > 0 ? Math.round((totalConsumption / segments) * 10) / 10 : 0,
    totalCost: Math.round(entries.reduce((s, e) => s + e.totalCost, 0) * 100) / 100,
    totalKm: sorted.length >= 2 ? sorted[sorted.length - 1].odometer - sorted[0].odometer : 0,
    count: entries.length,
  };
}
