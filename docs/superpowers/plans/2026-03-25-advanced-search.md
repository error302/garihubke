# Phase 9: Advanced Search Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add advanced filters (engine size, color, body type), price slider, sorting, and clear filters button.

**Architecture:** Extend existing FilterSidebar component with new filter options, add sorting dropdown, implement price range slider.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS

---

## Task 1: Update Types and Vehicle Data

**Files:**
- Modify: `types/index.ts`
- Modify: `data/vehicles.ts`

- [ ] **Step 1: Add new fields to Vehicle type**

```typescript
// Add to types/index.ts
export type BodyType = 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'wagon' | 'pickup' | 'van' | 'truck' | 'bus';
export type EngineSize = 'below_1500' | '1500_2000' | '2000_3000' | '3000_4000' | 'above_4000';
export type Color = 'white' | 'black' | 'silver' | 'blue' | 'red' | 'green' | 'yellow' | 'brown' | 'other';

export interface Vehicle {
  // ... existing
  bodyType?: BodyType;
  color?: Color;
  engineSize?: number; // actual cc
}
```

- [ ] **Step 2: Update vehicle data with new fields**

Add bodyType, color, engineSize to sample vehicles in data/vehicles.ts

- [ ] **Step 3: Commit**

```bash
git add types/index.ts data/vehicles.ts
git commit -m "feat: add bodyType, color, engineSize to Vehicle type"
```

---

## Task 2: Extend FilterSidebar with New Filters

**Files:**
- Modify: `components/FilterSidebar.tsx`

- [ ] **Step 1: Add new filter options**

Add these constants:
```typescript
const bodyTypes = [
  { value: '', label: 'All Body Types' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'wagon', label: 'Wagon' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'van', label: 'Van' },
  { value: 'truck', label: 'Truck' },
  { value: 'bus', label: 'Bus' },
];

const colors = [
  { value: '', label: 'All Colors' },
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'silver', label: 'Silver' },
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'brown', label: 'Brown' },
  { value: 'other', label: 'Other' },
];

const engineSizes = [
  { value: '', label: 'Any Engine' },
  { value: 'below_1500', label: 'Below 1500cc' },
  { value: '1500_2000', label: '1500 - 2000cc' },
  { value: '2000_3000', label: '2000 - 3000cc' },
  { value: '3000_4000', label: '3000 - 4000cc' },
  { value: 'above_4000', label: 'Above 4000cc' },
];
```

- [ ] **Step 2: Add filter state to props interface**

```typescript
interface FilterSidebarProps {
  filters: {
    // ... existing
    bodyType: string;
    color: string;
    engineSize: string;
    sortBy: string;
  };
  onFilterChange: (filters: FilterSidebarProps['filters']) => void;
}
```

- [ ] **Step 3: Add filter UI elements**

Add three new select dropdowns in the filter form for bodyType, color, engineSize

- [ ] **Step 4: Commit**

```bash
git add components/FilterSidebar.tsx
git commit -m "feat: add engine size, color, body type filters"
```

---

## Task 3: Add Price Range Slider

**Files:**
- Create: `components/PriceRangeSlider.tsx`
- Modify: `components/FilterSidebar.tsx`

- [ ] **Step 1: Create PriceRangeSlider component**

```tsx
'use client';

import { useState, useEffect } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localValue[1] - 100000);
    setLocalValue([newMin, localValue[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localValue[0] + 100000);
    setLocalValue([localValue[0], newMax]);
  };

  const handleMouseUp = () => {
    onChange(localValue);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={localValue[0]}
          onChange={handleMinChange}
          onMouseUp={handleMouseUp}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="Min"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          value={localValue[1]}
          onChange={handleMaxChange}
          onMouseUp={handleMouseUp}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="Max"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={localValue[0]}
        onChange={handleMinChange}
        onMouseUp={handleMouseUp}
        className="w-full"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={localValue[1]}
        onChange={handleMaxChange}
        onMouseUp={handleMouseUp}
        className="w-full"
      />
    </div>
  );
}
```

- [ ] **Step 2: Integrate slider into FilterSidebar**

Replace minPrice/maxPrice inputs with PriceRangeSlider component

- [ ] **Step 3: Commit**

```bash
git add components/PriceRangeSlider.tsx components/FilterSidebar.tsx
git commit -m "feat: add price range slider"
```

---

## Task 4: Add Sorting and Clear Filters

**Files:**
- Modify: `components/FilterSidebar.tsx`
- Modify: `app/vehicles/page.tsx`

- [ ] **Step 1: Add sorting dropdown**

```typescript
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'mileage_asc', label: 'Mileage: Low to High' },
  { value: 'mileage_desc', label: 'Mileage: High to Low' },
];
```

Add select dropdown for sorting in FilterSidebar

- [ ] **Step 2: Add Clear All button**

```typescript
const handleClearAll = () => {
  const clearedFilters = {
    category: '',
    make: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    yearMin: '',
    yearMax: '',
    minMileage: '',
    maxMileage: '',
    seats: '',
    fuelType: [],
    transmission: [],
    region: '',
    city: '',
    bodyType: '',
    color: '',
    engineSize: '',
    sortBy: 'newest',
  };
  onFilterChange(clearedFilters);
};
```

Add button at top or bottom of filters

- [ ] **Step 3: Commit**

```bash
git add components/FilterSidebar.tsx
git commit -m "feat: add sorting and clear filters"
```

---

## Task 5: Update Vehicles Page with Sorting

**Files:**
- Modify: `app/vehicles/page.tsx`

- [ ] **Step 1: Implement sorting logic**

Add sorting function that sorts vehicles array based on sortBy param

- [ ] **Step 2: Commit**

```bash
git add app/vehicles/page.tsx
git commit -m "feat: implement vehicle sorting"
```

---

## Task 6: Build and Verify

- [ ] **Step 1: Run build**

```bash
npm run build
```

- [ ] **Step 2: Commit remaining changes**

```bash
git add .
git commit -m "feat: complete Phase 9 - Advanced Search Filters"
```

---

## Task 7: Push to GitHub

- [ ] **Step 1: Push to remote**

```bash
git push origin main
```
