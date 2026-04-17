'use client';

import { useState, useEffect } from 'react';

interface LastUpdatedProps {
  timestamp?: Date;
}

function formatRelative(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'Gerade eben';
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `Vor ${mins} Min. aktualisiert`;
  const hours = Math.floor(mins / 60);
  return `Vor ${hours} Std. aktualisiert`;
}

export function LastUpdated({ timestamp }: LastUpdatedProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!timestamp) return;
    setText(formatRelative(timestamp));
    const interval = setInterval(() => setText(formatRelative(timestamp)), 30000);
    return () => clearInterval(interval);
  }, [timestamp]);

  if (!timestamp || !text) return null;

  return (
    <span className="text-xs text-gray-400 dark:text-gray-500">
      {text}
    </span>
  );
}
