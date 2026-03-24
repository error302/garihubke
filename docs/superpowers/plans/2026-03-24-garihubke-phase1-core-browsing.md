# GariHub Phase 1: Core Vehicle Browsing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build core vehicle browsing experience - homepage, listing page, and vehicle details page with filters, search, and favorites.

**Architecture:** Next.js 14 App Router with static JSON data. Tailwind CSS for styling. Client-side filtering/search with localStorage for favorites.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, TypeScript

---

## File Structure

```
garihubke/
├── app/
│   ├── layout.tsx          # Root layout with Navbar/Footer
│   ├── page.tsx            # Homepage
│   ├── vehicles/
│   │   ├── page.tsx        # Listing page with filters
│   │   └── [id]/
│   │       └── page.tsx    # Vehicle details page
│   ├── about/
│   │   └── page.tsx        # About page
│   ├── sell/
│   │   └── page.tsx        # Sell placeholder
│   └── contact/
│       └── page.tsx        # Contact placeholder
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── VehicleCard.tsx
│   ├── VehicleGrid.tsx
│   ├── FilterSidebar.tsx
│   ├── SearchBar.tsx
│   ├── ImageGallery.tsx
│   ├── SellerCard.tsx
│   ├── SimilarVehicles.tsx
│   └── Lightbox.tsx
├── data/
│   └── vehicles.ts         # Mock vehicle data
├── types/
│   └── index.ts            # TypeScript interfaces
├── lib/
│   └── utils.ts            # Helper functions
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `app/globals.css`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "garihubke",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0"
  },
  "devDependencies": {
    "@types/node": "20.14.12",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.7",
    "typescript": "5.5.4"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 4: Create tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Create postcss.config.mjs**

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

- [ ] **Step 6: Create app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground: #171717;
  --background: #ffffff;
}

body {
  color: var(--foreground);
  background: var(--background);
}
```

- [ ] **Step 7: Install dependencies**

Run: `npm install`

- [ ] **Step 8: Commit**

```bash
git add package.json tsconfig.json next.config.ts tailwind.config.ts postcss.config.mjs app/globals.css
git commit -m "chore: set up Next.js project with Tailwind"
```

---

## Task 2: Types and Mock Data

**Files:**
- Create: `types/index.ts`
- Create: `data/vehicles.ts`

- [ ] **Step 1: Create types/index.ts**

```typescript
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';
export type Transmission = 'manual' | 'automatic';
export type Category = 'cars' | 'motorbikes' | 'trucks' | 'vans';

export interface Seller {
  name: string;
  phone: string;
  location: string;
}

export interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  description: string;
  images: string[];
  seller: Seller;
  features: string[];
  category: Category;
  createdAt: string;
}
```

- [ ] **Step 2: Create data/vehicles.ts**

