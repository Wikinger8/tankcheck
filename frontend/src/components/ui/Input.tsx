'use client';

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#8888a0] mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555566]">
            {icon}
          </div>
        )}
        <input
          className={`w-full rounded-lg border border-[#2a2a34] bg-[#1c1c22] px-3 py-2 text-white placeholder:text-[#555566] focus:outline-none focus:ring-2 focus:ring-[#00e5a0]/20 focus:border-[#00e5a0] ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-[#ef4444]' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-[#ef4444]">{error}</p>
      )}
    </div>
  );
}
