import type { TKListResponse, TKDetailResponse, TKPricesResponse } from '@tankcheck/shared';

/**
 * Frontend API-Client: Alle Requests gehen an das NestJS-Backend (nicht direkt an Tankerkoenig).
 * Das Backend kapselt den API-Key und cached Antworten in Redis.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchAPI<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`/api${path}`, API_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  if (data.ok === false) throw new Error(data.message || 'API error');
  return data;
}

export const api = {
  searchStations: (params: Record<string, string>) =>
    fetchAPI<TKListResponse>('/stations/search', params),

  getStationDetail: (id: string) =>
    fetchAPI<TKDetailResponse>(`/stations/${id}`),

  getPrices: (ids: string[]) =>
    fetchAPI<TKPricesResponse>('/prices', { ids: ids.join(',') }),
};
