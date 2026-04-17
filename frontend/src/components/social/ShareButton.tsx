'use client';

import { useState } from 'react';

interface ShareButtonProps {
  stationName: string;
  brand: string;
  place: string;
  prices: { diesel: number | false; e5: number | false; e10: number | false };
}

export function ShareButton({ stationName, brand, place, prices }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const text = `⛽ ${brand} in ${place}: ${
    [
      typeof prices.diesel === 'number' ? `Diesel ${prices.diesel.toFixed(3)}€` : '',
      typeof prices.e5 === 'number' ? `E5 ${prices.e5.toFixed(3)}€` : '',
      typeof prices.e10 === 'number' ? `E10 ${prices.e10.toFixed(3)}€` : '',
    ]
      .filter(Boolean)
      .join(', ')
  } — TankCheck`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${brand} - ${stationName}`, text });
        return;
      } catch { /* user cancelled */ }
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-3 py-2 bg-[#1c1c22] border border-[#2a2a34] rounded-lg text-sm font-bold text-[#8888a0] hover:text-[#00e5a0] hover:border-[#00e5a0]/30 transition-all"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-[#00e5a0]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Kopiert!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Zm0-12.814a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Z" />
          </svg>
          Teilen
        </>
      )}
    </button>
  );
}
