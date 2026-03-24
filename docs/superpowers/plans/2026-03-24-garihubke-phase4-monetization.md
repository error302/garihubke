# GariHub Phase 4: Monetization & Advertising Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add monetization features - freemium subscriptions, premium listings, and advertising platform.

**Architecture:** Next.js App Router with Prisma, Stripe for payments, React for UI.

**Tech Stack:** Next.js 14, Prisma, Stripe, TypeScript, Tailwind CSS

---

## File Structure

```
garihubke/
├── app/
│   ├── api/
│   │   ├── subscriptions/
│   │   │   └── route.ts         # Subscription CRUD
│   │   ├── payments/
│   │   │   └── route.ts         # Payment processing
│   │   ├── ads/
│   │   │   └── route.ts         # Ad CRUD
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts     # Stripe webhooks
│   └── dashboard/
│       ├── subscription/
│       │   └── page.tsx         # Subscription management
│       ├── ads/
│       │   ├── page.tsx         # Ads list
│       │   └── new/
│       │       └── page.tsx     # Create ad
│       └── premium/
│           └── page.tsx         # Premium listings
├── components/
│   ├── PricingCard.tsx          # Subscription tier display
│   ├── AdBanner.tsx             # Banner ad component
│   ├── AdSidebar.tsx            # Sidebar ad component
│   ├── CampaignStats.tsx        # Ad performance stats
│   └── PremiumBadge.tsx         # Verified/premium badges
├── prisma/
│   └── schema.prisma            # Add Subscription, Payment, AdCampaign models
└── lib/
    └── stripe.ts                # Stripe client setup
```

---

## Task 1: Prisma Schema Updates

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add new enums and models to schema.prisma**

```prisma
// Add these enums
enum SubscriptionTier {
  BASIC
  PRO
  BUSINESS
}

enum SubscriptionStatus {
  PENDING
  ACTIVE
  EXPIRED
  CANCELLED
}

enum PremiumFeature {
  FEATURED
  VERIFIED
  PREMIUM_PLACEMENT
  EXTENDED_DURATION
}

enum AdPosition {
  HOMEPAGE_BANNER
  CATEGORY_BANNER
  LISTING_SIDEBAR
}

// Add these models
model Subscription {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  tier      SubscriptionTier
  status    SubscriptionStatus @default(PENDING)
  startDate DateTime
  endDate   DateTime
  createdAt DateTime @default(now())
}

model Payment {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id])
  subscriptionId String?
  amount         Int
  currency       String   @default("KES")
  stripePaymentId String
  status         String
  createdAt      DateTime @default(now())
}

model PremiumListing {
  id        String         @id @default(cuid())
  userId    String
  listingId String
  listing   Listing        @relation(fields: [listingId], references: [id])
  feature   PremiumFeature
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model AdCampaign {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  position    AdPosition
  imageUrl    String
  clickUrl    String
  budget      Int
  costPerClick Int    @default(50)
  clicks      Int      @default(0)
  impressions Int      @default(0)
  isActive    Boolean  @default(true)
  startDate   DateTime
  endDate     DateTime
}
```

- [ ] **Step 2: Run Prisma migration**

Run: `npx prisma migrate dev --name add_monetization`

Expected: Migration created successfully

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add monetization models to Prisma schema"
```

---

## Task 2: Stripe Integration Setup

**Files:**
- Create: `lib/stripe.ts`
- Create: `.env.example`

- [ ] **Step 1: Create lib/stripe.ts**

```typescript
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

// Pricing configuration (in KSh)
export const PRICES = {
  PRO_MONTHLY: 250000, // KSh 2,500 in cents
  BUSINESS_MONTHLY: 500000, // KSh 5,000 in cents
};

export const PRICE_IDS = {
  PRO: process.env.STRIPE_PRO_PRICE_ID || '',
  BUSINESS: process.env.STRIPE_BUSINESS_PRICE_ID || '',
};
```

- [ ] **Step 2: Create .env.example**

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] **Step 3: Commit**

```bash
git add lib/stripe.ts .env.example
git commit -m "feat: add Stripe integration setup"
```

---

## Task 3: Subscription API

**Files:**
- Create: `app/api/subscriptions/route.ts`

- [ ] **Step 1: Create app/api/subscriptions/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_IDS } from '@/lib/stripe';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tier } = await req.json();

  let priceId: string;
  switch (tier) {
    case 'PRO':
      priceId = PRICE_IDS.PRO;
      break;
    case 'BUSINESS':
      priceId = PRICE_IDS.BUSINESS;
      break;
    default:
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?canceled=true`,
      metadata: { userId: session.user.id, tier },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/subscriptions/route.ts
