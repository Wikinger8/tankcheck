'use client';

import { useEffect } from 'react';

type ToastType = 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const typeClasses: Record<ToastType, string> = {
  success: 'bg-emerald-600 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-600 text-white',
};

export function Toast({ message, type = 'success', isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 flex justify-center">
      <div
        className={`rounded-lg px-4 py-3 shadow-lg transform transition-transform duration-300 ${typeClasses[type]}`}
      >
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
