'use client';

import { useState, useEffect, useRef } from 'react';
import { getItem, setItem } from '@/lib/storage';

const DISMISS_KEY = 'tankcheck_install_dismissed';
const DISMISS_DAYS = 7;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [showBanner, setShowBanner] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const dismissedAt = getItem<string | null>(DISMISS_KEY, null);
    if (dismissedAt) {
      const dismissDate = new Date(dismissedAt).getTime();
      const daysSince = (Date.now() - dismissDate) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_DAYS) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;

    await prompt.prompt();
    const { outcome } = await prompt.userChoice;

    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    deferredPromptRef.current = null;
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setItem(DISMISS_KEY, new Date().toISOString());
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 pb-safe">
      <div className="mx-auto max-w-lg rounded-xl bg-[#141418] border border-[#2a2a34] p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#00e5a0] flex items-center justify-center">
            <svg className="h-6 w-6 text-[#0c0c0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">
              TankCheck zum Startbildschirm hinzufügen
            </p>
            <p className="text-xs text-[#555566]">
              Schneller Zugriff auf Tankpreise
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDismiss}
            className="flex-1 rounded-lg border border-[#2a2a34] bg-[#1c1c22] px-3 py-2 text-sm font-bold text-[#8888a0] hover:bg-[#24242c] transition-colors"
          >
            Nicht jetzt
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 rounded-lg bg-[#00e5a0] px-3 py-2 text-sm font-bold text-[#0c0c0f] hover:bg-[#00cc8e] transition-colors"
          >
            Installieren
          </button>
        </div>
      </div>
    </div>
  );
}
