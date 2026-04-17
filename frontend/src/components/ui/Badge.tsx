type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-[#00e5a0]/10 text-[#00e5a0] border border-[#00e5a0]/20',
  warning: 'bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20',
  danger: 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20',
  info: 'bg-[#60a5fa]/10 text-[#60a5fa] border border-[#60a5fa]/20',
  gray: 'bg-[#1c1c22] text-[#8888a0] border border-[#2a2a34]',
};

export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
