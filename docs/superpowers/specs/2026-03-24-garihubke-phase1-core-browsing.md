# GariHub Phase 1: Core Vehicle Browsing

## Overview

Phase 1 of the GariHub vehicle marketplace focuses on core vehicle browsing functionality - the essential experience users need to discover and view vehicles.

## Goals

1. Establish the visual/UX foundation
2. Enable immediate vehicle discovery
3. Validate core user flows before adding auth/complex features

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Data**: Static JSON (no backend yet)
- **Deployment**: Vercel

## Pages

### 1. Homepage (`/`)

**Sections:**
- **Navbar**: Logo, Navigation links (Home, Vehicles, Sell, About), Contact
- **Hero**: Large headline, subheadline, search bar
- **Featured Vehicles**: Horizontal scroll carousel (6 vehicles)
- **Categories**: Grid of 4 category cards (Cars, Motorbikes, Trucks, Vans)
- **CTA Banner**: "Sell Your Vehicle" call-to-action
- **Footer**: Links, social icons, copyright

### 2. Listing Page (`/vehicles`)

**Layout:**
- **Left Sidebar**: Filters (collapsible on mobile)
  - Price range (slider)
  - Make (dropdown)
  - Model (dropdown, depends on make)
  - Year (min/max)
  - Fuel type (checkboxes)
  - Transmission (checkboxes)
- **Main Content**:
  - Header with result count and sort dropdown
  - Vehicle grid (3 columns desktop, 2 tablet, 1 mobile)
  - Pagination (numbered)
- **VehicleCard**: Image, title, price, year, mileage, location, favorite button

### 3. Vehicle Details Page (`/vehicles/[id]`)

**Sections:**
- **Image Gallery**: Main image + thumbnail strip, lightbox on click
- **Vehicle Info**: Title, price, key specs (year, mileage, fuel, transmission)
- **Description**: Full text description
- **Features**: List of features/amenities
- **Seller Card**: Name, phone, location, "Call Now" button
- **Similar Vehicles**: Grid of 4 related vehicles

## Data Model

```typescript
interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  description: string;
  images: string[];
  seller: {
    name: string;
    phone: string;
    location: string;
  };
  features: string[];
  category: 'cars' | 'motorbikes' | 'trucks' | 'vans';
  createdAt: string;
}
```

## Mock Data

- 20 vehicles covering all categories
- Mix of makes/models/years
- Realistic Kenyan prices (KSh)
- Placeholder images from picsum.photos

## Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Acceptance Criteria

1. Homepage loads with hero, featured vehicles, categories, CTA
2. Clicking "View All" on featured vehicles goes to listing page
3. Listing page displays all vehicles in grid
4. Filters update vehicle list (client-side)
5. Clicking a vehicle card navigates to details page
6. Details page shows all vehicle info, gallery, seller contact
7. "Similar vehicles" shows 4 vehicles from same category
8. All pages are responsive (mobile-friendly)
9. Navigation works between all pages
10. No console errors on any page
