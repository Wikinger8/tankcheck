'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Station } from '@tankcheck/shared';
import { BrandFilter } from './BrandFilter';
import { OpenFilter } from './OpenFilter';

interface FilterBarProps {
  stations: Station[];
  onFilter: (filtered: Station[]) => void;
}

export function FilterBar({ stations, onFilter }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [openOnly, setOpenOnly] = useState(false);

  const brands = useMemo(() => {
    const set = new Set(stations.map((s) => s.brand).filter(Boolean));
    return Array.from(set).sort();
  }, [stations]);

  const activeCount = (selectedBrands.length > 0 ? 1 : 0) + (openOnly ? 1 : 0);

  useEffect(() => {
    let filtered = stations;
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((s) => selectedBrands.includes(s.brand));
    }
    if (openOnly) {
      filtered = filtered.filter((s) => s.isOpen);
    }
    onFilter(filtered);
  }, [stations, selectedBrands, openOnly, onFilter]);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">
            {activeCount}
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="space-y-3 animate-in slide-in-from-top-2">
          <BrandFilter brands={brands} selected={selectedBrands} onChange={setSelectedBrands} />
          <OpenFilter value={openOnly} onChange={setOpenOnly} />
        </div>
      )}
    </div>
  );
}
