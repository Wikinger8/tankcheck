'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
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
        <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Z" />
        </svg>
        <p className="text-sm text-gray-500 dark:text-gray-400">Noch keine Preisverlaufsdaten.</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Daten werden bei jedem Besuch gesammelt.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {([7, 30] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
              range === r ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
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
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ge10" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gdiesel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" domain={['auto', 'auto']} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,.1)' }} />
          <Area type="monotone" dataKey="e5" stroke="#3b82f6" fill="url(#ge5)" strokeWidth={2} name="E5" connectNulls />
          <Area type="monotone" dataKey="e10" stroke="#10b981" fill="url(#ge10)" strokeWidth={2} name="E10" connectNulls />
          <Area type="monotone" dataKey="diesel" stroke="#f59e0b" fill="url(#gdiesel)" strokeWidth={2} name="Diesel" connectNulls />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
