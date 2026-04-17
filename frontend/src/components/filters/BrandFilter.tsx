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
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onChange([])}
        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
          allSelected
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
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
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {brand}
          </button>
        );
      })}
    </div>
  );
}
