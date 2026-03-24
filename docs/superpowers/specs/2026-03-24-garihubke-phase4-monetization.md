# GariHub Phase 4: Monetization & Advertising

## Overview

Phase 4 adds monetization features to enable revenue generation through listing fees, premium subscriptions, and advertising.

## Goals

1. Enable revenue generation through freemium model
2. Provide premium features for sellers wanting more visibility
3. Add advertising platform for third-party ads

## Tech Stack

- **Payments**: Stripe (Kenya-supported via M-Pesa later)
- **State**: Next.js App Router with server actions
- **Database**: Prisma (existing schema extends)

## Freemium Model

### Basic Listing (Free)
- 30-day listing duration
- Up to 10 photos
- Basic search visibility
- Standard placement in listings

### Premium Features

| Feature | Price | Description |
|---------|-------|-------------|
| Featured Listing | KSh 500/week | Top of search results |
| Verified Seller | KSh 1000/month | Badge on all listings |
| Premium Placement | KSh 300/week | Top of category page |
| Extended Duration | KSh 800 | 90-day listing |

### Subscription Packages

**Basic (Free)**
- 1 active listing
- Basic placement

**Pro (KSh 2500/month)**
- 5 active listings
- Featured placement
- Verified badge

**Business (KSh 5000/month)**
- Unlimited listings
- Premium placement
- Verified badge
- Analytics access

## Advertising

### Ad Types

1. **Banner Ads**
   - Homepage hero below
   - Category page headers
   - Size: 728x90 or 468x60

2. **Sidebar Ads**
   - Listing page right sidebar
   - Size: 300x250
   - Max 3 per page

### Pricing

- **CPC**: KSh 50 per click
- **CPM**: KSh 200 per 1000 impressions
- **Monthly minimum**: KSh 5000

## Data Model

```typescript
enum SubscriptionTier {
  BASIC = 'basic'
  PRO = 'pro'
  BUSINESS = 'business'
}

enum PremiumFeature {
  FEATURED = 'featured'
  VERIFIED = 'verified'
  PREMIUM_PLACEMENT = 'premium_placement'
  EXTENDED_DURATION = 'extended_duration'
}

enum AdPosition {
  HOMEPAGE_BANNER = 'homepage_banner'
  CATEGORY_BANNER = 'category_banner'
  LISTING_SIDEBAR = 'listing_sidebar'
}

model Subscription {
  id        String   @id @default(cuid())
  userId    String
  tier      SubscriptionTier
  startDate DateTime
  endDate   DateTime
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}

model PremiumListing {
  id        String   @id @default(cuid())
  listingId String
  feature   PremiumFeature
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model AdCampaign {
  id          String   @id @default(cuid())
  advertiser  String
  position    AdPosition
  imageUrl    String
  clickUrl    String
  budget      Int
  clicks      Int      @default(0)
  impressions Int      @default(0)
  isActive    Boolean  @default(true)
  startDate   DateTime
  endDate     DateTime
}
```

## Pages

### 1. Seller Dashboard - Subscription (`/dashboard/subscription`)
- Current plan display
- Upgrade/downgrade options
- Payment history

### 2. Ad Management (`/dashboard/ads`)
- Create new campaign
- View active campaigns
- Performance metrics (clicks, impressions)
- Budget management

### 3. Pricing Page (`/pricing`)
- Package comparison table
- Feature list per tier
- CTA buttons to subscribe

### 4. Ad Creation Page (`/dashboard/ads/new`)
- Ad position selection
- Image upload
- Budget setting
- Preview

## Components

- `PricingCard` - Display subscription tier
- `SubscriptionButton` - Handle upgrade flow
- `AdBanner` - Display banner ads
- `AdSidebar` - Display sidebar ads
- `CampaignStats` - Show ad performance
- `AdCreator` - Multi-step ad creation wizard

## Acceptance Criteria

1. ✅ Pricing page shows all subscription tiers
2. ✅ Users can upgrade subscription
3. ✅ Premium features apply to listings
4. ✅ Banner ads display on homepage
5. ✅ Sidebar ads display on listing page
6. ✅ Ad performance tracked (clicks, impressions)
7. ✅ Seller can manage ad campaigns
8. ✅ Payment integration ready (Stripe)
9. ✅ Dashboard shows subscription status