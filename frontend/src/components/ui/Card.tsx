interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-white shadow-sm border border-gray-100 p-4 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
