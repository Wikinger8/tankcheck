'use client';

import { useState } from 'react';
import { useNotes } from '@/hooks/useNotes';

interface StationNotesProps {
  stationId: string;
}

export function StationNotes({ stationId }: StationNotesProps) {
  const { note: savedNote, rating: savedRating, save } = useNotes(stationId);
  const [note, setNote] = useState(savedNote);
  const [rating, setRating] = useState(savedRating);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    save(note, rating);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star === rating ? 0 : star)}
            className="transition-transform duration-200 hover:scale-110"
          >
            <svg
              className={`w-7 h-7 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
              viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              fill={star <= rating ? 'currentColor' : 'none'}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          </button>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value.slice(0, 500))}
        placeholder="Persönliche Notiz zur Tankstelle..."
        rows={3}
        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{note.length}/500</span>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {saved ? 'Gespeichert!' : 'Speichern'}
        </button>
      </div>
    </div>
  );
}
