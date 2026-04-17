const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchAPI<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`/api${path}`, API_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  searchStations: (params: Record<string, string>) =>
    fetchAPI('/stations/search', params),
  getStationDetail: (id: string) =>
    fetchAPI(`/stations/${id}`),
  getPrices: (ids: string[]) =>
    fetchAPI<Record<string, import('@tankcheck/shared').StationPrices>>(
      '/prices',
      { ids: ids.join(',') }
    ),
};
