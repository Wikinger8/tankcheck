export interface GeoResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function searchCity(query: string): Promise<GeoResult[]> {
  if (!query || query.length < 2) return [];

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=de&limit=5`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'TankCheck/1.0' },
  });

  if (!res.ok) return [];

  return res.json();
}
