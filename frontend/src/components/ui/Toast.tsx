'use client';

import { useEffect, useState, useCallback } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

const colorMap = {
  success: 'bg-[#00e5a0] text-[#0c0c0f]',
  warning: 'bg-[#fbbf24] text-[#0c0c0f]',
  info: 'bg-[#60a5fa] text-[#0c0c0f]',
};

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      requestAnimationFrame(() => setShow(true));

      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-20 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div
        className={`${colorMap[type]} rounded-lg px-4 py-3 shadow-lg max-w-[90vw]`}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{message}</span>
          <button
            onClick={() => {
              setShow(false);
              setTimeout(onClose, 300);
            }}
            className="ml-2 opacity-80 hover:opacity-100"
            aria-label="Schließen"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'warning' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });

  const showToast = useCallback(
    (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
      setToast({ message, type, isVisible: true });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return { toast, showToast, hideToast };
}
