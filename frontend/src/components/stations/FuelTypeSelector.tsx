'use client';

import { FuelType, FUEL_TYPE_LABELS } from '@tankcheck/shared';

interface FuelTypeSelectorProps {
  value: FuelType;
  onChange: (type: FuelType) => void;
}

const fuelOptions: FuelType[] = [FuelType.E5, FuelType.E10, FuelType.DIESEL];

export function FuelTypeSelector({ value, onChange }: FuelTypeSelectorProps) {
  return (
    <div className="flex rounded-lg bg-gray-100 p-1">
      {fuelOptions.map((type) => (
        <button
          key={type}
          className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors ${
            value === type
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onChange(type)}
        >
          {FUEL_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
