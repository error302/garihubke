# Phase 5B: Regional Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Kenya regional features: county/city filtering, map view with Leaflet, and delivery calculator

**Architecture:** 
- `lib/kenya-regions.ts` provides counties, cities, coordinates, and Haversine distance function
- FilterSidebar and vehicles page get location filters working with existing mock data
- Map view uses Leaflet with dynamic import to handle SSR
- Delivery calculator uses API route with distance calculation

**Tech Stack:** Leaflet, react-leaflet, OpenStreetMap, Haversine formula

---

## File Structure

| File | Purpose |
|------|---------|
| `lib/kenya-regions.ts` | Counties, cities, coordinates, distance utility |
| `types/index.ts` | Add city/county/lat/lng to Seller interface |
| `data/vehicles.ts` | Add location data to mock vehicles |
| `components/FilterSidebar.tsx` | Add region/city filter UI |
| `app/vehicles/page.tsx` | Add filter logic for region/city |
| `components/Map.tsx` | Dynamic import wrapper for Leaflet |
| `components/LeafletMap.tsx` | Actual map component |
| `app/vehicles/map/page.tsx` | Map view page |
| `prisma/schema.prisma` | Add DeliveryRate model |
| `app/api/delivery/rates/route.ts` | Get/manage delivery rates |
| `app/api/delivery/calculate/route.ts` | Calculate delivery fee |
| `components/DeliveryCalculator.tsx` | Delivery fee UI |

---

## Tasks

### Task 1: Kenya Regions Data Library

**Files:**
- Create: `lib/kenya-regions.ts`

- [ ] **Step 1: Create kenya-regions.ts**

