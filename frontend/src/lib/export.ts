import type { ConsumptionEntry } from './consumption';

export function exportConsumptionCSV(entries: ConsumptionEntry[]): void {
  const header = 'Datum;Kilometerstand;Liter;Preis/L;Gesamtkosten;Kraftstoff;Tankstelle;Notiz';
  const fmt = (n: number) => n.toFixed(2).replace('.', ',');
  const rows = entries.map((e) =>
    [
      e.date,
      e.odometer.toString(),
      fmt(e.liters),
      fmt(e.pricePerLiter),
      fmt(e.totalCost),
      e.fuelType.toUpperCase(),
      e.stationName || '',
      e.note || '',
    ].join(';'),
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tankcheck_verbrauch.csv';
  a.click();
  URL.revokeObjectURL(url);
}
