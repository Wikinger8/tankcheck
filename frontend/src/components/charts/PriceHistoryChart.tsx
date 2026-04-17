'use client';

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePriceHistory } from '@/hooks/usePriceHistory';

interface PriceHistoryChartProps {
  stationId: string;
}

export function PriceHistoryChart({ stationId }: PriceHistoryChartProps) {
  const { history } = usePriceHistory(stationId);
  const [range, setRange] = useState<7 | 30>(7);

  const data = useMemo(() => {
    const cutoff = Date.now() - range * 24 * 60 * 60 * 1000;
    return history
      .filter((h) => h.timestamp > cutoff)
      .map((h) => ({
        time: new Date(h.timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
        e5: typeof h.e5 === 'number' ? h.e5 : null,
        e10: typeof h.e10 === 'number' ? h.e10 : null,
        diesel: typeof h.diesel === 'number' ? h.diesel : null,
      }));
  }, [history, range]);

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-xl bg-[#1c1c22] border border-[#2a2a34] flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6 text-[#555566]" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Z" />
          </svg>
        </div>
        <p className="text-sm text-[#555566]">Noch keine Preisverlaufsdaten.</p>
        <p className="text-xs text-[#3a3a48]">Daten werden bei jedem Besuch gesammelt.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-1.5 mb-3">
        {([7, 30] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              range === r ? 'bg-[#00e5a0] text-[#0c0c0f]' : 'bg-[#1c1c22] text-[#555566] border border-[#2a2a34]'
            }`}
          >
            {r} Tage
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="ge5" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ge10" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00e5a0" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gdiesel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a34" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#555566' }} stroke="#2a2a34" />
          <YAxis tick={{ fontSize: 10, fill: '#555566' }} stroke="#2a2a34" domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #2a2a34',
              backgroundColor: '#141418',
              color: '#e8e8ec',
            }}
          />
          <Area type="monotone" dataKey="e5" stroke="#60a5fa" fill="url(#ge5)" strokeWidth={2} name="E5" connectNulls />
          <Area type="monotone" dataKey="e10" stroke="#00e5a0" fill="url(#ge10)" strokeWidth={2} name="E10" connectNulls />
          <Area type="monotone" dataKey="diesel" stroke="#fbbf24" fill="url(#gdiesel)" strokeWidth={2} name="Diesel" connectNulls />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
