'use client';

import { useState, useMemo } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { usePrices } from '@/hooks/usePrices';

export default function ComparePage() {
  const { favorites } = useFavorites();
  const [selected, setSelected] = useState<string[]>([]);
  const { prices } = usePrices(selected);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev,
    );
  };

  const fuelTypes = ['e5', 'e10', 'diesel'] as const;
  const cheapest = useMemo(() => {
    const result: Record<string, string> = {};
    for (const ft of fuelTypes) {
      let minPrice = Infinity;
      let minId = '';
      for (const id of selected) {
        const p = prices[id]?.[ft];
        if (typeof p === 'number' && p < minPrice) {
          minPrice = p;
          minId = id;
        }
      }
      if (minId) result[ft] = minId;
    }
    return result;
  }, [prices, selected]);

  return (
    <div className="min-h-screen bg-[#0c0c0f] pb-24">
      <header className="bg-[#0c0c0f]/95 backdrop-blur-sm border-b border-[#2a2a34] px-4 py-4 flex items-center gap-3">
        <a href="/tools" className="text-[#555566] hover:text-[#00e5a0] transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </a>
        <h1 className="text-xl font-bold text-white">Stationsvergleich</h1>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <div className="bg-[#141418] border border-[#2a2a34] rounded-xl p-4">
          <p className="text-sm font-bold text-[#8888a0] mb-3">Favoriten auswählen (max. 3)</p>
          {favorites.length === 0 ? (
            <p className="text-sm text-[#555566]">Fügen Sie zuerst Favoriten hinzu.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {favorites.map((fav) => (
                <button
                  key={fav.stationId}
                  onClick={() => toggle(fav.stationId)}
                  className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    selected.includes(fav.stationId)
                      ? 'bg-[#00e5a0] text-[#0c0c0f]'
                      : 'bg-[#1c1c22] text-[#555566] border border-[#2a2a34]'
                  }`}
                >
                  {fav.brand}
                </button>
              ))}
            </div>
          )}
        </div>

        {selected.length >= 2 && (
          <div className="space-y-3">
            {fuelTypes.map((ft) => (
              <div key={ft} className="bg-[#141418] border border-[#2a2a34] rounded-xl p-4">
                <p className="text-sm font-bold text-white mb-3">{ft.toUpperCase()}</p>
                {selected.map((id) => {
                  const fav = favorites.find((f) => f.stationId === id);
                  const p = prices[id]?.[ft];
                  const isCheapest = cheapest[ft] === id;
                  const allPrices = selected.map((sid) => prices[sid]?.[ft]).filter((x): x is number => typeof x === 'number');
                  const maxPrice = Math.max(...allPrices, 1);
                  const width = typeof p === 'number' ? (p / maxPrice) * 100 : 0;

                  return (
                    <div key={id} className="mb-3 last:mb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#8888a0]">{fav?.brand || id}</span>
                        <div className="flex items-center gap-2">
                          {isCheapest && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#00e5a0] text-[#0c0c0f] font-bold uppercase tracking-wider">
                              Günstigste
                            </span>
                          )}
                          <span className="text-sm font-bold text-white tabular-nums">
                            {typeof p === 'number' ? `${p.toFixed(3)} €` : '—'}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-[#1c1c22] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isCheapest ? 'bg-[#00e5a0]' : 'bg-[#555566]'}`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {selected.length < 2 && favorites.length > 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-[#555566]">Wählen Sie mindestens 2 Stationen zum Vergleichen.</p>
          </div>
        )}
      </main>
    </div>
  );
}
