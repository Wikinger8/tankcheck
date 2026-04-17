'use client';

import type { PriceAlert } from '@tankcheck/shared';
import { FUEL_TYPE_LABELS } from '@tankcheck/shared';

interface AlertCardProps {
  alert: PriceAlert;
  currentPrice: number | false | undefined;
  onDelete: (id: string) => void;
}

export default function AlertCard({ alert, currentPrice, onDelete }: AlertCardProps) {
  const isBelowThreshold =
    currentPrice !== undefined && currentPrice !== false && currentPrice <= alert.threshold;
  const hasPrice = currentPrice !== undefined && currentPrice !== false;

  return (
    <div className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg shadow-black/5 dark:shadow-black/20 p-4 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-gray-900 dark:text-white truncate">{alert.stationBrand}</p>
            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
              {FUEL_TYPE_LABELS[alert.fuelType]}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{alert.stationName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Alarm bei unter {alert.threshold.toFixed(3)} &euro;
          </p>

          {hasPrice && (
            <div className="flex items-center gap-1.5 mt-2">
              {isBelowThreshold ? (
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span
                className={`text-sm font-medium ${
                  isBelowThreshold ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                Aktuell: {(currentPrice as number).toFixed(3)} &euro;
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => onDelete(alert.id)}
          className="flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          aria-label="Alarm l&ouml;schen"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
