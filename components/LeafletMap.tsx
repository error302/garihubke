'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createIcon = (color: string) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface VehicleMarker {
  id: string;
  title: string;
  price: number;
  image: string;
  latitude: number;
  longitude: number;
}

interface LeafletMapProps {
  vehicles: VehicleMarker[];
  center?: [number, number];
  zoom?: number;
}

export default function LeafletMap({ 
  vehicles, 
  center = [-1.2921, 36.8219], 
  zoom = 6 
}: LeafletMapProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      className="h-full w-full rounded-lg"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {vehicles.filter(v => v.latitude && v.longitude).map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={[vehicle.latitude, vehicle.longitude]}
          icon={createIcon('#2563eb')}
        >
          <Popup>
            <div className="w-48">
              <img 
                src={vehicle.image} 
                alt={vehicle.title} 
                className="w-full h-24 object-cover rounded mb-2"
              />
              <h4 className="font-semibold text-sm">{vehicle.title}</h4>
              <p className="text-primary-600 font-bold">KES {vehicle.price.toLocaleString()}</p>
              <a href={`/vehicles/${vehicle.id}`} className="text-xs text-blue-600 hover:underline">
                View Details
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
