# Phase 5C: Mobile App Specification

## Overview

Build a React Native mobile app (Expo) that shares the existing Next.js API backend, providing vehicle listings, search, import calculator, messaging, and sell features on iOS and Android.

---

## Architecture

### Monorepo Structure
```
/garihubke
  /apps
    /mobile          # React Native Expo app (NEW)
  /app               # Next.js web app (existing)
  /components        # Shared components
  /lib               # Shared utilities
  /prisma            # Database schema
```

### API Integration
- Mobile app uses REST API endpoints already built in `/app/api/`
- Shares authentication with web app (JWT tokens)
- Same database and business logic

---

## Features

### 1. Vehicle Listings & Search
- Home screen with featured/recent vehicles
- Search with filters (make, model, price, year, fuel type)
- Vehicle detail page with images, specs, seller info
- Map view with vehicle markers (Leaflet or react-native-maps)
- Save favorites

### 2. User Account
- Login/Register screens
- Profile management
- View saved searches
- View favorites

### 3. Import Calculator
- Form inputs: make, model, year, engine CC, fuel type, CIF price
- Calculate import duty using existing API or replicate logic
- Show breakdown: customs value, duty, excise, VAT, IDF, RDL, port fees, total

### 4. Messaging
- Contact seller form
- View sent messages
- Notification support

### 5. Sell a Car
- Multi-step form to list vehicle
- Image upload support
- Preview before submit

---

## Screen Flow

```
App
├── Splash Screen
├── Auth Stack
│   ├── Login
│   └── Register
└── Main Stack (Tab Navigation)
    ├── Home (Listings)
    │   ├── Vehicle Detail
    │   ├── Map View
    │   └── Search Filters
    ├── Calculator
    ├── Sell
    │   └── Listing Form
    └── Profile
        ├── Favorites
        ├── Saved Searches
        ├── Messages
        └── Settings
```

---

## Technical Implementation

### Dependencies
```json
{
  "expo": "~52.0.0",
  "react-native": "0.76.6",
  "@react-navigation/native": "^7.0.0",
  "@react-navigation/bottom-tabs": "^7.0.0",
  "@react-navigation/native-stack": "^7.0.0",
  "expo-router": "~4.0.0",
  "axios": "^1.6.0",
  "@react-native-async-storage/async-storage": "1.23.1",
  "expo-image-picker": "~16.0.0",
  "react-native-maps": "1.18.0"
}
```

### API Endpoints Used
| Endpoint | Purpose |
|----------|---------|
| GET /api/listings | Get all vehicles |
| GET /api/listings/[id] | Get vehicle details |
| POST /api/listings | Create listing |
| GET /api/favorites | Get user favorites |
| POST /api/favorites | Add favorite |
| GET /api/messages | Get user messages |
| POST /api/messages | Send message |
| POST /api/register | User registration |
| POST /api/auth/... | Authentication |

### State Management
- React Context for auth state
- React Query (or SWR) for API data fetching
- AsyncStorage for persisting auth tokens

---

## Component Structure

```
/mobile
  /app
    /_layout.tsx          # Root layout
    /(auth)/_layout.tsx   # Auth stack
    /(auth)/login.tsx
    /(auth)/register.tsx
    /(tabs)/_layout.tsx   # Tab navigator
    /(tabs)/index.tsx     # Home/Listings
    /(tabs)/calculator.tsx
    /(tabs)/sell.tsx
    /(tabs)/profile.tsx
    /vehicle/[id].tsx     # Vehicle detail
    /search.tsx           # Search results
  /components
    /VehicleCard.tsx
    /FilterModal.tsx
    /MapView.tsx
    /CalculatorForm.tsx
    /ListingForm.tsx
  /services
    /api.ts               # Axios instance
    /auth.ts              # Auth helpers
  /hooks
    /useAuth.ts
    /useVehicles.ts
  /types
    /index.ts             # TypeScript types
```

---

## Data Models (from web)

The mobile app reuses types from the web app:
```typescript
interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuelType: string;
  transmission: string;
  description: string;
  images: string[];
  seller: {
    name: string;
    phone: string;
    location: string;
    county?: string;
  };
}

interface User {
  id: string;
  email: string;
  name?: string;
}
```

---

## Acceptance Criteria

1. ✅ App builds successfully for iOS and Android
2. ✅ User can browse vehicle listings
3. ✅ User can search and filter vehicles
4. ✅ User can view vehicle details
5. ✅ User can login/register
6. ✅ User can save favorites
7. ✅ User can use import calculator
8. ✅ User can post a vehicle for sale
9. ✅ User can contact sellers
10. ✅ Map shows vehicle locations
