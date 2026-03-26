# Phase 10: Insurance Calculator Specification

## Overview

Add insurance calculator to vehicle detail pages with full cost breakdown and partner leads.

---

## 1. Features

### Insurance Calculation
- **Comprehensive Premium** - Based on vehicle value, year, type
- **Third Party Premium** - Basic coverage cost
- **Road Tax** - Based on engine size, vehicle type
- **Registration Fee** - Fixed + processing fees
- **Total Estimated Cost** - Sum of all

### Partner Integration
- Show insurer partner logos
- "Get Quote" buttons for each partner
- Lead generation form

### UI Integration
- On vehicle detail page (`/vehicles/[id]`)
- Auto-fill from vehicle data
- Allow manual override of values

---

## 2. Data

### Insurer Partners (static)
```typescript
const insurers = [
  { id: 'jubi', name: 'Jubilee Insurance', logo: '/images/jubilee.png' },
  { id: 'aig', name: 'AIG Kenya', logo: '/images/aig.png' },
  { id: 'old', name: 'Old Mutual', logo: '/images/oldmutual.png' },
  { id: 'biz', name: 'Bizcover', logo: '/images/bizcover.png' },
];
```

### Calculation Rates
- Comprehensive: 3-5% of vehicle value annually
- Third Party: KES 15,000-35,000 based on vehicle type
- Road Tax: Based on engine cc bands
- Registration: KES 2,500 base + processing

---

## 3. Acceptance Criteria

- [ ] InsuranceCalculator component created
- [ ] Shows on vehicle detail page
- [ ] Auto-fills vehicle data
- [ ] Calculates premium, road tax, registration
- [ ] Shows Comprehensive vs Third Party
- [ ] Displays partner logos with CTA
- [ ] Build passes with no errors
