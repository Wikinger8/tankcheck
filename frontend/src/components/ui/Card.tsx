interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/30 shadow-lg shadow-black/5 dark:shadow-black/20 p-4 transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
