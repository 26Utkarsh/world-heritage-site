"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  lat: number;
  lng: number;
  name: string;
  city: string;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function MapView({ lat, lng, name, city }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-3xl bg-zinc-100">
        <MapPin className="h-8 w-8 animate-pulse text-zinc-300" />
      </div>
    );
  }

  const position: [number, number] = [lat, lng];

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 shadow-sm z-0">
      <MapContainer 
        center={position} 
        zoom={6} 
        scrollWheelZoom={false}
        className="h-[400px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={position} />
        <Marker position={position}>
          <Popup>
            <div className="text-center font-sans">
              <strong className="block text-sm font-bold text-zinc-900">{name}</strong>
              <span className="text-xs text-zinc-500">{city}</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
