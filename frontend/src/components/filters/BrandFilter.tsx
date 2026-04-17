'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface BrandFilterProps {
  brands: string[];
  selected: string[];
  onChange: (brands: string[]) => void;
}

export function BrandFilter({ brands, selected, onChange }: BrandFilterProps) {
  const { t } = useLanguage();
  const allSelected = selected.length === 0;

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onChange([])}
        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
          allSelected
            ? 'bg-[#00e5a0] text-[#0c0c0f]'
            : 'bg-[#1c1c22] text-[#555566] border border-[#2a2a34]'
        }`}
      >
        {t('filter.all')}
      </button>
      {brands.map((brand) => {
        const isActive = selected.includes(brand);
        return (
          <button
            key={brand}
            onClick={() => {
              if (isActive) {
                onChange(selected.filter((b) => b !== brand));
              } else {
                onChange([...selected, brand]);
              }
            }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
              isActive
                ? 'bg-[#00e5a0] text-[#0c0c0f]'
                : 'bg-[#1c1c22] text-[#555566] border border-[#2a2a34]'
            }`}
          >
            {brand}
          </button>
        );
      })}
    </div>
  );
}