```typescript
export const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet',
  'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado',
  'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga',
  'Kisii', 'Kisumu', 'Kitui', 'Laikipia', 'Lamu',
  'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru',
  'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru',
  'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir',
  'West Pokot'
] as const;

export const MAJOR_CITIES: Record<string, string[]> = {
  'Nairobi': ['Nairobi CBD', 'Westlands', 'Kilimani', 'Karen', 'Ruaraka', 'Embakasi', 'Kasarani', 'Dagoretti', 'Langata', 'Pumwani'],
  'Mombasa': ['Mombasa CBD', 'Nyali', 'Mtwapa', 'Kilifi', 'Shanzu', 'Likoni', 'Kisauni', 'Changamwe'],
  'Kisumu': ['Kisumu CBD', 'Milimani', 'Nyalenda', 'Kajulu', 'Kokiri'],
  'Nakuru': ['Nakuru CBD', 'Milimani', 'Kenyatta Avenue', 'Flamingo', 'Gilgil'],
  'Kakamega': ['Kakamega CBD', 'Mumias', 'Kakamega Forest'],
  'Eldoret': ['Eldoret CBD', 'Kimathi', 'Kapsoya', 'Kapsabet'],
  'Meru': ['Meru CBD', 'Nkubu', 'Maara'],
  'Tharaka-Nithi': ['Chuka', 'Meru South'],
  'Embu': ['Embu CBD', 'Manyatta', 'Runyenjes'],
  'Kitui': ['Kitui CBD', 'Mwingi', 'Kitui Town'],
  'Machakos': ['Machakos CBD', 'Mlolongo', 'Athi River'],
  'Kajiado': ['Kajiado CBD', 'Ngong', 'Kiserian'],
  'Kiambu': ['Kiambu CBD', 'Ruiru', 'Thika', 'Limuru'],
};

export const COUNTY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Nairobi': { lat: -1.2921, lng: 36.8219 },
  'Mombasa': { lat: -4.0435, lng: 39.6682 },
  'Kisumu': { lat: -0.1022, lng: 34.7617 },
  'Nakuru': { lat: -0.3031, lng: 36.0800 },
  'Eldoret': { lat: 0.5143, lng: 35.2698 },
  'Kakamega': { lat: 0.2827, lng: 34.7519 },
  'Meru': { lat: 0.0500, lng: 37.6500 },
  'Tharaka-Nithi': { lat: -0.4500, lng: 37.6333 },
  'Embu': { lat: -0.5389, lng: 37.4583 },
  'Kitui': { lat: -1.3670, lng: 38.0106 },
  'Machakos': { lat: -1.5177, lng: 37.2634 },
  'Kajiado': { lat: -1.8519, lng: 36.7820 },
  'Kiambu': { lat: -1.1714, lng: 36.8356 },
  'Bungoma': { lat: 0.5635, lng: 34.5606 },
  'Busia': { lat: 0.4175, lng: 34.2589 },
  'Homa Bay': { lat: -0.5273, lng: 34.4571 },
  'Migori': { lat: -1.0634, lng: 34.4731 },
  'Kisii': { lat: -0.6817, lng: 34.7660 },
  'Nyamira': { lat: -0.5663, lng: 34.9344 },
  'Narok': { lat: -1.0789, lng: 35.8604 },
  'Laikipia': { lat: 0.2926, lng: 36.7892 },
  'Baringo': { lat: 0.6875, lng: 36.0920 },
  'Kericho': { lat: -0.3689, lng: 35.3133 },
  'Bomet': { lat: -0.7878, lng: 35.3375 },
  'Nandi': { lat: 0.1886, lng: 35.0067 },
  'Uasin Gishu': { lat: 0.5144, lng: 35.2698 },
  'Trans Nzoia': { lat: 1.0156, lng: 34.9671 },
  'West Pokot': { lat: 1.2333, lng: 35.1167 },
  'Samburu': { lat: 0.9833, lng: 36.9500 },
  'Isiolo': { lat: 0.3546, lng: 37.5822 },
  'Marsabit': { lat: 2.3344, lng: 37.9742 },
  'Garissa': { lat: -0.4536, lng: 39.6401 },
  'Wajir': { lat: 1.7501, lng: 40.0573 },
  'Mandera': { lat: 3.9367, lng: 41.8569 },
  'Lamu': { lat: -2.2686, lng: 40.9020 },
  'Tana River': { lat: -1.4833, lng: 40.0333 },
  'Kilifi': { lat: -3.6305, lng: 39.8499 },
  'Taita-Taveta': { lat: -3.3960, lng: 38.4851 },
  'Makueni': { lat: -2.2467, lng: 37.8014 },
  'Murang\'a': { lat: -0.9320, lng: 37.2569 },
  'Nyeri': { lat: -0.4197, lng: 36.9553 },
  'Kirinyaga': { lat: -0.7147, lng: 37.8265 },
  'Siaya': { lat: 0.0606, lng: 34.2880 },
  'Vihiga': { lat: 0.0416, lng: 34.7245 },
  'Nyandarua': { lat: -0.5108, lng: 36.4327 },
  'Elgeyo-Marakwet': { lat: 1.1533, lng: 35.4944 },
};

export type KenyaCounty = typeof KENYA_COUNTIES[number];

export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/kenya-regions.ts
git commit -m "feat: add Kenya regions data with counties, cities, coordinates"
```

---

### Task 2: Update Types and Mock Data

**Files:**
- Modify: `types/index.ts`
- Modify: `data/vehicles.ts`

- [ ] **Step 1: Update Seller interface in types/index.ts**

Read `types/index.ts`, find Seller interface, add:
```typescript
city?: string;
county?: string;
latitude?: number;
longitude?: number;
```

- [ ] **Step 2: Add location data to mock vehicles**

Read `data/vehicles.ts`, for each vehicle add county and coordinates to seller. Example:
```typescript
seller: {
  name: 'Kenya Motors Ltd',
  phone: '+254 700 000 000',
  location: 'Westlands',
  city: 'Westlands',
  county: 'Nairobi',
  latitude: -1.2636,
  longitude: 36.8014,
},
```

Add realistic county/location to each of the ~20 mock vehicles (distribute across Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, etc.)

- [ ] **Step 3: Commit**

```bash
git add types/index.ts data/vehicles.ts
git commit -m "feat: add location fields to Vehicle type and mock data"
```

---

### Task 3: FilterSidebar Location Filters

**Files:**
- Modify: `components/FilterSidebar.tsx`

