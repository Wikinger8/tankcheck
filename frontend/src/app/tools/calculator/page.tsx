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
    <div className="min-h-screen bg-[#0c0c0f] pb-24">
      <header className="bg-[#0c0c0f]/95 backdrop-blur-sm border-b border-[#2a2a34] px-4 py-4 flex items-center gap-3">
        <a href="/tools" className="text-[#555566] hover:text-[#00e5a0] transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </a>
        <h1 className="text-xl font-bold text-white">Kostenrechner</h1>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <div className="bg-[#141418] border border-[#00e5a0]/30 rounded-xl p-6 text-center">
          <p className="text-xs font-bold text-[#555566] uppercase tracking-widest mb-1">Gesamtkosten</p>
          <p className="text-4xl font-bold text-[#00e5a0]">{totalCost.toFixed(2)} €</p>
          <p className="text-sm text-[#8888a0] mt-2">{costPerKm.toFixed(2)} € pro km</p>
        </div>

        <div className="bg-[#141418] border border-[#2a2a34] rounded-xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8888a0] mb-2">Tankgröße</label>
            <div className="flex gap-1.5 mb-2">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => { setTankSize(p.value); savePrefs(p.value, consumption); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tankSize === p.value ? 'bg-[#00e5a0] text-[#0c0c0f]' : 'bg-[#1c1c22] text-[#555566] border border-[#2a2a34]'}`}
                >
                  {p.label} ({p.value}L)
                </button>
              ))}
            </div>
            <input
              type="range" min="10" max="120" value={tankSize}
              onChange={(e) => { setTankSize(+e.target.value); savePrefs(+e.target.value, consumption); }}
              className="w-full accent-[#00e5a0] h-2"
            />
            <p className="text-center text-sm text-[#555566] tabular-nums">{tankSize} Liter</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8888a0] mb-1">Preis pro Liter (€)</label>
            <input
              type="number" step="0.001" value={price}
              onChange={(e) => setPrice(+e.target.value)}
              className="w-full bg-[#1c1c22] border border-[#2a2a34] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00e5a0]/20 focus:border-[#00e5a0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8888a0] mb-1">Verbrauch (L/100km)</label>
            <input
              type="number" step="0.1" value={consumption}
              onChange={(e) => { setConsumption(+e.target.value); savePrefs(tankSize, +e.target.value); }}
              className="w-full bg-[#1c1c22] border border-[#2a2a34] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00e5a0]/20 focus:border-[#00e5a0] focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-[#141418] border border-[#2a2a34] rounded-xl p-4 space-y-4">
          <h2 className="font-bold text-white">Sparvergleich</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#555566] mb-1">Station A (€/L)</label>
              <input
                type="number" step="0.001" value={priceA}
                onChange={(e) => setPriceA(+e.target.value)}
                className="w-full bg-[#1c1c22] border border-[#2a2a34] rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-[#00e5a0]/20 focus:border-[#00e5a0] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#555566] mb-1">Station B (€/L)</label>
              <input
                type="number" step="0.001" value={priceB}
                onChange={(e) => setPriceB(+e.target.value)}
                className="w-full bg-[#1c1c22] border border-[#2a2a34] rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-[#00e5a0]/20 focus:border-[#00e5a0] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#555566] mb-1">Mehrweg zu Station A (km)</label>
            <input
              type="number" step="1" value={extraKm}
              onChange={(e) => setExtraKm(+e.target.value)}
              className="w-full bg-[#1c1c22] border border-[#2a2a34] rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-[#00e5a0]/20 focus:border-[#00e5a0] focus:outline-none"
            />
          </div>
          <div className={`rounded-xl p-4 text-center border ${savingsTotal > 0 ? 'bg-[#00e5a0]/5 border-[#00e5a0]/20' : 'bg-[#ef4444]/5 border-[#ef4444]/20'}`}>
            <p className="text-sm text-[#8888a0]">
              {savingsTotal > 0 ? 'Sie sparen' : 'Mehrkosten'}
            </p>
            <p className={`text-2xl font-bold ${savingsTotal > 0 ? 'text-[#00e5a0]' : 'text-[#ef4444]'}`}>
              {Math.abs(savingsTotal).toFixed(2)} €
            </p>
            <p className="text-xs text-[#555566] mt-1">
              bei {tankSize}L Tankfüllung und {extraKm}km Umweg
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
