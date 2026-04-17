'use client';

import { useState } from 'react';
import { FuelType, FUEL_TYPE_LABELS } from '@tankcheck/shared';

interface AlertFormProps {
  stationId: string;
  stationName: string;
  stationBrand: string;
  onSubmit: (data: { stationId: string; stationName: string; stationBrand: string; fuelType: FuelType; threshold: number }) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const FUEL_OPTIONS: FuelType[] = [FuelType.E5, FuelType.E10, FuelType.DIESEL];

export default function AlertForm({
  stationId,
  stationName,
  stationBrand,
  onSubmit,
  onCancel,
  isOpen,
}: AlertFormProps) {
  const [fuelType, setFuelType] = useState<FuelType>(FuelType.E10);
  const [threshold, setThreshold] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const value = parseFloat(threshold);
    if (isNaN(value) || value <= 0 || value >= 5) {
      setError('Bitte geben Sie einen gültigen Preis zwischen 0 und 5 Euro ein.');
      return;
    }

    onSubmit({
      stationId,
      stationName,
      stationBrand,
      fuelType,
      threshold: value,
    });

    setThreshold('');
    setFuelType(FuelType.E10);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60">
      <div className="w-full max-w-lg bg-[#141418] border-t border-[#2a2a34] rounded-t-2xl p-6 animate-slide-up">
        <h3 className="text-lg font-bold text-white mb-1">Preisalarm erstellen</h3>
        <p className="text-sm text-[#555566] mb-4">
          {stationBrand} — {stationName}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset>
            <legend className="text-sm font-medium text-[#8888a0] mb-2">Kraftstoffart</legend>
            <div className="flex gap-1.5">
              {FUEL_OPTIONS.map((ft) => (
                <label
                  key={ft}
                  className={`flex-1 text-center cursor-pointer rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
                    fuelType === ft
                      ? 'bg-[#00e5a0] text-[#0c0c0f]'
                      : 'bg-[#1c1c22] border border-[#2a2a34] text-[#555566]'
                  }`}
                >
                  <input
                    type="radio"
                    name="fuelType"
                    value={ft}
                    checked={fuelType === ft}
                    onChange={() => setFuelType(ft)}
                    className="sr-only"
                  />
                  {FUEL_TYPE_LABELS[ft]}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-[#8888a0] mb-1">
              Preisgrenze (EUR/Liter)
            </label>
            <input
              id="threshold"
              type="number"
              step="0.001"
              min="0.001"
              max="4.999"
              placeholder="z.B. 1.500"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full rounded-lg border border-[#2a2a34] bg-[#1c1c22] px-4 py-2.5 text-white placeholder:text-[#555566] focus:border-[#00e5a0] focus:ring-2 focus:ring-[#00e5a0]/20 focus:outline-none"
            />
            {error && <p className="mt-1 text-sm text-[#ef4444]">{error}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-[#2a2a34] bg-[#1c1c22] px-4 py-2.5 text-sm font-bold text-[#8888a0] hover:bg-[#24242c] transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[#00e5a0] px-4 py-2.5 text-sm font-bold text-[#0c0c0f] hover:bg-[#00cc8e] transition-colors"
            >
              Alarm erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