- [ ] **Step 1: Import kenya-regions**

Add to imports:
```typescript
import { KENYA_COUNTIES, MAJOR_CITIES } from '@/lib/kenya-regions';
```

- [ ] **Step 2: Update FilterSidebarProps**

Add to interface:
```typescript
region: string;
city: string;
```

- [ ] **Step 3: Add region/city filter UI**

Add after the Transmission filter section (before "Save This Search" button):
```tsx
<div>
  <h3 className="font-semibold mb-3">Location</h3>
  <select
    value={filters.region}
    onChange={(e) => onFilterChange({ ...filters, region: e.target.value, city: '' })}
    className="w-full px-3 py-2 border rounded-md text-sm mb-2"
  >
    <option value="">All Counties</option>
    {KENYA_COUNTIES.map(county => (
      <option key={county} value={county}>{county}</option>
    ))}
  </select>
  {filters.region && MAJOR_CITIES[filters.region] && (
    <select
      value={filters.city}
      onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
      className="w-full px-3 py-2 border rounded-md text-sm"
    >
      <option value="">All Cities</option>
      {MAJOR_CITIES[filters.region].map(city => (
        <option key={city} value={city}>{city}</option>
      ))}
    </select>
  )}
</div>
```

- [ ] **Step 4: Update hasActiveFilters**

Add `filters.region || filters.city` to the check on line ~96

- [ ] **Step 5: Update resetFilters**

In `resetFilters` function (around line 60), add region and city to the reset:
```typescript
region: '',
city: '',
```

- [ ] **Step 6: Commit**

```bash
git add components/FilterSidebar.tsx
git commit -m "feat: add county/city filters to FilterSidebar"
```

---

### Task 4: Vehicles Page Filter Logic

**Files:**
- Modify: `app/vehicles/page.tsx`

- [ ] **Step 1: Add region/city to filters state (around line 31)**

```typescript
region: searchParams.get('region') || '',
city: searchParams.get('city') || '',
```

- [ ] **Step 2: Add filter logic in useMemo (after fuelType filter ~line 80)**

```typescript
if (filters.region) {
  result = result.filter((v) => v.seller.county === filters.region);
}
if (filters.city) {
  result = result.filter((v) => v.seller.city === filters.city);
}
```

- [ ] **Step 3: Add URL params handling**

In the `handleFilterChange` function (around line 137-147), update the URL params section to include:
```typescript
if (filters.region) params.set('region', filters.region);
if (filters.city) params.set('city', filters.city);
```

- [ ] **Step 4: Update resetFilters**

In the `resetFilters` function (around line 149-166), add to the reset object:
```typescript
region: '',
city: '',
```

- [ ] **Step 5: Commit**

```bash
git add app/vehicles/page.tsx
git commit -m "feat: add region/city filter logic to vehicles page"
```

---

### Task 5: Install Leaflet Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet tsx
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add leaflet, react-leaflet, and tsx dependencies"
```

---

### Task 6: Leaflet Map Components

**Files:**
- Create: `components/Map.tsx`
- Create: `components/LeafletMap.tsx`

- [ ] **Step 1: Create Map.tsx (dynamic import wrapper)**

```tsx
'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Loading map...</span>
      </div>
    )
  }
);

export default function Map(props: React.ComponentProps<typeof LeafletMap>) {
  return <LeafletMap {...props} />;
}
```

- [ ] **Step 2: Create LeafletMap.tsx**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add components/Map.tsx components/LeafletMap.tsx
git commit -m "feat: add Leaflet map components with vehicle markers"
```

---

### Task 7: Map View Page

