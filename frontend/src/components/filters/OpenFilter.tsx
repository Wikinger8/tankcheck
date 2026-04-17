'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface OpenFilterProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

export function OpenFilter({ value, onChange }: OpenFilterProps) {
  const { t } = useLanguage();

  return (
    <button
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
        value
          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
      }`}
    >
      <div
        className={`w-3 h-3 rounded-full transition-colors ${
          value ? 'bg-white' : 'bg-gray-400 dark:bg-gray-500'
        }`}
      />
      {t('filter.openOnly')}
    </button>
  );
}