```typescript
import { Vehicle } from '@/types';

export const vehicles: Vehicle[] = [
  {
    id: '1',
    title: 'Toyota Prado TXL 2020',
    make: 'Toyota',
    model: 'Prado',
    year: 2020,
    price: 8500000,
    mileage: 45000,
    fuelType: 'diesel',
    transmission: 'automatic',
    description: 'Excellent condition Toyota Prado TXL. Full leather interior, sunroof, reverse camera, alloy wheels. Recently serviced. All documents clear.',
    images: [
      'https://picsum.photos/seed/prado1/800/600',
      'https://picsum.photos/seed/prado2/800/600',
      'https://picsum.photos/seed/prado3/800/600',
      'https://picsum.photos/seed/prado4/800/600',
    ],
    seller: {
      name: 'Kenya Auto Sales',
      phone: '+254 700 123 456',
      location: 'Nairobi',
    },
    features: ['Sunroof', 'Leather Seats', 'Reverse Camera', 'Alloy Wheels', 'Bluetooth', 'GPS'],
    category: 'cars',
    createdAt: '2026-03-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Honda Civic 2019',
    make: 'Honda',
    model: 'Civic',
    year: 2019,
    price: 1850000,
    mileage: 62000,
    fuelType: 'petrol',
    transmission: 'automatic',
    description: 'Reliable Honda Civic in great condition. Fuel efficient, low maintenance costs. Original paint, no accidents.',
    images: [
      'https://picsum.photos/seed/civic1/800/600',
      'https://picsum.photos/seed/civic2/800/600',
    ],
    seller: {
      name: 'James Mwangi',
      phone: '+254 712 345 678',
      location: 'Kisumu',
    },
    features: ['Air Conditioning', 'Power Windows', 'ABS', 'Bluetooth'],
    category: 'cars',
    createdAt: '2026-03-19T14:30:00Z',
  },
  {
    id: '3',
    title: 'Toyota Hiace 2018',
    make: 'Toyota',
    model: 'Hiace',
    year: 2018,
    price: 2200000,
    mileage: 98000,
    fuelType: 'diesel',
    transmission: 'manual',
    description: 'Spacious Toyota Hiace van. Perfect for transport business. Well maintained, new tires, new battery.',
    images: [
      'https://picsum.photos/seed/hiace1/800/600',
      'https://picsum.photos/seed/hiace2/800/600',
    ],
    seller: {
      name: 'Eastland Motors',
      phone: '+254 733 987 654',
      location: 'Nairobi',
    },
    features: ['Power Steering', 'Air Conditioning', 'Radio/CD'],
    category: 'vans',
    createdAt: '2026-03-18T09:15:00Z',
  },
  {
    id: '4',
    title: 'Kawasaki Ninja 400 2021',
    make: 'Kawasaki',
    model: 'Ninja 400',
    year: 2021,
    price: 650000,
    mileage: 12000,
    fuelType: 'petrol',
    transmission: 'manual',
    description: 'Sport bike in excellent condition. Low mileage, full service history. Just serviced with new oil and filters.',
    images: [
      'https://picsum.photos/seed/ninja1/800/600',
      'https://picsum.photos/seed/ninja2/800/600',
    ],
    seller: {
      name: 'Bike World KE',
      phone: '+254 770 111 222',
      location: 'Mombasa',
    },
    features: ['Digital Dashboard', 'LED Lights', 'Disc Brakes'],
    category: 'motorbikes',
    createdAt: '2026-03-17T16:45:00Z',
  },
  {
    id: '5',
    title: 'Isuzu D-Max 2021',
    make: 'Isuzu',
    model: 'D-Max',
    year: 2021,
    price: 3200000,
    mileage: 38000,
    fuelType: 'diesel',
    transmission: 'automatic',
    description: 'Powerful Isuzu D-Max double cab. 4x4 capability, tow bar included. Lady driven, non-smoker vehicle.',
    images: [
      'https://picsum.photos/seed/dmax1/800/600',
      'https://picsum.photos/seed/dmax2/800/600',
    ],
    seller: {
      name: 'Premium Autos',
      phone: '+254 755 444 555',
      location: 'Nairobi',
    },
    features: ['4x4', 'Tow Bar', 'Leather Seats', 'Reverse Camera', 'Cruise Control'],
    category: 'cars',
    createdAt: '2026-03-16T11:20:00Z',
  },
  {
    id: '6',
    title: 'Toyota Wish 2017',
    make: 'Toyota',
    model: 'Wish',
    year: 2017,
    price: 1650000,
    mileage: 78000,
    fuelType: 'petrol',
    transmission: 'automatic',
    description: 'Family car with 7 seats. Spacious interior, good ground clearance. Economical on fuel.',
    images: [
      'https://picsum.photos/seed/wish1/800/600',
      'https://picsum.photos/seed/wish2/800/600',
    ],
    seller: {
      name: 'Auto Zone',
      phone: '+254 721 888 999',
      location: 'Nakuru',
    },
    features: ['7 Seats', 'Air Conditioning', 'Power Windows', 'Alloy Wheels'],
    category: 'cars',
    createdAt: '2026-03-15T08:30:00Z',
  },
  {
    id: '7',
    title: 'Yamaha MT-07 2020',
    make: 'Yamaha',
    model: 'MT-07',
    year: 2020,
    price: 480000,
    mileage: 18500,
    fuelType: 'petrol',
    transmission: 'manual',
    description: 'Naked bike perfect for city riding. Aggressive looks, comfortable ergonomics. Recent service done.',
    images: [
      'https://picsum.photos/seed/mt07-1/800/600',
      'https://picsum.photos/seed/mt07-2/800/600',
    ],
    seller: {
      name: 'Nairobi Bikes',
      phone: '+254 702 333 444',
      location: 'Nairobi',
    },
    features: ['Digital Instrument', 'LED Lights', 'Slipper Clutch'],
    category: 'motorbikes',
    createdAt: '2026-03-14T13:00:00Z',
  },
  {
    id: '8',
    title: 'Mitsubishi Fuso Truck 2019',
    make: 'Mitsubishi',
    model: 'Fuso',
    year: 2019,
    price: 4500000,
    mileage: 55000,
    fuelType: 'diesel',
    transmission: 'manual',
    description: 'Heavy duty truck for cargo. Powerful engine, reliable transmission. Good for long distance transport.',
    images: [
      'https://picsum.photos/seed/fuso1/800/600',
      'https://picsum.photos/seed/fuso2/800/600',
    ],
    seller: {
      name: 'Kenya Truck Dealers',
      phone: '+254 757 666 777',
      location: 'Nairobi',
    },
    features: ['Cargo Bed', 'Power Steering', 'Air Brakes'],
    category: 'trucks',
    createdAt: '2026-03-13T10:45:00Z',
  },
  {
    id: '9',
    title: 'Nissan X-Trail 2020',
    make: 'Nissan',
    model: 'X-Trail',
    year: 2020,
    price: 3800000,
    mileage: 42000,
    fuelType: 'petrol',
    transmission: 'automatic',
    description: 'Premium SUV with panoramic roof. 4WD, perfect for adventures. Full leather, navigation system.',
    images: [
      'https://picsum.photos/seed/xtrail1/800/600',
      'https://picsum.photos/seed/xtrail2/800/600',
    ],
    seller: {
      name: 'Luxury Auto KE',
      phone: '+254 758 888 000',
      location: 'Nairobi',
    },
    features: ['Panoramic Roof', '4WD', 'Leather Seats', 'Navigation', '360 Camera'],
    category: 'cars',
    createdAt: '2026-03-12T15:30:00Z',
  },
  {
    id: '10',
    title: 'Honda PCX 150 2022',
    make: 'Honda',
    model: 'PCX 150',
    year: 2022,
    price: 280000,
    mileage: 8000,
    fuelType: 'petrol',
    transmission: 'automatic',
    description: 'Scooter perfect for city commute. Fuel efficient, easy to ride. Low mileage, like new.',
    images: [
      'https://picsum.photos/seed/pcx1/800/600',
      'https://picsum.photos/seed/pcx2/800/600',
    ],
    seller: {
      name: 'Mombasa Scooters',
      phone: '+254 710 222 333',
      location: 'Mombasa',
    },
    features: ['Start Button', 'Digital Dashboard', 'Under-seat Storage'],
    category: 'motorbikes',
    createdAt: '2026-03-11T09:00:00Z',
  },
  {
    id: '11',
    title: 'Mercedes C-Class 2018',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2018,
    price: 4200000,
    mileage: 65000,
    fuelType: 'petrol',
    transmission: 'automatic',
    description: 'Luxury sedan in excellent condition. Full service history, all upgrades included. Premium sound system.',
    images: [
      'https://picsum.photos/seed/cclass1/800/600',
      'https://picsum.photos/seed/cclass2/800/600',
    ],
    seller: {
      name: 'German Auto Specialists',
      phone: '+254 759 999 111',
      location: 'Nairobi',
    },
    features: ['Leather Seats', 'Sunroof', 'Premium Audio', 'Navigation', 'Heated Seats'],
    category: 'cars',
    createdAt: '2026-03-10T14:20:00Z',
  },
  {
    id: '12',
    title: 'Ford Ranger 2020',
    make: 'Ford',
    model: 'Ranger',
    year: 2020,
    price: 3800000,
    mileage: 48000,
    fuelType: 'diesel',
    transmission: 'automatic',
    description: 'Strong and reliable Ford Ranger. 4x4, towing capacity. Sports bar and alloy wheels.',
    images: [
      'https://picsum.photos/seed/ranger1/800/600',
      'https://picsum.photos/seed/ranger2/800/600',
    ],
    seller: {
      name: 'Ford Kenya',
      phone: '+254 756 444 888',
      location: 'Nairobi',
    },
    features: ['4x4', 'Sports Bar', 'Alloy Wheels', 'Tow Bar', 'Bed Liner'],
    category: 'cars',
    createdAt: '2026-03-09T11:15:00Z',
  },
  {
    id: '13',
    title: 'Toyota Noah 2019',
    make: 'Toyota',
    model: 'Noah',
    year: 2019,
    price: 2100000,
    mileage: 72000,
    fuelType: 'petrol',
    transmission: 'automatic',
    description: '8-seater minivan. Reliable, fuel efficient. Perfect for family or taxi business.',
    images: [
      'https://picsum.photos/seed/noah1/800/600',
      'https://picsum.photos/seed/noah2/800/600',
    ],
    seller: {
      name: 'Family Auto Sales',
      phone: '+254 753 555 666',
      location: 'Eldoret',
    },
    features: ['8 Seats', 'Air Conditioning', 'Power Windows', 'Radio'],
    category: 'vans',
    createdAt: '2026-03-08T08:45:00Z',
  },
  {
    id: '14',
    title: 'TVS Apache 200 2021',
    make: 'TVS',
    model: 'Apache 200',
    year: 2021,
    price: 185000,
    mileage: 22000,
    fuelType: 'petrol',
    transmission: 'manual',
    description: 'Sporty motorcycle at affordable price. Good performance, stylish design. Well maintained.',
    images: [
      'https://picsum.photos/seed/apache1/800/600',
      'https://picsum.photos/seed/apache2/800/600',
    ],
    seller: {
      name: 'Affordable Bikes',
      phone: '+254 701 777 888',
      location: 'Nairobi',
    },
    features: ['Digital Instrument', 'LED DRLs', 'Disc Brakes'],
    category: 'motorbikes',
    createdAt: '2026-03-07T16:00:00Z',
  },
  {
    id: '15',
    title: 'Hino Truck 2016',
    make: 'Hino',
    model: 'Hino 300',
    year: 2016,
    price: 2800000,
    mileage: 120000,
    fuelType: 'diesel',
    transmission: 'manual',
    description: 'Medium duty truck. Reliable for local deliveries. Good condition, regular maintenance.',
    images: [
      'https://picsum.photos/seed/hino1/800/600',
      'https://picsum.photos/seed/hino2/800/600',
    ],
    seller: {
      name: 'Commercial Vehicles KE',
      phone: '+254 754 333 222',
      location: 'Nairobi',
    },
    features: ['Cargo Body', 'Power Steering', 'Air Conditioning'],
    category: 'trucks',
    createdAt: '2026-03-06T12:30:00Z',
  },
  {
    id: '16',
    title: 'Mazda CX-5 2019',
    make: 'Mazda',
    model: 'CX-5',
    year: 2019,
    price: 3100000,
    mileage: 58000,
    fuelType: 'petrol',
    transmission: 'automatic',
    description: 'Stylish SUV with smooth driving. Skyactive technology, fuel efficient. Full options.',
    images: [
      'https://picsum.photos/seed/cx51/800/600',
      'https://picsum.photos/seed/cx52/800/600',
    ],
    seller: {
      name: 'Mazda Nairobi',
      phone: '+254 752 111 000',
      location: 'Nairobi',
    },
    features: ['Sunroof', 'Leather Seats', 'Navigation', 'Bose Audio', 'Blind Spot Monitor'],
    category: 'cars',
    createdAt: '2026-03-05T10:00:00Z',
  },
  {
    id: '17',
    title: 'Suzuki Carry Van 2020',
    make: 'Suzuki',
    model: 'Carry',
    year: 2020,
    price: 980000,
    mileage: 35000,
    fuelType: 'petrol',
    transmission: 'manual',
    description: 'Economic small van for deliveries. Low fuel consumption, easy maintenance. New tires.',
    images: [
      'https://picsum.photos/seed/carry1/800/600',
      'https://picsum.photos/seed/carry2/800/600',
    ],
    seller: {
      name: 'Small Biz Autos',
      phone: '+254 751 666 555',
      location: 'Thika',
    },
    features: ['Power Steering', 'Radio', 'Cargo Space'],
    category: 'vans',
    createdAt: '2026-03-04T14:45:00Z',
  },
  {
    id: '18',
    title: 'BMW 3 Series 2017',
    make: 'BMW',
    model: '3 Series',
    year: 2017,
    price: 3500000,
    mileage: 72000,
    fuelType: 'petrol',
    transmission: 'automatic',
    description: 'Premium German sedan. Driving pleasure, luxury features. Service history available.',
    images: [
      'https://picsum.photos/seed/bmw1/800/600',
      'https://picsum.photos/seed/bmw2/800/600',
    ],
    seller: {
      name: 'German Motors KE',
      phone: '+254 750 222 111',
      location: 'Nairobi',
    },
    features: ['Leather Seats', 'Sunroof', 'Navigation', 'Parking Sensors', 'Climate Control'],
    category: 'cars',
    createdAt: '2026-03-03T09:30:00Z',
  },
  {
    id: '19',
    title: 'KTM Duke 390 2021',
    make: 'KTM',
    model: 'Duke 390',
    year: 2021,
    price: 520000,
    mileage: 15000,
    fuelType: 'petrol',
    transmission: 'manual',
    description: 'Powerful single cylinder bike. Aggressive styling, trellis frame. Premium components.',
    images: [
      'https://picsum.photos/seed/duke1/800/600',
      'https://picsum.photos/seed/duke2/800/600',
    ],
    seller: {
      name: 'KTM Nairobi',
      phone: '+254 749 888 777',
      location: 'Nairobi',
    },
    features: ['WP Suspension', 'ByBre Brakes', 'TFT Display', 'LED Lights', 'Quick shifter'],
    category: 'motorbikes',
    createdAt: '2026-03-02T15:15:00Z',
  },
  {
    id: '20',
    title: 'Ford Transit 2019',
    make: 'Ford',
    model: 'Transit',
    year: 2019,
    price: 3200000,
    mileage: 68000,
    fuelType: 'diesel',
    transmission: 'manual',
    description: 'Large van for commercial use. High roof, large cargo area. Reliable diesel engine.',
    images: [
      'https://picsum.photos/seed/transit1/800/600',
      'https://picsum.photos/seed/transit2/800/600',
    ],
    seller: {
      name: 'Commercial Fleet Sales',
      phone: '+254 748 555 444',
      location: 'Nairobi',
    },
    features: ['High Roof', 'Cargo Area', 'Power Steering', 'Air Conditioning'],
    category: 'vans',
    createdAt: '2026-03-01T11:00:00Z',
  },
];

export const categories = [
  { id: 'cars', name: 'Cars', icon: '🚗', count: vehicles.filter(v => v.category === 'cars').length },
  { id: 'motorbikes', name: 'Motorbikes', icon: '🏍️', count: vehicles.filter(v => v.category === 'motorbikes').length },
  { id: 'trucks', name: 'Trucks', icon: '🚚', count: vehicles.filter(v => v.category === 'trucks').length },
  { id: 'vans', name: 'Vans', icon: '🚐', count: vehicles.filter(v => v.category === 'vans').length },
];

export const makes = [...new Set(vehicles.map(v => v.make))].sort();
export const getModelsForMake = (make: string) => 
  [...new Set(vehicles.filter(v => v.make === make).map(v => v.model))].sort();
```

