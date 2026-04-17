'use client';

import { SortOption, SORT_OPTION_LABELS } from '@tankcheck/shared';

interface SortSelectorProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

const sortOptions: SortOption[] = [SortOption.PRICE, SortOption.DISTANCE];

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <div className="flex rounded-lg bg-[#1c1c22] border border-[#2a2a34] p-0.5 gap-0.5">
      {sortOptions.map((option) => (
        <button
          key={option}
          className={`flex-1 rounded-md py-2 px-3 text-sm font-bold transition-all ${
            value === option
              ? 'bg-[#00e5a0] text-[#0c0c0f]'
              : 'text-[#555566] hover:text-[#8888a0]'
          }`}
          onClick={() => onChange(option)}
        >
          {SORT_OPTION_LABELS[option]}
        </button>
      ))}
    </div>
  );
}
