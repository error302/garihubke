# Phase 9: Advanced Search Filters Specification

## Overview

Enhance vehicle search with additional filters, sorting, and better UX.

---

## 1. New Filter Options

### Engine Size
- Below 1500cc
- 1500 - 2000cc
- 2000 - 3000cc
- 3000 - 4000cc
- Above 4000cc

### Color
- White, Black, Silver, Blue, Red, Green, Yellow, Brown, Other

### Body Type
- Sedan, SUV, Hatchback, Coupe, Wagon, Pickup, Van, Truck, Bus

---

## 2. UI Enhancements

### Price Range Slider
- Dual-handle slider
- Min/max inputs alongside
- Real-time filtering

### Sorting Options
- Newest first (default)
- Price: Low to High
- Price: High to Low
- Mileage: Low to High
- Mileage: High to Low

### Clear All Filters
- Single button to reset all filters
- Clear URL params as well

---

## 3. Data Model

Add to filter state:
```typescript
interface Filters {
  // existing...
  engineSize: string;
  color: string;
  bodyType: string;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'mileage_asc' | 'mileage_desc';
}
```

---

## 4. Acceptance Criteria

- [ ] Add engine size filter dropdown
- [ ] Add color filter dropdown  
- [ ] Add body type filter dropdown
- [ ] Add price range slider component
- [ ] Add sorting dropdown
- [ ] Add "Clear All Filters" button
- [ ] URL params reflect all filters
- [ ] Filters work on vehicles page
- [ ] Build passes with no errors
