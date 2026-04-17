'use client';

import { FuelType, FUEL_TYPE_LABELS } from '@tankcheck/shared';

interface FuelTypeSelectorProps {
  value: FuelType;
  onChange: (type: FuelType) => void;
}

const fuelOptions: FuelType[] = [FuelType.E5, FuelType.E10, FuelType.DIESEL];

export function FuelTypeSelector({ value, onChange }: FuelTypeSelectorProps) {
  return (
    <div className="flex gap-1.5">
      {fuelOptions.map((type) => (
        <button
          key={type}
          className={`flex-1 py-2 px-3 text-sm font-bold rounded-lg transition-all duration-150 ${
            value === type
              ? 'bg-[#00e5a0] text-[#0c0c0f] shadow-md shadow-[#00e5a0]/20'
              : 'bg-[#1c1c22] text-[#8888a0] border border-[#2a2a34] hover:border-[#00e5a0]/30 hover:text-[#b0b0c0]'
          }`}
          onClick={() => onChange(type)}
        >
          {FUEL_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