**Files:**
- Create: `app/vehicles/map/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import Map from '@/components/Map';
import FilterSidebar from '@/components/FilterSidebar';
import { vehicles } from '@/data/vehicles';

export default function MapPage() {
  const vehiclesWithCoords = vehicles
    .filter(v => v.seller.latitude && v.seller.longitude)
    .map(v => ({
      id: v.id,
      title: v.title,
      price: v.price,
      image: v.images[0] || '',
      latitude: v.seller.latitude!,
      longitude: v.seller.longitude!,
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-[calc(100vh-64px)]">
        <aside className="w-80 bg-white p-4 overflow-y-auto border-r">
          <h1 className="text-xl font-bold mb-4">Map View</h1>
          <p className="text-sm text-gray-600 mb-4">
            Showing {vehiclesWithCoords.length} vehicles on map
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Click on markers to see vehicle details
            </p>
          </div>
          <div className="mt-4">
            <a 
              href="/vehicles" 
              className="block text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Switch to List View
            </a>
          </div>
        </aside>
        <main className="flex-1">
          <Map vehicles={vehiclesWithCoords} />
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add link to map view in Navbar**

In `components/Navbar.tsx`, find the navigation links section. Add a new link:
```tsx
<Link 
  href="/vehicles/map" 
  className="text-gray-700 hover:text-primary-600"
>
  Map
</Link>
```

Add it next to the existing "Vehicles" link.

- [ ] **Step 3: Commit**

```bash
git add app/vehicles/map/page.tsx components/Navbar.tsx
git commit -m "feat: add map view page and Navbar link"
```

---

### Task 8: Delivery Rate Model

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/seed-delivery-rates.ts`

- [ ] **Step 1: Add DeliveryRate model**

```prisma
model DeliveryRate {
  id        String   @id @default(cuid())
  county    String   @unique
  baseFee   Int
  perKmFee  Int
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- [ ] **Step 2: Run prisma db push**

```bash
npx prisma db push
```

- [ ] **Step 3: Create seed script for delivery rates**

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const deliveryRates = [
  { county: 'Nairobi', baseFee: 0, perKmFee: 0 },
  { county: 'Mombasa', baseFee: 0, perKmFee: 0 },
  { county: 'Kisumu', baseFee: 5000, perKmFee: 45 },
  { county: 'Nakuru', baseFee: 3000, perKmFee: 40 },
  { county: 'Eldoret', baseFee: 8000, perKmFee: 55 },
  { county: 'Kakamega', baseFee: 6000, perKmFee: 45 },
  { county: 'Meru', baseFee: 7000, perKmFee: 50 },
  { county: 'Kiambu', baseFee: 2000, perKmFee: 35 },
  { county: 'Nyeri', baseFee: 5000, perKmFee: 45 },
  { county: 'Kisii', baseFee: 7000, perKmFee: 50 },
  { county: 'Narok', baseFee: 6000, perKmFee: 45 },
  { county: 'Kajiado', baseFee: 4000, perKmFee: 40 },
  { county: 'Machakos', baseFee: 5000, perKmFee: 45 },
  { county: 'Kitui', baseFee: 8000, perKmFee: 55 },
  { county: 'Embu', baseFee: 6000, perKmFee: 50 },
  { county: 'Garissa', baseFee: 15000, perKmFee: 70 },
  { county: 'Mandera', baseFee: 25000, perKmFee: 90 },
  { county: 'Wajir', baseFee: 22000, perKmFee: 85 },
  { county: 'Lamu', baseFee: 12000, perKmFee: 65 },
];

async function main() {
  for (const rate of deliveryRates) {
    await prisma.deliveryRate.upsert({
      where: { county: rate.county },
      update: rate,
      create: rate,
    });
  }
  console.log('Seeded delivery rates');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 4: Run seed**

```bash
npx tsx prisma/seed-delivery-rates.ts
```

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/seed-delivery-rates.ts
git commit -m "feat: add DeliveryRate model and seed data"
npx prisma generate
git add prisma/
git commit -m "chore: generate Prisma client"
```

---

### Task 9: Delivery API Routes

**Files:**
- Create: `app/api/delivery/rates/route.ts`
- Create: `app/api/delivery/calculate/route.ts`

- [ ] **Step 1: Create GET delivery rates route**

```typescript
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const rates = await db.deliveryRate.findMany({
    where: { isActive: true },
    orderBy: { county: 'asc' },
  });
  return NextResponse.json(rates);
}
```

- [ ] **Step 2: Create calculate delivery route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { COUNTY_COORDINATES, calculateDistance } from '@/lib/kenya-regions';

