# Phase 5B: Regional Features Specification

## Overview

Add location-based features for Kenya-specific regional functionality: county/city filtering, map view, and delivery estimates.

## Scope

1. **Kenya Regions Data** - All 47 counties + major cities + coordinates
2. **Location Filtering** - Filter vehicles by region/city (working with mock data)
3. **Map View** - Leaflet/OpenStreetMap integration
4. **Delivery Calculator** - Shipping estimates using Haversine formula

---

## 1. Kenya Regions Data

### File: `lib/kenya-regions.ts`

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
  const R = 6371; // Earth's radius in km
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

---

## 2. Location Filtering

### Update Vehicle Type

```typescript
// types/index.ts - add to Seller interface
export interface Seller {
  name: string;
  phone: string;
  location: string;
  city?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
}
```

### Update Mock Data

Add county, city, coordinates to each vehicle in `data/vehicles.ts`.

### FilterSidebar.tsx Updates

1. Import Kenya regions
2. Add to FilterSidebarProps interface: `region`, `city`
3. Add region/city filter UI section
4. Update hasActiveFilters check

### vehicles/page.tsx Updates

1. Add `region`, `city` to filters state
2. Add filter logic for region/city matching
3. Update URL params handling

---

## 3. Map View

### Dependencies

```bash
npm install leaflet react-leaflet @types/leaflet
```

### Component: `components/Map.tsx` (Client Component)

```tsx
'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false,
    loading: () => <div className="h-[500px] bg-gray-100 animate-pulse rounded-lg" />
  }
);

export default Map;
```

### Component: `components/LeafletMap.tsx`

- Use `react-leaflet` with OpenStreetMap tiles
- Custom markers with vehicle icons
- Marker clustering for 100+ vehicles
- Popup with vehicle card on click
- Responsive sizing

### New Page: `app/vehicles/map/page.tsx`

- Full-screen map with filter overlay
- Toggle between map and list view
- Responsive layout

---

## 4. Delivery Calculator

### Prisma Schema

```prisma
model DeliveryRate {
  id          String @id @default(cuid())
  county      String @unique
  baseFee     Int
  perKmFee    Int
  isActive    Boolean @default(true)
}
```

### Seed Data

Create seed script with base fees for major counties (KES 5,000-15,000 base + KES 50/km).

### Distance Calculation

Use Haversine formula with COUNTY_COORDINATES to calculate distance between seller and buyer county.

### API Route: `app/api/delivery/calculate/route.ts`

```typescript
POST /api/delivery/calculate
Body: { fromCounty, toCounty }
Response: { 
  baseFee: number,
  distanceKm: number, 
  estimatedFee: number,
  breakdown: { baseFee, distanceFee, total }
}
```

### Component: `components/DeliveryCalculator.tsx`

- Select "deliver to" county
- Show distance and fee breakdown
- "Request Delivery" button (links to contact seller)

---

## 5. Implementation Order

1. **lib/kenya-regions.ts** - Data utilities
2. **types/index.ts** - Update Seller interface
3. **data/vehicles.ts** - Add location data to mock vehicles
4. **FilterSidebar.tsx** - Add region/city filters
5. **vehicles/page.tsx** - Filter logic
6. **Leaflet setup** - Install dependencies, create components
7. **app/vehicles/map/page.tsx** - Map view page
8. **Prisma schema** - Add DeliveryRate model
9. **Seed script** - Populate delivery rates
10. **API route** - Delivery calculation
11. **DeliveryCalculator.tsx** - UI component

---

## Acceptance Criteria

1. ✅ All 47 Kenya counties available in dropdown
2. ✅ City dropdown filters based on selected county  
3. ✅ Vehicles can be filtered by region and city
4. ✅ Map view shows vehicles as markers
5. ✅ Click marker shows vehicle popup
6. ✅ Delivery calculator shows estimates
7. ✅ Delivery fees calculated using Haversine distance
8. ✅ Mobile responsive on all pages
9. ✅ Works with existing mock data structure
10. ✅ SSR handled for Leaflet maps
