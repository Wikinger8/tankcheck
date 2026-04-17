'use client';

import { useState, useMemo } from 'react';
import { useAlerts } from '@/hooks/useAlerts';
import { useFavorites } from '@/hooks/useFavorites';
import { usePrices } from '@/hooks/usePrices';
import AlertCard from '@/components/alerts/AlertCard';
import AlertForm from '@/components/alerts/AlertForm';
import type { FuelType } from '@tankcheck/shared';

export default function AlertsPage() {
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { favorites } = useFavorites();
  const stationIds = useMemo(
    () => [...new Set(alerts.map((a) => a.stationId))],
    [alerts]
  );
  const { prices } = usePrices(stationIds);

  const [showForm, setShowForm] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState('');

  const selectedStation = favorites.find((f) => f.stationId === selectedStationId);

  const handleOpenForm = () => {
    if (favorites.length > 0) {
      setSelectedStationId(favorites[0].stationId);
      setShowForm(true);
    }
  };

  const handleSubmit = (data: {
    stationId: string;
    stationName: string;
    stationBrand: string;
    fuelType: FuelType;
    threshold: number;
  }) => {
    addAlert(data);
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="mx-auto max-w-lg px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Preisalarme</h1>
          {favorites.length > 0 && (
            <button
              onClick={handleOpenForm}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Neuer Alarm
            </button>
          )}
        </div>

        {/* Station picker for alert creation */}
        {showForm && favorites.length > 0 && (
          <div className="mb-4">
            <label htmlFor="station-picker" className="block text-sm font-medium text-gray-700 mb-1">
              Tankstelle auswählen
            </label>
            <select
              id="station-picker"
              value={selectedStationId}
              onChange={(e) => setSelectedStationId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              {favorites.map((fav) => (
                <option key={fav.stationId} value={fav.stationId}>
                  {fav.brand} - {fav.name} ({fav.place})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Alert cards */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const stationPrices = prices[alert.stationId];
              const fuelKey = alert.fuelType as string;
              const currentPrice = stationPrices
                ? (stationPrices[fuelKey as keyof typeof stationPrices] as number | false | undefined)
                : undefined;

              return (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  currentPrice={currentPrice}
                  onDelete={removeAlert}
                />
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg
              className="h-16 w-16 text-gray-300 mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Noch keine Preisalarme
            </h2>
            <p className="text-sm text-gray-500 max-w-xs">
              Erstellen Sie einen Alarm, um benachrichtigt zu werden, wenn Kraftstoffpreise
              unter Ihren Wunschpreis fallen.
            </p>
            {favorites.length === 0 && (
              <p className="text-xs text-gray-400 mt-3 max-w-xs">
                Fügen Sie zuerst Tankstellen zu Ihren Favoriten hinzu, um Alarme erstellen zu können.
              </p>
            )}
          </div>
        )}

        {/* Alert Form Modal */}
        {selectedStation && (
          <AlertForm
            stationId={selectedStation.stationId}
            stationName={selectedStation.name}
            stationBrand={selectedStation.brand}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            isOpen={showForm}
          />
        )}
      </div>
    </main>
  );
}
