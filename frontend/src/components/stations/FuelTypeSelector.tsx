'use client';

import { FuelType, FUEL_TYPE_LABELS } from '@tankcheck/shared';

interface FuelTypeSelectorProps {
  value: FuelType;
  onChange: (type: FuelType) => void;
}

const fuelOptions: FuelType[] = [FuelType.E5, FuelType.E10, FuelType.DIESEL];

export function FuelTypeSelector({ value, onChange }: FuelTypeSelectorProps) {
  return (
    <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1">
      {fuelOptions.map((type) => (
        <button
          key={type}
          className={`flex-1 rounded-lg py-2 px-3 text-sm font-semibold transition-all duration-200 ${
            value === type
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
          }`}
          onClick={() => onChange(type)}
        >
          {FUEL_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
