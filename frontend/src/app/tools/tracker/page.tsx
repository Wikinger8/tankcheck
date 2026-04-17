'use client';

import { useState } from 'react';
import { useConsumption } from '@/hooks/useConsumption';
import { exportConsumptionCSV } from '@/lib/export';

export default function TrackerPage() {
  const { entries, add, remove, stats } = useConsumption();
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [odometer, setOdometer] = useState(0);
  const [liters, setLiters] = useState(0);
  const [pricePerLiter, setPricePerLiter] = useState(0);
  const [fuelType, setFuelType] = useState<'e5' | 'e10' | 'diesel'>('diesel');
  const [stationName, setStationName] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (odometer <= 0 || liters <= 0 || pricePerLiter <= 0) return;
    add({
      date, odometer, liters, pricePerLiter,
      totalCost: Math.round(liters * pricePerLiter * 100) / 100,
      fuelType, stationName: stationName || undefined, note: note || undefined,
    });
    setShowForm(false);
    setOdometer(0); setLiters(0); setPricePerLiter(0); setStationName(''); setNote('');
  };

  const statCards = [
    { label: 'Ø Verbrauch', value: `${stats.avgConsumption} L/100km`, color: 'from-blue-600 to-indigo-600' },
    { label: 'Ausgaben', value: `${stats.totalCost.toFixed(0)} €`, color: 'from-emerald-500 to-teal-600' },
    { label: 'Strecke', value: `${stats.totalKm} km`, color: 'from-amber-500 to-orange-600' },
    { label: 'Einträge', value: `${stats.count}`, color: 'from-rose-500 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/tools" className="text-gray-600 dark:text-gray-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </a>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Verbrauchstracker</h1>
        </div>
        <div className="flex gap-2">
          {entries.length > 0 && (
            <button onClick={() => exportConsumptionCSV(entries)} className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              CSV
            </button>
          )}
          <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-4 py-2 text-sm font-medium shadow-lg transition-all duration-300 hover:shadow-xl">
            + Eintrag
          </button>
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((s) => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-lg`}>
              <p className="text-xs opacity-80">{s.label}</p>
              <p className="text-xl font-bold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Datum</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Kraftstoff</label>
                <select value={fuelType} onChange={(e) => setFuelType(e.target.value as 'e5' | 'e10' | 'diesel')} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none">
                  <option value="diesel">Diesel</option>
                  <option value="e5">E5</option>
                  <option value="e10">E10</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">km-Stand</label>
                <input type="number" value={odometer || ''} onChange={(e) => setOdometer(+e.target.value)} placeholder="0" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Liter</label>
                <input type="number" step="0.01" value={liters || ''} onChange={(e) => setLiters(+e.target.value)} placeholder="0" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">€/L</label>
                <input type="number" step="0.001" value={pricePerLiter || ''} onChange={(e) => setPricePerLiter(+e.target.value)} placeholder="0" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none" />
              </div>
            </div>
            <input value={stationName} onChange={(e) => setStationName(e.target.value)} placeholder="Tankstelle (optional)" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none" />
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-300">Abbrechen</button>
              <button onClick={handleSubmit} className="flex-1 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-300">Speichern</button>
            </div>
          </div>
        )}

        {entries.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Z" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Noch keine Einträge</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">Protokollieren Sie Ihre Tankfüllungen für Verbrauchsstatistiken.</p>
          </div>
        )}

        {entries.map((entry) => (
          <div key={entry.id} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">{entry.date} · {entry.fuelType.toUpperCase()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{entry.liters.toFixed(1)}L × {entry.pricePerLiter.toFixed(3)}€ = {entry.totalCost.toFixed(2)}€</p>
              {entry.stationName && <p className="text-xs text-gray-400 dark:text-gray-500">{entry.stationName}</p>}
            </div>
            <button onClick={() => remove(entry.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
