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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-t-2xl p-6 shadow-xl animate-slide-up">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Preisalarm erstellen</h3>
        <p className="text-sm text-gray-500 mb-4">
          {stationBrand} &mdash; {stationName}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fuel Type Selector */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">Kraftstoffart</legend>
            <div className="flex gap-2">
              {FUEL_OPTIONS.map((ft) => (
                <label
                  key={ft}
                  className={`flex-1 text-center cursor-pointer rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${
                    fuelType === ft
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
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

          {/* Price Threshold */}
          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Alarm erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
