interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-[#141418] border border-[#2a2a34] p-4 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
