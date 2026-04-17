'use client';

interface GeolocationConsentProps {
  isOpen: boolean;
  onRequestLocation: () => void;
  onManualEntry?: () => void;
}

export function GeolocationConsent({
  isOpen,
  onRequestLocation,
  onManualEntry,
}: GeolocationConsentProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gray-950/40" />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl text-center">
        <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Standort freigeben
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
          Um Tankstellen und Preise in deiner N&auml;he anzuzeigen, brauchen wir deinen Standort. Daten bleiben lokal auf deinem Ger&auml;t.
        </p>

        <button
          onClick={onRequestLocation}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-2xl text-base shadow-lg shadow-blue-600/25 active:scale-[0.97] transition-all mb-3"
        >
          Standort freigeben
        </button>

        <button
          onClick={onManualEntry}
          className="w-full text-gray-500 dark:text-gray-400 font-medium py-2.5 text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          Manuell eingeben
        </button>
      </div>
    </div>
  );
}