git commit -m "feat: add subscription creation API"
```

---

## Task 4: Stripe Webhooks

**Files:**
- Create: `app/api/webhooks/stripe/route.ts`

- [ ] **Step 1: Create app/api/webhooks/stripe/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Create subscription in database
      // TODO: Implement database save
      console.log('Checkout completed:', session.id);
      break;

    case 'invoice.payment_succeeded':
      // Update subscription status
      break;

    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      break;
  }

  return NextResponse.json({ received: true });
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/webhooks/stripe/route.ts
git commit -m "feat: add Stripe webhook handler"
```

---

## Task 5: Pricing Page

**Files:**
- Create: `app/pricing/page.tsx`
- Create: `components/PricingCard.tsx`

- [ ] **Step 1: Create components/PricingCard.tsx**

```typescript
'use client';

interface PricingCardProps {
  tier: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
  isLoading?: boolean;
}

export default function PricingCard({
  tier,
  price,
  features,
  isPopular,
  onSelect,
  isLoading,
}: PricingCardProps) {
  return (
    <div
      className={`relative bg-white rounded-lg shadow-md p-8 ${
        isPopular ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold mb-2">{tier}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">
          {price === 0 ? 'Free' : `KSh ${price.toLocaleString()}`}
        </span>
        {price > 0 && <span className="text-gray-500">/month</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          isPopular
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        {isLoading ? 'Loading...' : price === 0 ? 'Current Plan' : 'Get Started'}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create app/pricing/page.tsx**

```typescript
'use client';

import { useState } from 'react';
import PricingCard from '@/components/PricingCard';

const plans = [
  {
    tier: 'Basic',
    price: 0,
    features: ['1 active listing', '30-day duration', 'Basic search visibility'],
  },
  {
    tier: 'Pro',
    price: 2500,
    features: ['5 active listings', 'Featured placement', 'Verified badge'],
    isPopular: true,
  },
  {
    tier: 'Business',
    price: 5000,
    features: ['Unlimited listings', 'Premium placement', 'Verified badge', 'Analytics'],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelect = async (tier: string) => {
    if (tier === 'Basic') return;
    setLoading(tier);

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h1>
      <p className="text-center text-gray-600 mb-12">
        Select the perfect plan for your needs
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PricingCard
            key={plan.tier}
            tier={plan.tier}
            price={plan.price}
            features={plan.features}
            isPopular={plan.isPopular}
            onSelect={() => handleSelect(plan.tier.toUpperCase())}
            isLoading={loading === plan.tier.toUpperCase()}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/pricing/page.tsx components/PricingCard.tsx
git commit -m "feat: add pricing page with subscription tiers"
```

---

## Task 6: Dashboard Subscription Page

**Files:**
- Create: `app/dashboard/subscription/page.tsx`

- [ ] **Step 1: Create app/dashboard/subscription/page.tsx**

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Subscription {
  tier: string;
  status: string;
  endDate: string;
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/subscriptions');
      const data = await res.json();
      setSubscription(data.subscription);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription</h1>

      {subscription ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Current Plan: <span className="text-primary-600">{subscription.tier}</span>
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm ${
              subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {subscription.status}
            </span>
          </div>
          <p className="text-gray-600">
            Renews on: {new Date(subscription.endDate).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">You don&apos;t have an active subscription.</p>
          <Link
            href="/pricing"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/subscription/page.tsx
git commit -m "feat: add dashboard subscription page"
```

---

## Task 7: Ad API

**Files:**
- Create: `app/api/ads/route.ts`

- [ ] **Step 1: Create app/api/ads/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Get all active ads
export async function GET() {
  // TODO: Fetch from database
  const ads = [
    {
      id: '1',
      position: 'HOMEPAGE_BANNER',
      imageUrl: 'https://picsum.photos/728/90',
      clickUrl: 'https://example.com',
      impressions: 1000,
      clicks: 50,
      isActive: true,
    },
  ];
  return NextResponse.json({ ads });
}

// Create new ad campaign
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { position, imageUrl, clickUrl, budget } = body;

  // TODO: Validate and save to database
  return NextResponse.json({ message: 'Ad created', id: 'new-ad-id' }, { status: 201 });
}

// Track ad click
export async function PUT(req: NextRequest) {
  const { adId } = await req.json();

  // TODO: Increment click count
  return NextResponse.json({ message: 'Click tracked' });
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/ads/route.ts
git commit -m "feat: add ads API endpoints"
```

---

## Task 8: Ads Dashboard

**Files:**
- Create: `app/dashboard/ads/page.tsx`
- Create: `components/CampaignStats.tsx`

- [ ] **Step 1: Create components/CampaignStats.tsx**

```typescript
interface CampaignStatsProps {
  impressions: number;
  clicks: number;
  budget: number;
  spent: number;
}

export default function CampaignStats({ impressions, clicks, budget, spent }: CampaignStatsProps) {
  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0';
  const remaining = budget - spent;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-500 text-sm">Impressions</p>
        <p className="text-2xl font-bold">{impressions.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-500 text-sm">Clicks</p>
        <p className="text-2xl font-bold">{clicks.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-500 text-sm">CTR</p>
        <p className="text-2xl font-bold">{ctr}%</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-500 text-sm">Remaining Budget</p>
        <p className="text-2xl font-bold">KSh {remaining.toLocaleString()}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create app/dashboard/ads/page.tsx**

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CampaignStats from '@/components/CampaignStats';

interface AdCampaign {
  id: string;
  position: string;
  imageUrl: string;
  clickUrl: string;
  impressions: number;
  clicks: number;
  budget: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export default function AdsDashboardPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/ads');
      const data = await res.json();
      setCampaigns(data.ads);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + (c.clicks * 50), 0); // KSh 50 CPC

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ad Campaigns</h1>
        <Link
          href="/dashboard/ads/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Create Campaign
        </Link>
      </div>

      <CampaignStats
        impressions={totalImpressions}
        clicks={totalClicks}
        budget={totalBudget}
        spent={totalSpent}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Active Campaigns</h2>
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
              <img src={campaign.imageUrl} alt="Ad" className="w-32 h-16 object-cover rounded" />
              <div className="flex-1">
                <p className="font-semibold">{campaign.position}</p>
                <p className="text-sm text-gray-500">{campaign.clickUrl}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{campaign.impressions} views</p>
                <p className="text-sm text-gray-500">{campaign.clicks} clicks</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/ads/page.tsx components/CampaignStats.tsx
git commit -m "feat: add ads dashboard with campaign stats"
```

---

## Task 9: Ad Banner Components

**Files:**
- Create: `components/AdBanner.tsx`
- Create: `components/AdSidebar.tsx`

- [ ] **Step 1: Create components/AdBanner.tsx**

```typescript
'use client';

import { useState, useEffect } from 'react';

interface Ad {
  id: string;
  imageUrl: string;
  clickUrl: string;
}

interface AdBannerProps {
  position: 'homepage' | 'category';
}

export default function AdBanner({ position }: AdBannerProps) {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    fetchAd();
  }, []);

  const fetchAd = async () => {
    try {
      const res = await fetch('/api/ads?position=HOMEPAGE_BANNER');
      const data = await res.json();
      if (data.ads?.length > 0) {
        setAd(data.ads[0]);
      }
    } catch (error) {
      console.error('Error fetching ad:', error);
    }
  };

  const handleClick = async () => {
    if (ad) {
      // Track click
      await fetch('/api/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: ad.id }),
      });
      window.open(ad.clickUrl, '_blank');
    }
  };

  if (!ad) return null;

  return (
    <div className="w-full max-w-[728px] mx-auto my-8">
      <button onClick={handleClick} className="block w-full">
        <img
          src={ad.imageUrl}
          alt="Advertisement"
          className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
        />
      </button>
      <p className="text-xs text-gray-400 text-center mt-1">Advertisement</p>
    </div>
  );
}
```

- [ ] **Step 2: Create components/AdSidebar.tsx**

```typescript
'use client';

import { useState, useEffect } from 'react';

interface Ad {
  id: string;
  imageUrl: string;
  clickUrl: string;
}

export default function AdSidebar() {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/ads?position=LISTING_SIDEBAR');
      const data = await res.json();
      setAds(data.ads?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleClick = async (adId: string, clickUrl: string) => {
    await fetch('/api/ads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId }),
    });
    window.open(clickUrl, '_blank');
  };

  if (ads.length === 0) return null;

  return (
    <div className="space-y-4">
      {ads.map((ad) => (
        <button
          key={ad.id}
          onClick={() => handleClick(ad.id, ad.clickUrl)}
          className="block w-full"
        >
          <img
            src={ad.imageUrl}
            alt="Advertisement"
            className="w-full h-[250px] object-cover rounded-lg cursor-pointer hover:opacity-90"
          />
        </button>
      ))}
      <p className="text-xs text-gray-400 text-center">Advertisement</p>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/AdBanner.tsx components/AdSidebar.tsx
git commit -m "feat: add AdBanner and AdSidebar components"
```

---

## Task 10: Integrate Ads into Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add AdBanner to homepage**

Add import:
```typescript
import AdBanner from '@/components/AdBanner';
```

Add after hero section:
```tsx
<AdBanner position="homepage" />
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add banner ad to homepage"
```

---

## Task 11: Integrate Ads into Vehicles Page

**Files:**
- Modify: `app/vehicles/page.tsx`

- [ ] **Step 1: Add AdSidebar to vehicles page**

Add import:
```typescript
import AdSidebar from '@/components/AdSidebar';
```

Add in the sidebar area (after FilterSidebar):
```tsx
<AdSidebar />
```

- [ ] **Step 2: Commit**

```bash
git add app/vehicles/page.tsx
git commit -m "feat: add sidebar ads to vehicles page"
```

---

## Task 12: Add Pricing Link to Navbar

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Add pricing link to navbar**

Add 'Pricing' to the navLinks array:
```typescript
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/vehicles', label: 'Vehicles' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/sell', label: 'Sell' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
```

- [ ] **Step 2: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: add pricing link to navbar"
```

---

## Task 13: Premium Badges

**Files:**
- Create: `components/PremiumBadge.tsx`

- [ ] **Step 1: Create components/PremiumBadge.tsx**

```typescript
interface PremiumBadgeProps {
  type: 'featured' | 'verified' | 'premium';
}

export default function PremiumBadge({ type }: PremiumBadgeProps) {
  const badges = {
    featured: {
      text: 'Featured',
      bg: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: '⭐',
    },
    verified: {
      text: 'Verified',
      bg: 'bg-green-100',
      textColor: 'text-green-800',
      icon: '✓',
    },
    premium: {
      text: 'Premium',
      bg: 'bg-purple-100',
      textColor: 'text-purple-800',
      icon: '👑',
    },
  };

  const badge = badges[type];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.textColor}`}>
      <span>{badge.icon}</span>
      <span>{badge.text}</span>
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/PremiumBadge.tsx
git commit -m "feat: add PremiumBadge component"
```

---

## Task 14: Webhook Implementation

**Files:**
- Modify: `app/api/webhooks/stripe/route.ts`

- [ ] **Step 1: Implement webhook handlers**

Update `app/api/webhooks/stripe/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier;

      if (userId && tier) {
        await prisma.subscription.create({
          data: {
            userId,
            tier: tier as 'PRO' | 'BUSINESS',
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription as string;

      // Update subscription status to ACTIVE
      if (subscriptionId) {
        const subscription = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
        });
        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              status: 'ACTIVE',
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const stripeSubId = subscription.id;

      // Mark subscription as cancelled
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: stripeSubId },
        data: { status: 'CANCELLED' },
      });
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata?.userId;

      // Update subscription to PENDING
      if (userId) {
        await prisma.subscription.updateMany({
          where: { userId, status: 'ACTIVE' },
          data: { status: 'PENDING' },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/webhooks/stripe/route.ts
git commit -m "feat: implement Stripe webhook handlers"
```

---

## Task 15: Scheduled Jobs (Cron)

**Files:**
- Create: `app/api/cron/expire-subscriptions/route.ts`
- Create: `app/api/cron/check-ad-budgets/route.ts`

- [ ] **Step 1: Create subscription expiration cron**

```typescript
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Deactivate expired subscriptions
  const expired = await prisma.subscription.updateMany({
    where: {
      status: 'ACTIVE',
      endDate: { lt: new Date() },
    },
    data: { status: 'EXPIRED' },
  });

  // Deactivate expired premium listings
  const expiredPremiums = await prisma.premiumListing.updateMany({
    where: {
      expiresAt: { lt: new Date() },
    },
    data: { expiresAt: new Date() }, // Mark as expired
  });

  // End expired ad campaigns
  const expiredCampaigns = await prisma.adCampaign.updateMany({
    where: {
      isActive: true,
      endDate: { lt: new Date() },
    },
    data: { isActive: false },
  });

  return NextResponse.json({
    expiredSubscriptions: expired.count,
    expiredPremiums: expiredPremiums.count,
    expiredCampaigns: expiredCampaigns.count,
  });
}
```

- [ ] **Step 2: Create ad budget check cron**

```typescript
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Pause campaigns where budget is exceeded
  const paused = await prisma.adCampaign.updateMany({
    where: {
      isActive: true,
      clicks: { gte: prisma.adCampaign.fields.budget / prisma.adCampaign.fields.costPerClick },
    },
    data: { isActive: false },
  });

  return NextResponse.json({ pausedCampaigns: paused.count });
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/cron/expire-subscriptions/route.ts app/api/cron/check-ad-budgets/route.ts
git commit -m "feat: add scheduled jobs for subscription expiration and ad budgets"
```

---

## Task 16: Ad Creation Page

**Files:**
- Create: `app/dashboard/ads/new/page.tsx`

- [ ] **Step 1: Create app/dashboard/ads/new/page.tsx**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    position: 'HOMEPAGE_BANNER',
    imageUrl: '',
    clickUrl: '',
    budget: 5000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/dashboard/ads');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Ad Campaign</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Ad Position</label>
          <select
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="HOMEPAGE_BANNER">Homepage Banner (728x90)</option>
            <option value="CATEGORY_BANNER">Category Banner (728x90)</option>
            <option value="LISTING_SIDEBAR">Sidebar Ad (300x250)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            required
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://example.com/ad.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Click URL</label>
          <input
            type="url"
            required
            value={form.clickUrl}
            onChange={(e) => setForm({ ...form, clickUrl: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Budget (KSh)</label>
          <input
            type="number"
            required
            min="5000"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded-md"
          />
          <p className="text-sm text-gray-500 mt-1">Minimum KSh 5,000</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/ads/new/page.tsx
git commit -m "feat: add ad creation page"
```

---

## Task 17: Premium Feature Purchases

**Files:**
- Create: `app/api/premium/route.ts`
- Create: `app/dashboard/premium/page.tsx`

- [ ] **Step 1: Create premium feature API**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';

// Get premium listings for user
export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const premiums = await prisma.premiumListing.findMany({
    where: { userId: session.user.id },
    include: { listing: true },
  });

  return NextResponse.json({ premiums });
}

// Purchase premium feature
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { listingId, feature } = await req.json();

  // Set expiration based on feature
  let expiresAt: Date;
  switch (feature) {
    case 'FEATURED':
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
      break;
    case 'PREMIUM_PLACEMENT':
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
      break;
    case 'VERIFIED':
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 1 month
      break;
    case 'EXTENDED_DURATION':
      expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
      break;
    default:
      return NextResponse.json({ error: 'Invalid feature' }, { status: 400 });
  }

  const premium = await prisma.premiumListing.create({
    data: {
      userId: session.user.id,
      listingId,
      feature,
      expiresAt,
    },
  });

  return NextResponse.json({ premium }, { status: 201 });
}
```

- [ ] **Step 2: Create premium dashboard page**

```typescript
'use client';

import { useState, useEffect } from 'react';

interface PremiumListing {
  id: string;
  feature: string;
  expiresAt: string;
  listing: { title: string };
}

export default function PremiumListingsPage() {
  const [premiums, setPremiums] = useState<PremiumListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPremiums();
  }, []);

  const fetchPremiums = async () => {
    try {
      const res = await fetch('/api/premium');
      const data = await res.json();
      setPremiums(data.premiums);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Premium Features</h1>

      <div className="grid gap-4">
        {premiums.map((premium) => (
          <div key={premium.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{premium.listing.title}</h3>
                <p className="text-sm text-gray-500 capitalize">{premium.feature.replace('_', ' ')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Expires</p>
                <p className="font-medium">
                  {new Date(premium.expiresAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/premium/route.ts app/dashboard/premium/page.tsx
git commit -m "feat: add premium feature purchases and dashboard"
```

---

## Task 18: Business Analytics

**Files:**
- Create: `app/dashboard/analytics/page.tsx`

- [ ] **Step 1: Create analytics dashboard page**

```typescript
'use client';

import { useState, useEffect } from 'react';

interface Analytics {
  totalViews: number;
  totalInquiries: number;
  viewsOverTime: { date: string; views: number }[];
  topLocations: { location: string; views: number }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!analytics) return <div>No analytics data</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm">Total Views</p>
          <p className="text-3xl font-bold">{analytics.totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm">Total Inquiries</p>
          <p className="text-3xl font-bold">{analytics.totalInquiries.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm">CTR</p>
          <p className="text-3xl font-bold">
            {analytics.totalViews > 0
              ? ((analytics.totalInquiries / analytics.totalViews) * 100).toFixed(2) + '%'
              : '0%'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Views Over Time</h2>
        <div className="space-y-2">
          {analytics.viewsOverTime.map((item) => (
            <div key={item.date} className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">{item.date}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-4">
                <div
                  className="bg-primary-500 h-4 rounded-full"
                  style={{ width: `${(item.views / analytics.totalViews) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-16 text-right">{item.views}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Top Locations</h2>
        <ul className="space-y-2">
          {analytics.topLocations.map((loc) => (
            <li key={loc.location} className="flex justify-between">
              <span>{loc.location}</span>
              <span className="font-medium">{loc.views}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create analytics API**

```typescript
// app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get all listings for user
  const listings = await prisma.listing.findMany({
    where: { userId: session.user.id },
  });

  // Calculate analytics (mock data for now)
  const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);
  const totalInquiries = Math.floor(totalViews * 0.05); // 5% conversion

  return NextResponse.json({
    totalViews,
    totalInquiries,
    viewsOverTime: [
      { date: '2026-03-20', views: 150 },
      { date: '2026-03-21', views: 200 },
      { date: '2026-03-22', views: 180 },
      { date: '2026-03-23', views: 220 },
      { date: '2026-03-24', views: 250 },
    ],
    topLocations: [
      { location: 'Nairobi', views: 500 },
      { location: 'Mombasa', views: 200 },
      { location: 'Kisumu', views: 150 },
    ],
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/analytics/page.tsx app/api/analytics/route.ts
git commit -m "feat: add business analytics dashboard"
```

---

## Task 19: Build and Verify

- [ ] **Step 1: Run build**

Run: `npm run build`

Expected: Build completes without errors

- [ ] **Step 2: Verify all pages load**

- Pricing page: http://localhost:3000/pricing
- Dashboard subscription: http://localhost:3000/dashboard/subscription
- Dashboard ads: http://localhost:3000/dashboard/ads
- Homepage (ad banner)
- Vehicles page (sidebar ads)

- [ ] **Step 3: Commit final**

```bash
git add .
git commit -m "feat: complete Phase 4 - monetization and advertising"
```

---

## Summary

Phase 4 implementation includes:

- ✅ Prisma models for Subscriptions, Payments, Premium Listings, Ad Campaigns
- ✅ Stripe integration for payment processing
- ✅ Stripe webhooks for subscription management
- ✅ Pricing page with subscription tiers
- ✅ Dashboard subscription management
- ✅ Ads API endpoints
- ✅ Ads dashboard with campaign stats
- ✅ AdBanner and AdSidebar components
- ✅ Integration into homepage and vehicles page
- ✅ Premium badges component
- ✅ Navbar pricing link

**Next Steps (Phase 5):**
- M-Pesa integration for Kenya
- Email notifications for subscription events
- Advanced analytics for business tier
- Ad optimization and targeting