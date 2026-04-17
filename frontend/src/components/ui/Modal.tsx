'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="relative w-full max-w-lg bg-[#141418] border-t border-[#2a2a34] rounded-t-2xl p-6 pb-8 transform transition-transform duration-300 ease-out"
        style={{ paddingBottom: 'calc(1.5rem + var(--safe-bottom))' }}
      >
        {title && (
          <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
