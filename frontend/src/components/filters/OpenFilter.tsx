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
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
        value
          ? 'bg-[#00e5a0] text-[#0c0c0f]'
          : 'bg-[#1c1c22] text-[#555566] border border-[#2a2a34]'
      }`}
    >
      <div
        className={`w-3 h-3 rounded-full transition-colors ${
          value ? 'bg-[#0c0c0f]' : 'bg-[#555566]'
        }`}
      />
      {t('filter.openOnly')}
    </button>
  );
}
