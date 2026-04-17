'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAlerts } from '@/hooks/useAlerts';
import { usePrices } from '@/hooks/usePrices';
import Toast, { useToast } from '@/components/ui/Toast';
import type { FuelType } from '@tankcheck/shared';

export default function AlertChecker() {
  const { alerts, updateAlert } = useAlerts();
  const stationIds = alerts.map((a) => a.stationId);
  const { prices } = usePrices(stationIds);
  const { toast, showToast, hideToast } = useToast();
  const toastQueueRef = useRef<string[]>([]);
  const processingRef = useRef(false);

  const processQueue = useCallback(() => {
    if (processingRef.current || toastQueueRef.current.length === 0) return;
    processingRef.current = true;
    const message = toastQueueRef.current.shift()!;
    showToast(message, 'success');
    setTimeout(() => {
      processingRef.current = false;
      processQueue();
    }, 4500);
  }, [showToast]);

  useEffect(() => {
    if (alerts.length === 0 || Object.keys(prices).length === 0) return;

    const ONE_HOUR = 60 * 60 * 1000;

    for (const alert of alerts) {
      const stationPrices = prices[alert.stationId];
      if (!stationPrices) continue;

      const fuelKey = alert.fuelType as FuelType;
      const currentPrice = stationPrices[fuelKey as keyof typeof stationPrices];
      if (currentPrice === false || typeof currentPrice !== 'number') continue;

      if (currentPrice <= alert.threshold) {
        const lastTriggered = alert.lastTriggered
          ? new Date(alert.lastTriggered).getTime()
          : 0;

        if (Date.now() - lastTriggered > ONE_HOUR) {
          const fuelLabel = fuelKey.toUpperCase();
          toastQueueRef.current.push(
            `\u26FD ${alert.stationName}: ${fuelLabel} jetzt bei ${currentPrice.toFixed(3)}\u20AC!`
          );
          updateAlert(alert.id, { lastTriggered: new Date().toISOString() });
        }
      }
    }

    processQueue();
  }, [alerts, prices, updateAlert, processQueue]);

  return (
    <Toast
      message={toast.message}
      type={toast.type}
      isVisible={toast.isVisible}
      onClose={hideToast}
    />
  );
}