- [ ] **Step 3: Commit**

```bash
git add types/index.ts data/vehicles.ts
git commit -m "feat: add TypeScript types and mock vehicle data"
```

---

## Task 3: Utility Functions

**Files:**
- Create: `lib/utils.ts`

- [ ] **Step 1: Create lib/utils.ts**

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('KES', 'KSh');
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-KE').format(num);
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/utils.ts
git commit -m "feat: add utility functions"
```

---

## Task 4: Core Components

**Files:**
- Create: `components/Navbar.tsx`
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create components/Navbar.tsx**

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/vehicles', label: 'Vehicles' },
  { href: '/sell', label: 'Sell' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">GariHub</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-gray-700 hover:text-primary-600 transition-colors',
                  pathname === link.href && 'text-primary-600 font-medium'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block py-2 text-gray-700 hover:text-primary-600',
                  pathname === link.href && 'text-primary-600 font-medium'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create components/Footer.tsx**

```typescript
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary-400 mb-4">GariHub</h3>
            <p className="text-gray-400">Kenya&apos;s trusted vehicle marketplace. Find your perfect ride today.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/vehicles" className="text-gray-400 hover:text-white">Browse Vehicles</Link></li>
              <li><Link href="/sell" className="text-gray-400 hover:text-white">Sell Your Car</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/vehicles?category=cars" className="text-gray-400 hover:text-white">Cars</Link></li>
              <li><Link href="/vehicles?category=motorbikes" className="text-gray-400 hover:text-white">Motorbikes</Link></li>
              <li><Link href="/vehicles?category=trucks" className="text-gray-400 hover:text-white">Trucks</Link></li>
              <li><Link href="/vehicles?category=vans" className="text-gray-400 hover:text-white">Vans</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Nairobi, Kenya</li>
              <li>info@garihubke.com</li>
              <li>+254 700 000 000</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} GariHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx components/Footer.tsx
