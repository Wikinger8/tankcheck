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
  if (max === min) return '#16a34a';
  const ratio = (price - min) / (max - min);
  if (ratio < 0.33) return '#16a34a';
  if (ratio < 0.66) return '#d97706';
  return '#dc2626';
}

function createPriceIcon(price: number | false, color: string, isCheapest: boolean, brand: string): L.DivIcon {
  const priceText = typeof price === 'number' ? price.toFixed(3) : '—';
  const brandHtml = getBrandIconHtml(brand, 20);

  if (isCheapest) {
    return L.divIcon({
      className: '',
      iconSize: [96, 52],
      iconAnchor: [48, 52],
      popupAnchor: [0, -54],
      html: `
        <div style="display:flex;flex-direction:column;align-items:center">
          <div style="position:relative">
            <div style="
              display:flex;align-items:center;gap:5px;
              background:linear-gradient(135deg,#059669,#10b981);
              color:white;
              font-size:13px;
              font-weight:800;
              padding:5px 10px 5px 5px;
              border-radius:14px;
              border:2.5px solid white;
              box-shadow:0 0 0 2px #059669, 0 4px 12px rgba(0,0,0,0.25);
              white-space:nowrap;
              transform:scale(1.1);
            ">${brandHtml}<span>${priceText}€</span></div>
            <div style="
              position:absolute;top:-8px;right:-8px;
              background:#fbbf24;color:#92400e;
              font-size:9px;font-weight:800;
              padding:1px 5px;border-radius:8px;
              box-shadow:0 1px 3px rgba(0,0,0,.3);
            ">TOP</div>
          </div>
          <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:7px solid #10b981;margin-top:-1px"></div>
        </div>
      `,
    });
  }

  return L.divIcon({
    className: '',
    iconSize: [88, 44],
    iconAnchor: [44, 44],
    popupAnchor: [0, -46],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center">
        <div style="
          display:flex;align-items:center;gap:4px;
          background:${color};
          color:white;
          font-size:12px;
          font-weight:800;
          padding:4px 9px 4px 4px;
          border-radius:12px;
          border:2px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.2);
          white-space:nowrap;
        ">${brandHtml}<span>${priceText}€</span></div>
        <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid ${color};margin-top:-1px"></div>
      </div>
    `,
  });
}

function LocateButton({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  return (
    <button
      onClick={() => map.flyTo([lat, lng], 13)}
      className="absolute bottom-24 right-3 z-[999] bg-[#141418] rounded-xl p-3 border border-[#2a2a34] transition-transform active:scale-95"
    >
      <svg className="w-5 h-5 text-[#00e5a0]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
        pathOptions={{ fillColor: '#3b82f6', fillOpacity: 1, color: '#ffffff', weight: 3 }}
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
              <div className="min-w-[220px] p-1">
                <div className="flex items-center gap-2 mb-2">
                  <div dangerouslySetInnerHTML={{ __html: getBrandIconHtml(station.brand, 32) }} />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900">{station.brand}</p>
                    <p className="text-[11px] text-gray-500 truncate">{station.street} {station.houseNumber}, {station.place}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {typeof station.e5 === 'number' && (
                    <div className="text-center bg-blue-50 rounded-lg py-1.5">
                      <div className="text-[9px] font-bold text-blue-500 uppercase">E5</div>
                      <div className="text-sm font-extrabold text-blue-700">{station.e5.toFixed(3)}€</div>
                    </div>
                  )}
                  {typeof station.e10 === 'number' && (
                    <div className="text-center bg-emerald-50 rounded-lg py-1.5">
                      <div className="text-[9px] font-bold text-emerald-500 uppercase">E10</div>
                      <div className="text-sm font-extrabold text-emerald-700">{station.e10.toFixed(3)}€</div>
                    </div>
                  )}
                  {typeof station.diesel === 'number' && (
                    <div className="text-center bg-amber-50 rounded-lg py-1.5">
                      <div className="text-[9px] font-bold text-amber-500 uppercase">Diesel</div>
                      <div className="text-sm font-extrabold text-amber-700">{station.diesel.toFixed(3)}€</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${station.isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="text-[11px] text-gray-500">{station.isOpen ? 'Offen' : 'Zu'}</span>
                  </div>
                  {typeof station.dist === 'number' && (
                    <span className="text-[11px] text-gray-400">{station.dist.toFixed(1)} km</span>
                  )}
                  <Link href={`/station/${station.id}`} className="text-[11px] text-blue-600 font-bold">
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
