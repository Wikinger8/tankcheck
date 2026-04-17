'use client';

import { SortOption, SORT_OPTION_LABELS } from '@tankcheck/shared';

interface SortSelectorProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

const sortOptions: SortOption[] = [SortOption.PRICE, SortOption.DISTANCE];

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <div className="flex rounded-lg bg-gray-100 p-1">
      {sortOptions.map((option) => (
        <button
          key={option}
          className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors ${
            value === option
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onChange(option)}
        >
          {SORT_OPTION_LABELS[option]}
        </button>
      ))}
    </div>
  );
}
