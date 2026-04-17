'use client';

import { useState, useEffect, useRef } from 'react';
import { searchCity, type GeoResult } from '@/lib/geocoding';

interface CitySearchProps {
  onLocationSelect: (lat: number, lng: number, name: string) => void;
}

export function CitySearch({ onLocationSelect }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.length < 2) {
      setResults([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      const data = await searchCity(query);
      setResults(data);
      setOpen(data.length > 0);
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Stadt suchen..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-30 mt-1 w-full rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden">
          {results.map((result, i) => (
            <button
              key={i}
              onClick={() => {
                onLocationSelect(parseFloat(result.lat), parseFloat(result.lon), result.display_name);
                setQuery(result.display_name.split(',')[0]);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <span className="line-clamp-1">{result.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
