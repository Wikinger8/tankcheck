'use client';

import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Station } from '@tankcheck/shared';
import { FuelType } from '@tankcheck/shared';
import Link from 'next/link';
import { useMemo } from 'react';
import { getBrandIconHtml } from '@/lib/brand-icons';

interface MapOverviewProps {
  stations: Station[];
  userLat: number;
  userLng: number;
  selectedFuel: FuelType;
}

function getMarkerColor(price: number | false, min: number, max: number): string {
  if (typeof price !== 'number') return '#9ca3af';
  if (max === min) return '#22c55e';
  const ratio = (price - min) / (max - min);
  if (ratio < 0.33) return '#22c55e';
  if (ratio < 0.66) return '#eab308';
  return '#ef4444';
}

function formatPrice(price: number | false): string {
  if (typeof price !== 'number') return '—';
  return price.toFixed(3) + '€';
}

function createPriceIcon(price: number | false, color: string, isCheapest: boolean, brand: string): L.DivIcon {
  const priceText = typeof price === 'number' ? price.toFixed(3) : '—';
  const border = isCheapest ? '3px solid #10b981' : '2px solid white';
  const shadow = isCheapest ? '0 0 12px rgba(16,185,129,0.6), 0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.3)';
  const badge = isCheapest ? '<div style="position:absolute;top:-14px;right:-14px;background:linear-gradient(135deg,#10b981,#059669);color:white;font-size:8px;font-weight:700;padding:1px 4px;border-radius:6px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.3)">★ Günstigste</div>' : '';
  const brandHtml = getBrandIconHtml(brand, 22);

  return L.divIcon({
    className: '',
    iconSize: [90, 40],
    iconAnchor: [45, 40],
    popupAnchor: [0, -42],
    html: `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center">
        ${badge}
        <div style="
          display:flex;align-items:center;gap:4px;
          background:${color};
          color:white;
          font-size:11px;
          font-weight:700;
          padding:3px 8px 3px 4px;
          border-radius:12px;
          border:${border};
          box-shadow:${shadow};
          white-space:nowrap;
          text-align:center;
          letter-spacing:-0.3px;
          ${isCheapest ? 'transform:scale(1.15);' : ''}
        ">${brandHtml}<span>${priceText}€</span></div>
        <div style="
          width:0;height:0;
          border-left:6px solid transparent;
          border-right:6px solid transparent;
          border-top:6px solid ${color};
          margin-top:-1px;
        "></div>
      </div>
    `,
  });
}

function LocateButton({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  return (
    <button
      onClick={() => map.flyTo([lat, lng], 13)}
      className="absolute bottom-20 right-3 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-white/20 dark:border-gray-700/30 transition-all duration-300 hover:scale-105"
    >
      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    </button>
  );
}

export default function MapOverview({ stations, userLat, userLng, selectedFuel }: MapOverviewProps) {
  const fuelKey = selectedFuel === FuelType.ALL ? 'diesel' : (selectedFuel as 'e5' | 'e10' | 'diesel');

  const { min, max, cheapestId } = useMemo(() => {
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let cheapest = '';
    for (const s of stations) {
      const p = s[fuelKey];
      if (typeof p === 'number') {
        if (p < minPrice) { minPrice = p; cheapest = s.id; }
        if (p > maxPrice) maxPrice = p;
      }
    }
    return {
      min: minPrice === Infinity ? 0 : minPrice,
      max: maxPrice === -Infinity ? 2 : maxPrice,
      cheapestId: cheapest,
    };
  }, [stations, fuelKey]);

  return (
    <MapContainer
      center={[userLat, userLng]}
      zoom={12}
      className="w-full h-full"
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={[userLat, userLng]}
        radius={8}
        pathOptions={{ fillColor: '#2563eb', fillOpacity: 1, color: '#ffffff', weight: 3 }}
      />
      {stations.map((station) => {
        const price = station[fuelKey];
        const color = getMarkerColor(price, min, max);
        const isCheapest = station.id === cheapestId;
        const icon = createPriceIcon(price, color, isCheapest, station.brand);

        return (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={icon}
            zIndexOffset={isCheapest ? 1000 : 0}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <div dangerouslySetInnerHTML={{ __html: getBrandIconHtml(station.brand, 28) }} />
                  <div className="min-w-0">
                    <p className="font-bold text-sm">{station.brand}</p>
                    {isCheapest && (
                      <span style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '8px' }}>
                        Günstigste
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500">{station.name}</p>
                <p className="text-xs text-gray-400 mb-2">{station.street} {station.houseNumber}, {station.postCode} {station.place}</p>
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {typeof station.e5 === 'number' && (
                    <div className="text-center bg-blue-50 rounded-lg py-1 px-1">
                      <div className="text-[10px] text-blue-600 font-medium">E5</div>
                      <div className="text-xs font-bold text-blue-800">{station.e5.toFixed(3)}€</div>
                    </div>
                  )}
                  {typeof station.e10 === 'number' && (
                    <div className="text-center bg-green-50 rounded-lg py-1 px-1">
                      <div className="text-[10px] text-green-600 font-medium">E10</div>
                      <div className="text-xs font-bold text-green-800">{station.e10.toFixed(3)}€</div>
                    </div>
                  )}
                  {typeof station.diesel === 'number' && (
                    <div className="text-center bg-amber-50 rounded-lg py-1 px-1">
                      <div className="text-[10px] text-amber-600 font-medium">Diesel</div>
                      <div className="text-xs font-bold text-amber-800">{station.diesel.toFixed(3)}€</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${station.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {station.isOpen ? 'Geöffnet' : 'Geschlossen'}
                  </span>
                  {typeof station.dist === 'number' && (
                    <span className="text-xs text-gray-400">{station.dist.toFixed(1)} km</span>
                  )}
                  <Link href={`/station/${station.id}`} className="text-xs text-blue-600 font-semibold">
                    Details →
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
      <LocateButton lat={userLat} lng={userLng} />
    </MapContainer>
  );
}