export async function POST(req: NextRequest) {
  const { fromCounty, toCounty } = await req.json();

  if (!fromCounty || !toCounty) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const fromCoords = COUNTY_COORDINATES[fromCounty];
  const toCoords = COUNTY_COORDINATES[toCounty];

  if (!fromCoords || !toCoords) {
    return NextResponse.json({ error: 'Invalid county' }, { status: 400 });
  }

  const distanceKm = Math.round(
    calculateDistance(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng)
  );

  const toRate = await db.deliveryRate.findUnique({
    where: { county: toCounty },
  });

  const baseFee = toRate?.baseFee || 5000;
  const perKmFee = toRate?.perKmFee || 50;
  const distanceFee = distanceKm * perKmFee;
  const totalFee = baseFee + distanceFee;

  return NextResponse.json({
    fromCounty,
    toCounty,
    distanceKm,
    baseFee,
    perKmFee,
    distanceFee,
    totalFee,
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/delivery/rates/route.ts app/api/delivery/calculate/route.ts
git commit -m "feat: add delivery rate API routes"
```

---

### Task 10: Delivery Calculator Component

**Files:**
- Create: `components/DeliveryCalculator.tsx`

- [ ] **Step 1: Create DeliveryCalculator component**

```tsx
'use client';

import { useState } from 'react';
import { KENYA_COUNTIES } from '@/lib/kenya-regions';

interface DeliveryCalculatorProps {
  sellerCounty: string;
}

export default function DeliveryCalculator({ sellerCounty }: DeliveryCalculatorProps) {
  const [toCounty, setToCounty] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    if (!toCounty || toCounty === sellerCounty) return;
    setLoading(true);
    try {
      const res = await fetch('/api/delivery/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromCounty: sellerCounty, toCounty }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="font-semibold mb-3">Delivery Calculator</h3>
      <p className="text-sm text-gray-600 mb-3">
        Seller location: <span className="font-medium">{sellerCounty}</span>
      </p>
      
      <select
        value={toCounty}
        onChange={(e) => setToCounty(e.target.value)}
        className="w-full px-3 py-2 border rounded-md text-sm mb-3"
      >
        <option value="">Select delivery county</option>
        {KENYA_COUNTIES.filter(c => c !== sellerCounty).map(county => (
          <option key={county} value={county}>{county}</option>
        ))}
      </select>

      <button
        onClick={calculate}
        disabled={!toCounty || loading}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 text-sm"
      >
        {loading ? 'Calculating...' : 'Calculate Delivery Fee'}
      </button>

      {result && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span>Distance:</span>
            <span>{result.distanceKm} km</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Base fee:</span>
            <span>KES {result.baseFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Distance fee:</span>
            <span>KES {result.distanceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold mt-2 pt-2 border-t">
            <span>Total:</span>
            <span className="text-primary-600">KES {result.totalFee.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add DeliveryCalculator to vehicle detail page**

Read `app/vehicles/[id]/page.tsx`. Find the seller info section (around line ~200-250). Import the component and add it:
```tsx
import DeliveryCalculator from '@/components/DeliveryCalculator';

// In the seller info section, after seller contact info:
{vehicle.seller.county && (
  <DeliveryCalculator sellerCounty={vehicle.seller.county} />
)}
```

- [ ] **Step 3: Commit**

```bash
git add components/DeliveryCalculator.tsx app/vehicles/\[id\]/page.tsx
git commit -m "feat: add delivery calculator component"
```

---

### Task 11: Build and Verify

**Files:**
- Modify: Various (if needed)

- [ ] **Step 1: Run build**

```bash
npm run build
```

- [ ] **Step 2: Fix any errors**

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: complete Phase 5B regional features"
git push
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Kenya regions data library |
| 2 | Update types and mock data |
| 3 | FilterSidebar location filters |
| 4 | Vehicles page filter logic |
| 5 | Install Leaflet dependencies |
| 6 | Leaflet map components |
| 7 | Map view page |
| 8 | Delivery rate model |
| 9 | Delivery API routes |
| 10 | Delivery calculator component |
| 11 | Build and verify |
