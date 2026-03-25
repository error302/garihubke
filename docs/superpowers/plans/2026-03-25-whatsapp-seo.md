# Phase 7: WhatsApp Integration & SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add WhatsApp floating button for customer support and SEO improvements including public calculator and sitemap.

**Architecture:** Create a global WhatsApp floating button component, add public calculator page, and implement dynamic sitemap/robots.txt for SEO.

**Tech Stack:** Next.js App Router, TypeScript, CSS animations

---

## Task 1: WhatsApp Floating Button

**Files:**
- Create: `components/WhatsAppButton.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create WhatsApp button component**

```tsx
'use client';

import { useState, useEffect } from 'react';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+254700123456';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClick = () => {
    const message = encodeURIComponent('Hi! I\'m interested in vehicles on GariHub. Can you help me?');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
      aria-label="Contact us on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </button>
  );
}
```

- [ ] **Step 2: Add to root layout**

Modify `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import WhatsAppButton from "@/components/WhatsAppButton";

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
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Add NEXT_PUBLIC_WHATSAPP_NUMBER to .env.example**

Add to `.env.example`:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=+254700123456
```

- [ ] **Step 4: Commit**

```bash
git add components/WhatsAppButton.tsx app/layout.tsx .env.example
git commit -m "feat: add WhatsApp floating button"
```

---

## Task 2: Public Calculator Page

**Files:**
- Create: `app/calculator/page.tsx`
- Modify: `app/page.tsx` (add link to calculator)

- [ ] **Step 1: Create public calculator page**

```tsx
import Link from 'next/link';
import { KENYA_COUNTIES } from '@/lib/kenya-regions';

export const metadata = {
  title: 'Import Calculator - Estimate Vehicle Import Costs | GariHub',
  description: 'Calculate import duties, taxes, and total costs for importing a vehicle to Kenya. Get a free broker quote.',
};

export default function CalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Vehicle Import Calculator</h1>
        <p className="text-gray-600">
          Estimate import duties, taxes, and total costs for your vehicle
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Value (USD)
            </label>
            <input
              type="number"
              placeholder="e.g. 15000"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year of Manufacture
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">Select year</option>
              {Array.from({ length: 30 }, (_, i) => (
                <option key={i} value={2026 - i}>
                  {2026 - i}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="saloon">Saloon Car</option>
              <option value="suv">SUV / 4x4</option>
              <option value="pickup">Pickup Truck</option>
              <option value="van">Van / Minibus</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="truck">Truck / Lorry</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port of Entry
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="mombasa">Mombasa Port</option>
              <option value="nakuru">Nakuru ICD</option>
              <option value="nairobi">Nairobi ICD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery County
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">Select county</option>
              {KENYA_COUNTIES.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Engine Capacity (cc)
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="1500">Below 1500cc</option>
              <option value="1800">1500 - 2000cc</option>
              <option value="2500">2000 - 3000cc</option>
              <option value="3500">3000 - 4000cc</option>
              <option value="4000">Above 4000cc</option>
            </select>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Get accurate estimates - create a free account
          </p>
          <Link
            href="/register"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Save & Get Broker Quote
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-bold">1</span>
            </div>
            <h3 className="font-medium mb-2">Enter Vehicle Details</h3>
            <p className="text-sm text-gray-600">Input value, year, and vehicle type</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-bold">2</span>
            </div>
            <h3 className="font-medium mb-2">Calculate Duties</h3>
            <p className="text-sm text-gray-600">We estimate taxes and fees</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-bold">3</span>
            </div>
            <h3 className="font-medium mb-2">Get Quote</h3>
            <p className="text-sm text-gray-600">Get a detailed breakdown</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add link to homepage**

Modify `app/page.tsx` to add a link to the calculator (find a good spot in the hero or features section):

Add this button/link in the hero section:
```tsx
<Link href="/calculator" className="...">
  Calculate Import Costs
</Link>
```

- [ ] **Step 3: Commit**

```bash
git add app/calculator/page.tsx app/page.tsx
git commit -m "feat: add public calculator page"
```

---

## Task 3: Dynamic Sitemap

**Files:**
- Create: `app/sitemap.ts`

- [ ] **Step 1: Create sitemap.ts**

```tsx
import { MetadataRoute } from 'next';
import { vehicles } from '@/data/vehicles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://garihub.co.ke';

  const staticPages = [
    '',
    '/vehicles',
    '/vehicles/map',
    '/dealers',
    '/calculator',
    '/pricing',
    '/about',
    '/contact',
    '/login',
    '/register',
    '/sell',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  const vehiclePages = vehicles.map((vehicle) => ({
    url: `${baseUrl}/vehicles/${vehicle.id}`,
    lastModified: new Date(vehicle.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const dealerIds = Array.from(new Set(vehicles.map(v => v.seller.name))).slice(0, 10);
  const dealerPages = dealerIds.map((name) => ({
    url: `${baseUrl}/dealers/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...vehiclePages, ...dealerPages];
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: add dynamic sitemap"
```

---

## Task 4: Robots.txt

**Files:**
- Create: `app/robots.ts`

- [ ] **Step 1: Create robots.ts**

```tsx
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://garihub.co.ke';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/robots.ts
git commit -m "feat: add robots.txt"
```

---

## Task 5: Dynamic Metadata for Vehicle Pages

**Files:**
- Modify: `app/vehicles/[id]/page.tsx`

- [ ] **Step 1: Add generateMetadata to vehicle page**

Modify `app/vehicles/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { vehicles } from '@/data/vehicles';
// ... existing imports

interface VehiclePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found - GariHub',
    };
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} for sale in ${vehicle.seller.city || vehicle.seller.county || 'Kenya'}`;
  const description = `${vehicle.title} - KES ${vehicle.price.toLocaleString()}. ${vehicle.year} ${vehicle.make} ${vehicle.model} with ${vehicle.mileage.toLocaleString()} km. ${vehicle.description.slice(0, 150)}...`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: vehicle.images[0] ? [{ url: vehicle.images[0] }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: vehicle.images[0] ? [vehicle.images[0]] : [],
    },
  };
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  // ... existing code
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/vehicles/[id]/page.tsx"
git commit -m "feat: add dynamic metadata for vehicle pages"
```

---

## Task 6: Build and Verify

- [ ] **Step 1: Run build**

```bash
npm run build
```

- [ ] **Step 2: Test sitemap**

```bash
curl http://localhost:3000/sitemap.xml
```

- [ ] **Step 3: Test robots.txt**

```bash
curl http://localhost:3000/robots.txt
```

- [ ] **Step 4: Verify calculator page**

```bash
curl http://localhost:3000/calculator
```

- [ ] **Step 5: Commit final changes**

```bash
git add .
git commit -m "feat: complete Phase 7 - WhatsApp integration and SEO"
```

---

## Task 7: Push to GitHub

- [ ] **Step 1: Push to remote**

```bash
git push origin main
```
