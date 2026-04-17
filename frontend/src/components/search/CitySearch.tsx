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
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555566]"
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
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#1c1c22] border border-[#2a2a34] text-white placeholder:text-[#555566] focus:outline-none focus:ring-2 focus:ring-[#00e5a0]/20 focus:border-[#00e5a0] transition-all"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-30 mt-1 w-full rounded-lg bg-[#141418] border border-[#2a2a34] overflow-hidden">
          {results.map((result, i) => (
            <button
              key={i}
              onClick={() => {
                onLocationSelect(parseFloat(result.lat), parseFloat(result.lon), result.display_name);
                setQuery(result.display_name.split(',')[0]);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-[#8888a0] hover:bg-[#1c1c22] transition-colors border-b border-[#2a2a34] last:border-0"
            >
              <span className="line-clamp-1">{result.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