git commit -m "feat: add Navbar and Footer components"
```

---

## Task 5: Vehicle Components

**Files:**
- Create: `components/VehicleCard.tsx`
- Create: `components/VehicleGrid.tsx`

- [ ] **Step 1: Create components/VehicleCard.tsx**

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Vehicle } from '@/types';
import { formatPrice, cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(vehicle.id));
  }, [vehicle.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    if (favorites.includes(vehicle.id)) {
      newFavorites = favorites.filter((id: string) => id !== vehicle.id);
    } else {
      newFavorites = [...favorites, vehicle.id];
    }
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <Link href={`/vehicles/${vehicle.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
            src={vehicle.images[0]}
            alt={vehicle.title}
            fill
            className="object-cover"
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <svg
              className={cn('w-5 h-5', isFavorite ? 'text-red-500 fill-current' : 'text-gray-500')}
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">{vehicle.title}</h3>
          <p className="text-primary-600 font-bold text-xl mt-1">{formatPrice(vehicle.price)}</p>
          
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <span>{vehicle.year}</span>
            <span>{vehicle.mileage.toLocaleString()} km</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{vehicle.seller.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create components/VehicleGrid.tsx**

```typescript
import { Vehicle } from '@/types';
import VehicleCard from './VehicleCard';

interface VehicleGridProps {
  vehicles: Vehicle[];
}

export default function VehicleGrid({ vehicles }: VehicleGridProps) {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No vehicles found</p>
        <p className="text-gray-400 mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/VehicleCard.tsx components/VehicleGrid.tsx
git commit -m "feat: add VehicleCard and VehicleGrid components"
```

---

## Task 6: Filter and Search Components

**Files:**
- Create: `components/FilterSidebar.tsx`
- Create: `components/SearchBar.tsx`

- [ ] **Step 1: Create components/FilterSidebar.tsx**

```typescript
'use client';

import { makes, getModelsForMake, categories } from '@/data/vehicles';

interface FilterSidebarProps {
  filters: {
    category: string;
    make: string;
    model: string;
    minPrice: string;
    maxPrice: string;
    yearMin: string;
    yearMax: string;
    fuelType: string[];
    transmission: string[];
  };
  onFilterChange: (filters: FilterSidebarProps['filters']) => void;
}

const fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'];
const transmissions = ['manual', 'automatic'];

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const handleMakeChange = (make: string) => {
    onFilterChange({ ...filters, make, model: '' });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category, make: '', model: '' });
  };

  const handleFuelTypeToggle = (fuel: string) => {
    const newFuelTypes = filters.fuelType.includes(fuel)
      ? filters.fuelType.filter(f => f !== fuel)
      : [...filters.fuelType, fuel];
    onFilterChange({ ...filters, fuelType: newFuelTypes });
  };

  const handleTransmissionToggle = (trans: string) => {
    const newTransmissions = filters.transmission.includes(trans)
      ? filters.transmission.filter(t => t !== trans)
      : [...filters.transmission, trans];
    onFilterChange({ ...filters, transmission: newTransmissions });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <select
          value={filters.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Make</h3>
        <select
          value={filters.make}
          onChange={(e) => handleMakeChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="">All Makes</option>
          {makes.map((make) => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>
      </div>

      {filters.make && (
        <div>
          <h3 className="font-semibold mb-3">Model</h3>
          <select
            value={filters.model}
            onChange={(e) => onFilterChange({ ...filters, model: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="">All Models</option>
            {getModelsForMake(filters.make).map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-3">Year</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="From"
            value={filters.yearMin}
            onChange={(e) => onFilterChange({ ...filters, yearMin: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="To"
            value={filters.yearMax}
            onChange={(e) => onFilterChange({ ...filters, yearMax: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Fuel Type</h3>
        <div className="space-y-2">
          {fuelTypes.map((fuel) => (
            <label key={fuel} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.fuelType.includes(fuel)}
                onChange={() => handleFuelTypeToggle(fuel)}
                className="rounded"
              />
              <span className="text-sm capitalize">{fuel}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Transmission</h3>
        <div className="space-y-2">
          {transmissions.map((trans) => (
            <label key={trans} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.transmission.includes(trans)}
                onChange={() => handleTransmissionToggle(trans)}
                className="rounded"
              />
              <span className="text-sm capitalize">{trans}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => onFilterChange({
          make: '',
          model: '',
          minPrice: '',
          maxPrice: '',
          yearMin: '',
          yearMax: '',
          fuelType: [],
          transmission: [],
        })}
        className="w-full px-4 py-2 text-sm text-gray-600 border rounded-md hover:bg-gray-50"
      >
        Reset Filters
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create components/SearchBar.tsx**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialValue?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ initialValue = '', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/vehicles?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search make, model, or keyword..."
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/FilterSidebar.tsx components/SearchBar.tsx
git commit -m "feat: add FilterSidebar and SearchBar components"
```

---

## Task 7: Details Page Components

**Files:**
- Create: `components/ImageGallery.tsx`
- Create: `components/SellerCard.tsx`
- Create: `components/SimilarVehicles.tsx`
- Create: `components/Lightbox.tsx`

- [ ] **Step 1: Create components/ImageGallery.tsx**

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <div 
          className="relative h-96 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[selectedIndex]}
            alt={`${title} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden ${
                index === selectedIndex ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <Image
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          initialIndex={selectedIndex}
          title={title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
```

- [ ] **Step 2: Create components/Lightbox.tsx**

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface LightboxProps {
  images: string[];
  initialIndex: number;
  title: string;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex, title, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToPrevious, goToNext]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
        className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div 
        className="relative w-full max-w-4xl h-[80vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className="object-contain"
        />
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
        className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create components/SellerCard.tsx**

```typescript
import { Seller } from '@/types';

interface SellerCardProps {
  seller: Seller;
}

export default function SellerCard({ seller }: SellerCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold text-lg mb-4">Seller Information</h3>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold text-lg">
              {seller.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium">{seller.name}</p>
            <p className="text-sm text-gray-500">{seller.location}</p>
          </div>
        </div>
        
        <a
          href={`tel:${seller.phone}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Now
        </a>
        
        <p className="text-center text-gray-600">{seller.phone}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create components/SimilarVehicles.tsx**

```typescript
import { vehicles } from '@/data/vehicles';
import { Vehicle } from '@/types';
import VehicleCard from './VehicleCard';

interface SimilarVehiclesProps {
  currentVehicle: Vehicle;
  limit?: number;
}

export default function SimilarVehicles({ currentVehicle, limit = 4 }: SimilarVehiclesProps) {
  const similar = vehicles
    .filter((v) => v.category === currentVehicle.category && v.id !== currentVehicle.id)
    .slice(0, limit);

  if (similar.length === 0) {
    const others = vehicles.filter((v) => v.id !== currentVehicle.id).slice(0, limit);
    if (others.length === 0) return null;
    
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {others.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similar.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/ImageGallery.tsx components/Lightbox.tsx components/SellerCard.tsx components/SimilarVehicles.tsx
git commit -m "feat: add ImageGallery, Lightbox, SellerCard, and SimilarVehicles components"
```

---

## Task 8: Root Layout

**Files:**
- Create: `app/layout.tsx`

- [ ] **Step 1: Create app/layout.tsx**

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GariHub - Kenya's Vehicle Marketplace",
  description: "Find your perfect vehicle in Kenya. Cars, motorbikes, trucks, and vans for sale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add root layout with Navbar and Footer"
```

---

## Task 9: Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Create app/page.tsx**

```typescript
import Link from 'next/link';
import { vehicles, categories } from '@/data/vehicles';
import VehicleCard from '@/components/VehicleCard';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  const featuredVehicles = [...vehicles]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Vehicle in Kenya
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Browse thousands of cars, motorbikes, trucks, and vans from trusted sellers
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Vehicles</h2>
            <Link 
              href="/vehicles" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Browse by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/vehicles?category=${category.id}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <span className="text-4xl block mb-2">{category.icon}</span>
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-gray-500 text-sm">{category.count} vehicles</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want to Sell Your Vehicle?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            List your vehicle on GariHub and reach thousands of potential buyers
          </p>
          <Link
            href="/sell"
            className="inline-block px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Sell Your Vehicle
          </Link>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add homepage with hero, featured vehicles, categories, and CTA"
```

---

## Task 10: Listing Page

**Files:**
- Create: `app/vehicles/page.tsx`

- [ ] **Step 1: Create app/vehicles/page.tsx**

```typescript
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { vehicles } from '@/data/vehicles';
import { Vehicle } from '@/types';
import VehicleGrid from '@/components/VehicleGrid';
import FilterSidebar from '@/components/FilterSidebar';
import SearchBar from '@/components/SearchBar';

const ITEMS_PER_PAGE = 12;

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function VehiclesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || searchParams.get('cat') || '',
    make: searchParams.get('make') || '',
    model: '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    yearMin: searchParams.get('yearMin') || '',
    yearMax: searchParams.get('yearMax') || '',
    fuelType: [] as string[],
    transmission: [] as string[],
  });

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.make.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query)
      );
    }

    // Filters
    if (filters.category) {
      result = result.filter((v) => v.category === filters.category);
    }
    if (filters.make) {
      result = result.filter((v) => v.make === filters.make);
    }
    if (filters.model) {
      result = result.filter((v) => v.model === filters.model);
    }
    if (filters.minPrice) {
      result = result.filter((v) => v.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((v) => v.price <= Number(filters.maxPrice));
    }
    if (filters.yearMin) {
      result = result.filter((v) => v.year >= Number(filters.yearMin));
    }
    if (filters.yearMax) {
      result = result.filter((v) => v.year <= Number(filters.yearMax));
    }
    if (filters.fuelType.length > 0) {
      result = result.filter((v) => filters.fuelType.includes(v.fuelType));
    }
    if (filters.transmission.length > 0) {
      result = result.filter((v) => filters.transmission.includes(v.transmission));
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.make) params.set('make', newFilters.make);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    router.push(`/vehicles?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <SearchBar initialValue={searchQuery} onSearch={handleSearch} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} found
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <VehicleGrid vehicles={paginatedVehicles} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded-md ${
                    currentPage === page ? 'bg-primary-600 text-white' : ''
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/vehicles/page.tsx
git commit -m "feat: add vehicles listing page with filters, search, and pagination"
```

---

## Task 11: Vehicle Details Page

**Files:**
- Create: `app/vehicles/[id]/page.tsx`

- [ ] **Step 1: Create app/vehicles/[id]/page.tsx**

```typescript
import { notFound } from 'next/navigation';
import { vehicles } from '@/data/vehicles';
import ImageGallery from '@/components/ImageGallery';
import SellerCard from '@/components/SellerCard';
import SimilarVehicles from '@/components/SimilarVehicles';
import { formatPrice } from '@/lib/utils';

interface VehiclePageProps {
  params: Promise<{ id: string }>;
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const { id } = await params;
  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images and Details */}
        <div className="lg:col-span-2 space-y-8">
          <ImageGallery images={vehicle.images} title={vehicle.title} />
          
          <div>
            <h1 className="text-3xl font-bold">{vehicle.title}</h1>
            <p className="text-3xl text-primary-600 font-bold mt-2">
              {formatPrice(vehicle.price)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Year</p>
                <p className="font-medium">{vehicle.year}</p>
              </div>
              <div>
                <p className="text-gray-500">Mileage</p>
                <p className="font-medium">{vehicle.mileage.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-gray-500">Fuel Type</p>
                <p className="font-medium capitalize">{vehicle.fuelType}</p>
              </div>
              <div>
                <p className="text-gray-500">Transmission</p>
                <p className="font-medium capitalize">{vehicle.transmission}</p>
              </div>
              <div>
                <p className="text-gray-500">Make</p>
                <p className="font-medium">{vehicle.make}</p>
              </div>
              <div>
                <p className="text-gray-500">Model</p>
                <p className="font-medium">{vehicle.model}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700">{vehicle.description}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <SellerCard seller={vehicle.seller} />
          </div>
        </div>
      </div>

      <SimilarVehicles currentVehicle={vehicle} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/vehicles/\[id\]/page.tsx
git commit -m "feat: add vehicle details page with gallery, specs, and seller info"
```

---

## Task 12: Placeholder Pages

**Files:**
- Create: `app/about/page.tsx`
- Create: `app/sell/page.tsx`
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Create app/about/page.tsx**

```typescript
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">About GariHub</h1>
      
      <div className="prose max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          GariHub is Kenya&apos;s leading online vehicle marketplace, connecting buyers and sellers 
          across the country.
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-8">
          We aim to make buying and selling vehicles in Kenya simple, transparent, and secure. 
          Whether you&apos;re looking for a family car, a business truck, or a motorcycle, 
          GariHub has you covered.
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-8">
          <li>Wide selection of vehicles from trusted sellers</li>
          <li>Easy-to-use search and filter options</li>
          <li>Verified seller contacts</li>
          <li>Detailed vehicle information and photos</li>
          <li>Free to browse - no hidden fees</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="text-gray-700">
          Have questions? Reach out to us at info@garihubke.com or call +254 700 000 000
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create app/sell/page.tsx**

```typescript
import Link from 'next/link';

export default function SellPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Sell Your Vehicle</h1>
      <p className="text-xl text-gray-600 mb-8">
        Sell your vehicle on Kenya&apos;s leading marketplace
      </p>
      
      <div className="bg-primary-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon!</h2>
        <p className="text-gray-700">
          We&apos;re working on launching seller listings. Stay tuned!
        </p>
      </div>
      
      <p className="text-gray-600 mb-8">
        In the meantime, you can list your vehicle on other platforms or contact us directly.
      </p>
      
      <Link
        href="/contact"
        className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Contact Us
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Create app/contact/page.tsx**

```typescript
export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-6">
            Have questions about buying or selling? We&apos;re here to help!
          </p>
          
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-600">info@garihubke.com</p>
            </div>
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-gray-600">+254 700 000 000</p>
            </div>
            <div>
              <p className="font-semibold">Location</p>
              <p className="text-gray-600">Nairobi, Kenya</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-gray-700">
            Our contact form is under development. For now, please reach out via email or phone.
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx app/sell/page.tsx app/contact/page.tsx
git commit -m "feat: add placeholder pages for About, Sell, and Contact"
```

---

## Task 13: Build and Verify

- [ ] **Step 1: Run build**

Run: `npm run build`

Expected: Build completes without errors

- [ ] **Step 2: Start development server**

Run: `npm run dev`

- [ ] **Step 3: Verify all pages load**

- Homepage: http://localhost:3000
- Vehicles: http://localhost:3000/vehicles
- Vehicle Details: http://localhost:3000/vehicles/1
- About: http://localhost:3000/about
- Sell: http://localhost:3000/sell
- Contact: http://localhost:3000/contact

- [ ] **Step 4: Test functionality**

- [ ] Homepage loads with hero, featured vehicles, categories, CTA
- [ ] Clicking "View All" navigates to /vehicles
- [ ] Clicking category cards navigates to /vehicles?category=...
- [ ] Vehicles page shows all vehicles in grid
- [ ] Filters work (instant client-side)
- [ ] Sort dropdown works
- [ ] Search works
- [ ] Pagination works
- [ ] Clicking vehicle card navigates to details
- [ ] Details page shows gallery, specs, description, features, seller
- [ ] Lightbox opens on image click
- [ ] Similar vehicles section shows related vehicles
- [ ] Navigation works between all pages

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: complete Phase 1 - core vehicle browsing"
```

---

## Summary

Phase 1 implementation includes:

- ✅ Next.js 14 project with Tailwind CSS
- ✅ 20 mock vehicles across all categories
- ✅ Homepage with hero, featured vehicles, categories, CTA
- ✅ Listing page with filters, search, sort, pagination
- ✅ Vehicle details page with gallery, lightbox, specs, seller
- ✅ Similar vehicles section
- ✅ Favorites with localStorage
- ✅ About, Sell, Contact placeholder pages
- ✅ Responsive design for mobile/tablet/desktop
- ✅ Dark theme with primary color accents

**Next Steps (Phase 2):**
- User authentication (signup/login)
- Advanced search functionality
- User dashboard
- Contact form integration
- Image upload for sellers
