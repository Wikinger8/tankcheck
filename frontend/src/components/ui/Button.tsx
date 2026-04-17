'use client';

import { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#00e5a0] text-[#0c0c0f] hover:bg-[#00cc8e] active:bg-[#00b37d] font-bold',
  secondary: 'bg-[#1c1c22] text-white border border-[#2a2a34] hover:bg-[#24242c] active:bg-[#2a2a34]',
  ghost: 'bg-transparent text-[#8888a0] hover:bg-[#1c1c22] active:bg-[#24242c]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-sm rounded-lg min-h-[36px]',
  md: 'px-5 py-2.5 text-sm rounded-lg min-h-[44px]',
  lg: 'px-6 py-3 text-base rounded-xl min-h-[50px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`font-semibold transition-all duration-150 active:scale-[0.97] ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
