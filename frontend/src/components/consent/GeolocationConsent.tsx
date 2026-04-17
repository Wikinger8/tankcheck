'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

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
  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="">
      <div className="flex flex-col items-center text-center">
        {/* Location Icon */}
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-blue-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Standort freigeben
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          TankCheck benötigt Ihren Standort, um Tankstellen in Ihrer Nähe zu
          finden. Ihre Standortdaten werden nur lokal verwendet und nicht
          gespeichert.
        </p>

        <Button
          variant="primary"
          size="lg"
          className="w-full mb-3"
          onClick={onRequestLocation}
        >
          Standort freigeben
        </Button>

        <Button
          variant="ghost"
          size="md"
          className="w-full"
          onClick={onManualEntry}
        >
          Standort manuell eingeben
        </Button>
      </div>
    </Modal>
  );
}
