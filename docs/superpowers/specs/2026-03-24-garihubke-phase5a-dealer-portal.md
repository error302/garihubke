# GariHub Phase 5A: Dealer Portal

## Overview

Phase 5A adds dealer portal functionality enabling car dealerships to bulk manage listings, manage team members, customize their profile, and access API integration tools.

## Goals

1. Enable dealerships to efficiently manage vehicle inventory at scale
2. Provide branding and team management capabilities
3. Offer API access for inventory sync and integration
4. Create a foundation for regional expansion

## Tech Stack

- **API**: Next.js App Router with REST endpoints
- **Auth**: Extended NextAuth with dealer roles
- **Database**: Prisma with dealer-specific models
- **File Processing**: CSV parsing for bulk upload

## Data Model

```prisma
model Dealer {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  name          String
  logo          String?
  description   String?
  phone         String?
  email         String?
  website       String?
  address       String?
  city          String?
  region        String?
  country       String @default("Kenya")
  isVerified    Boolean @default(false)
  verifiedAt    DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  members       DealerMember[]
  inventory     DealerInventory[]
  apiAccess     DealerApiAccess[]
}

enum DealerRole {
  ADMIN
  MANAGER
  STAFF
}

model DealerMember {
  id        String   @id @default(cuid())
  dealerId  String
  dealer    Dealer   @relation(fields: [dealerId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  role      String   @default("STAFF")
  createdAt DateTime @default(now())
}

model DealerInventory {
  id          String   @id @default(cuid())
  dealerId    String
  dealer      Dealer   @relation(fields: [dealerId], references: [id])
  listingId   String
  listing     Listing  @relation(fields: [listingId], references: [id])
  costPrice   Int?
  stockStatus String @default("available")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model DealerApiAccess {
  id          String   @id @default(cuid())
  dealerId    String
  dealer      Dealer   @relation(fields: [dealerId], references: [id])
  apiKey      String   @unique
  name        String
  lastUsedAt  DateTime?
  isActive    Boolean @default(true)
  createdAt   DateTime @default(now())
}
```

## Pages

### 1. Dealer Dashboard (`/dashboard/dealer`)
- Overview stats (total listings, views, inquiries)
- Quick actions (add listing, upload CSV, manage team)
- Recent activity feed
- Inventory summary

### 2. Bulk Upload (`/dashboard/dealer/upload`)
- CSV template download
- Drag-and-drop upload
- Preview and validation
- Progress tracking
- Error reporting

### 3. Team Management (`/dashboard/dealer/team`)
- Invite members
- Assign roles (admin, manager, staff)
- Remove members
- Activity log

### 4. Dealer Profile (`/dashboard/dealer/profile`)
- Company information
- Logo upload
- Contact details
- Description/bio
- Location settings

### 5. API Access (`/dashboard/dealer/api`)
- Generate API keys
- View API documentation
- Webhook configuration
- Usage statistics

### 6. Public Dealer Page (`/dealers/[id]`)
- Dealer profile display
- All dealer listings
- Contact information
- Verified badge (if applicable)

## Components

- `DealerCard` - Public dealer preview
- `InventoryTable` - Bulk listing management
- `UploadZone` - Drag-and-drop CSV upload
- `TeamMemberRow` - Team member display
- `ApiKeyManager` - API key CRUD
- `DealerStats` - Dashboard statistics

## API Endpoints

### Dealer Management
- `POST /api/dealers` - Register as dealer
- `GET /api/dealers/:id` - Get dealer info
- `PUT /api/dealers/:id` - Update dealer info

### Team Management
- `POST /api/dealers/:id/members` - Invite member
- `DELETE /api/dealers/:id/members/:memberId` - Remove member
- `PUT /api/dealers/:id/members/:memberId` - Update role

### Inventory Management
- `POST /api/dealers/:id/inventory` - Add to inventory
- `GET /api/dealers/:id/inventory` - List inventory
- `DELETE /api/dealers/:id/inventory/:listingId` - Remove from inventory

### Bulk Operations
- `POST /api/dealers/:id/bulk-upload` - Upload CSV
- `GET /api/dealers/:id/export` - Export inventory

### API Access
- `POST /api/dealers/:id/api-keys` - Generate API key
- `DELETE /api/dealers/:id/api-keys/:keyId` - Revoke key
- `GET /api/dealers/:id/webhooks` - List webhooks
- `POST /api/dealers/:id/webhooks` - Create webhook

## CSV Upload Format

```csv
title,make,model,year,price,mileage,fuelType,transmission,description,features,images,sellerName,sellerPhone,sellerLocation
"Toyota Prado 2020","Toyota","Prado",2020,8500000,45000,"diesel","automatic","Excellent condition","Leather, Camera","img1.jpg,img2.jpg","Auto Dealer","+254700123456","Nairobi"
```

## Acceptance Criteria

1. ✅ Users can register as dealers
2. ✅ Dealer dashboard shows stats and quick actions
3. ✅ CSV upload creates multiple listings
4. ✅ Team members can be invited and managed
5. ✅ Dealer profile is editable
6. ✅ API keys can be generated and revoked
7. ✅ Public dealer page displays all listings
8. ✅ Bulk operations work correctly
9. ✅ Webhook notifications are sent
10. ✅ All pages are responsive