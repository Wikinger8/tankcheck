interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: 'full' | 'lg' | 'md';
  className?: string;
}

const roundedClasses = {
  full: 'rounded-full',
  lg: 'rounded-lg',
  md: 'rounded-md',
};

export function Skeleton({ width, height, rounded = 'md', className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#1c1c22] ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
    />
  );
}
