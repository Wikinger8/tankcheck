'use client';

import { useState } from 'react';
import { getItem, setItem } from '@/lib/storage';

interface CalcPrefs {
  tankSize: number;
  consumption: number;
}

const PRESETS = [
  { label: 'Klein', value: 35 },
  { label: 'Mittel', value: 50 },
  { label: 'Groß', value: 70 },
];

export default function CalculatorPage() {
  const saved = getItem<CalcPrefs>('tankcheck_calculator_prefs', { tankSize: 50, consumption: 7 });
  const [tankSize, setTankSize] = useState(saved.tankSize);
  const [price, setPrice] = useState(1.65);
  const [consumption, setConsumption] = useState(saved.consumption);
  const [priceA, setPriceA] = useState(1.65);
  const [priceB, setPriceB] = useState(1.72);
  const [extraKm, setExtraKm] = useState(5);

  const totalCost = tankSize * price;
  const costPerKm = (consumption / 100) * price;

  const savingsPerLiter = priceB - priceA;
  const fuelForExtraKm = (extraKm * consumption) / 100;
  const extraFuelCost = fuelForExtraKm * priceA;
  const savingsTotal = savingsPerLiter * tankSize - extraFuelCost;

  const savePrefs = (ts: number, c: number) => {
    setItem('tankcheck_calculator_prefs', { tankSize: ts, consumption: c });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 px-4 py-4 flex items-center gap-3">
        <a href="/tools" className="text-gray-600 dark:text-gray-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </a>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Kostenrechner</h1>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-center text-white shadow-lg">
          <p className="text-sm opacity-80 mb-1">Gesamtkosten</p>
          <p className="text-4xl font-bold">{totalCost.toFixed(2)} €</p>
          <p className="text-sm opacity-80 mt-2">{costPerKm.toFixed(2)} € pro km</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tankgröße</label>
            <div className="flex gap-2 mb-2">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => { setTankSize(p.value); savePrefs(p.value, consumption); }}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${tankSize === p.value ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >
                  {p.label} ({p.value}L)
                </button>
              ))}
            </div>
            <input
              type="range" min="10" max="120" value={tankSize}
              onChange={(e) => { setTankSize(+e.target.value); savePrefs(+e.target.value, consumption); }}
              className="w-full accent-blue-600"
            />
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">{tankSize} Liter</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preis pro Liter (€)</label>
            <input
              type="number" step="0.001" value={price}
              onChange={(e) => setPrice(+e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verbrauch (L/100km)</label>
            <input
              type="number" step="0.1" value={consumption}
              onChange={(e) => { setConsumption(+e.target.value); savePrefs(tankSize, +e.target.value); }}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-4 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Sparvergleich</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Station A (€/L)</label>
              <input
                type="number" step="0.001" value={priceA}
                onChange={(e) => setPriceA(+e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Station B (€/L)</label>
              <input
                type="number" step="0.001" value={priceB}
                onChange={(e) => setPriceB(+e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Mehrweg zu Station A (km)</label>
            <input
              type="number" step="1" value={extraKm}
              onChange={(e) => setExtraKm(+e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            />
          </div>
          <div className={`rounded-xl p-4 text-center ${savingsTotal > 0 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {savingsTotal > 0 ? 'Sie sparen' : 'Mehrkosten'}
            </p>
            <p className={`text-2xl font-bold ${savingsTotal > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {Math.abs(savingsTotal).toFixed(2)} €
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              bei {tankSize}L Tankfüllung und {extraKm}km Umweg
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
