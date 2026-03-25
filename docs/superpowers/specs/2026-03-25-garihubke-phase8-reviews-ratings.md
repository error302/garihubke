# Phase 8: Reviews & Ratings Specification

## Overview

Add seller and vehicle ratings to build trust in the GariHub marketplace.

---

## 1. Data Models

### Review Enum
```typescript
enum ReviewTargetType {
  SELLER = 'seller',
  VEHICLE = 'vehicle'
}
```

### Review Model (Prisma)
```prisma
model Review {
  id          String   @id @default(cuid())
  userId      String
  targetType  ReviewTargetType
  targetId    String
  rating      Int      // 1-5
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id])

  @@unique([userId, targetType, targetId]) // One review per user per target
}
```

---

## 2. API Routes

### POST /api/reviews
- Create a new review
- Body: `{ targetType, targetId, rating }`
- Validation: Must be authenticated, cannot review self, cannot review same target twice

### GET /api/reviews?sellerId=xxx
- Get reviews for a seller

### GET /api/reviews?vehicleId=xxx
- Get reviews for a vehicle

### DELETE /api/reviews/[id]
- Delete own review

---

## 3. Components

### StarRating.tsx
- Props: `rating: number`, `readonly?: boolean`, `onChange?: (rating) => void`
- Display: 5 stars, filled based on rating
- Interactive: Click to set rating (if not readonly)

### SellerReviews.tsx
- Display seller's average rating
- Show review count
- List of recent reviews

### VehicleReviews.tsx
- Display vehicle's average rating
- Show review count
- List of recent reviews

### WriteReviewModal.tsx
- Modal for submitting a review
- Star rating selector
- Submit button

---

## 4. Pages & Integration

### Seller Profile Page (/dealers/[id])
- Add average rating display near dealer name
- Add "Write Review" button
- Show review list

### Vehicle Detail Page (/vehicles/[id])
- Add vehicle rating display
- Add "Write Review" button
- Show review list

### Dashboard (/dashboard)
- Add "My Reviews" section
- Show reviews user has given

---

## 5. Acceptance Criteria

- [ ] Review model added to Prisma schema
- [ ] API routes for CRUD operations
- [ ] StarRating component (display + interactive)
- [ ] Seller reviews on dealer page
- [ ] Vehicle reviews on detail page
- [ ] Users can view their given reviews
- [ ] Only authenticated users can review
- [ ] One review per user per target
- [ ] Cannot review self
- [ ] Build passes with no errors
