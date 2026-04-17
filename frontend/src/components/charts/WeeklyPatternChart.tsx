'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { usePriceHistory } from '@/hooks/usePriceHistory';

interface WeeklyPatternChartProps {
  stationId: string;
  fuelType: 'e5' | 'e10' | 'diesel';
}

export function WeeklyPatternChart({ stationId, fuelType }: WeeklyPatternChartProps) {
  const { weekly } = usePriceHistory(stationId);

  const data = useMemo(() => weekly(fuelType), [weekly, fuelType]);

  const hasData = data.some((d) => d.avgPrice > 0);
  if (!hasData) return null;

  const minIdx = data.reduce((min, d, i) => (d.avgPrice > 0 && (d.avgPrice < data[min].avgPrice || data[min].avgPrice === 0) ? i : min), 0);

  return (
    <div>
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Bester Tag zum Tanken</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" domain={['auto', 'auto']} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,.1)' }} />
          <Bar dataKey="avgPrice" radius={[6, 6, 0, 0]} name="Ø Preis">
            {data.map((_, i) => (
              <Cell key={i} fill={i === minIdx ? '#10b981' : '#3b82f6'} fillOpacity={i === minIdx ? 1 : 0.6} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
