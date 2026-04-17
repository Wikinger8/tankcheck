'use client';

interface GeolocationConsentProps {
  isOpen: boolean;
  onRequestLocation: () => void;
  onManualEntry?: () => void;
}

export function GeolocationConsent({ isOpen, onRequestLocation, onManualEntry }: GeolocationConsentProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-sm bg-[#141418] border border-[#2a2a34] rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#1c1c22] border border-[#2a2a34] flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#00e5a0]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Standort freigeben</h2>
        <p className="text-[#8888a0] text-sm leading-relaxed mb-8">
          Um Tankstellen und Preise in deiner N&auml;he zu finden. Daten bleiben lokal.
        </p>

        <button
          onClick={onRequestLocation}
          className="w-full bg-[#00e5a0] hover:bg-[#00c48c] active:bg-[#00a876] text-[#0c0c0f] font-bold py-3.5 rounded-xl text-base shadow-lg shadow-[#00e5a0]/20 active:scale-[0.97] transition-all mb-3"
        >
          Standort freigeben
        </button>

        <button
          onClick={onManualEntry}
          className="w-full text-[#555566] font-medium py-2.5 text-sm hover:text-[#8888a0] transition-colors"
        >
          Manuell eingeben
        </button>
      </div>
    </div>
  );
}
