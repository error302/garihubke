# GariHub Phase 5A: Dealer Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build dealer portal with bulk listing management, team management, branding, and API access.

**Architecture:** Next.js App Router with Prisma, extending existing auth system.

**Tech Stack:** Next.js 14, Prisma, TypeScript, Tailwind CSS, CSV parsing

---

## File Structure

```
garihubke/
├── app/
│   ├── api/
│   │   └── dealers/
│   │       ├── route.ts           # CRUD + list
│   │       ├── [id]/
│   │       │   └── route.ts       # Get/update single
│   │       ├── [id]/members/
│   │       │   └── route.ts       # Team management
│   │       ├── [id]/inventory/
│   │       │   └── route.ts       # Inventory CRUD
│   │       ├── [id]/bulk-upload/
│   │       │   └── route.ts       # CSV upload
│   │       ├── [id]/export/
│   │       │   └── route.ts       # Export inventory
│   │       ├── [id]/api-keys/
│   │       │   └── route.ts       # API key CRUD
│   │       └── [id]/webhooks/
│   │           └── route.ts       # Webhook CRUD
│   ├── dashboard/
│   │   └── dealer/
│   │       ├── page.tsx           # Dashboard
│   │       ├── upload/
│   │       │   └── page.tsx      # Bulk upload
│   │       ├── team/
│   │       │   └── page.tsx      # Team management
│   │       ├── profile/
│   │       │   └── page.tsx      # Edit profile
│   │       └── api/
│   │           └── page.tsx      # API access
│   └── dealers/
│       └── [id]/
│           └── page.tsx          # Public dealer page
├── components/
│   ├── DealerCard.tsx
│   ├── InventoryTable.tsx
│   ├── UploadZone.tsx
│   ├── TeamMemberRow.tsx
│   ├── ApiKeyManager.tsx
│   └── DealerStats.tsx
├── lib/
│   └── csv-parser.ts             # CSV parsing utility
└── prisma/
    └── schema.prisma             # Add dealer models
```

---

## Task 1: Prisma Schema Updates

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add dealer models to schema**

Add these enums and models to `prisma/schema.prisma`:

```prisma
enum DealerRole {
  ADMIN
  MANAGER
  STAFF
}

enum StockStatus {
  AVAILABLE
  SOLD
  RESERVED
  PENDING
}

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
  country       String   @default("Kenya")
  isVerified    Boolean  @default(false)
  verifiedAt    DateTime?
  isDeleted     Boolean  @default(false)
  isSuspended   Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  members       DealerMember[]
  inventory     DealerInventory[]
  apiAccess     DealerApiAccess[]
  webhooks      DealerWebhook[]
}

model DealerMember {
  id        String     @id @default(cuid())
  dealerId  String
  dealer    Dealer     @relation(fields: [dealerId], references: [id])
  userId    String
  user      User       @relation(fields: [userId], references: [id])
  role      DealerRole @default(STAFF)
  createdAt DateTime   @default(now())
}

model DealerInventory {
  id          String       @id @default(cuid())
  dealerId    String
  dealer      Dealer       @relation(fields: [dealerId], references: [id])
  listingId   String       @unique
  listing     Listing      @relation(fields: [listingId], references: [id])
  costPrice   Int?
  stockStatus StockStatus  @default(AVAILABLE)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model DealerApiAccess {
  id          String   @id @default(cuid())
  dealerId    String
  dealer      Dealer   @relation(fields: [dealerId], references: [id])
  apiKeyHash  String   @unique
  name        String
  lastUsedAt  DateTime?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model DealerWebhook {
  id        String   @id @default(cuid())
  dealerId  String
  dealer    Dealer   @relation(fields: [dealerId], references: [id])
  url       String
  events    String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

- [ ] **Step 2: Run Prisma commands**

Run: `npx prisma generate && npx prisma db push`

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add dealer portal models to Prisma schema"
```

---

## Task 2: CSV Parser Utility

**Files:**
- Create: `lib/csv-parser.ts`

- [ ] **Step 1: Create CSV parser**

```typescript
export interface CSVRow {
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  description: string;
  features: string;
  images: string;
  sellerName: string;
  sellerPhone: string;
  sellerLocation: string;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const REQUIRED_FIELDS = [
  'title', 'make', 'model', 'year', 'price', 'mileage',
  'fuelType', 'transmission', 'description', 'features',
  'images', 'sellerName', 'sellerPhone', 'sellerLocation'
];

const VALID_FUEL_TYPES = ['petrol', 'diesel', 'electric', 'hybrid'];
const VALID_TRANSMISSIONS = ['manual', 'automatic'];
const MAX_ROWS = 500;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateCSV(content: string): { valid: boolean; errors: ValidationError[]; data: CSVRow[] } {
  const lines = content.trim().split('\n');
  const errors: ValidationError[] = [];
  const data: CSVRow[] = [];

  if (lines.length < 2) {
    errors.push({ row: 0, field: 'file', message: 'CSV must have header and at least one data row' });
    return { valid: false, errors, data };
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: any = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });

    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!row[field]) {
        errors.push({ row: i + 1, field, message: `${field} is required` });
      }
    }

    // Validate year
    if (row.year && (isNaN(Number(row.year)) || Number(row.year) < 1900 || Number(row.year) > 2027)) {
      errors.push({ row: i + 1, field: 'year', message: 'Year must be between 1900 and 2027' });
    }

    // Validate price
    if (row.price && (isNaN(Number(row.price)) || Number(row.price) < 50000)) {
      errors.push({ row: i + 1, field: 'price', message: 'Price must be at least 50000' });
    }

    // Validate fuelType
    if (row.fueltype && !VALID_FUEL_TYPES.includes(row.fueltype.toLowerCase())) {
      errors.push({ row: i + 1, field: 'fuelType', message: `Must be one of: ${VALID_FUEL_TYPES.join(', ')}` });
    }

    // Validate transmission
    if (row.transmission && !VALID_TRANSMISSIONS.includes(row.transmission.toLowerCase())) {
      errors.push({ row: i + 1, field: 'transmission', message: `Must be one of: ${VALID_TRANSMISSIONS.join(', ')}` });
    }

    data.push(row as CSVRow);
  }

  return { valid: errors.length === 0, errors, data };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}

export { MAX_ROWS, MAX_FILE_SIZE };
```

- [ ] **Step 2: Commit**

```bash
git add lib/csv-parser.ts
git commit -m "feat: add CSV parser utility with validation"
```

---

## Task 3: Dealer API Routes

**Files:**
- Create: `app/api/dealers/route.ts`
- Create: `app/api/dealers/[id]/route.ts`

- [ ] **Step 1: Create main dealer route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const city = searchParams.get('city');
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;

  const where: any = { isDeleted: false, isSuspended: false };
  
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (city) {
    where.city = city;
  }

  const [dealers, total] = await Promise.all([
    db.dealer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    db.dealer.count({ where }),
  ]);

  return NextResponse.json({ dealers, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone, email, city } = body;

  const dealer = await db.dealer.create({
    data: {
      userId: session.user.id,
      name,
      phone,
      email,
      city,
    },
  });

  return NextResponse.json({ dealer }, { status: 201 });
}
```

- [ ] **Step 2: Create single dealer route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const dealer = await db.dealer.findUnique({
    where: { id, isDeleted: false, isSuspended: false },
    include: {
      members: true,
      inventory: {
        where: { stockStatus: 'AVAILABLE' },
        include: { listing: true },
      },
    },
  });

  if (!dealer) {
    return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
  }

  return NextResponse.json({ dealer });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // Check membership
  const membership = await db.dealerMember.findFirst({
    where: { dealerId: id, userId: session.user.id, role: { in: ['ADMIN', 'MANAGER'] } },
  });

  if (!membership) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const dealer = await db.dealer.update({
    where: { id },
    data: body,
  });

  return NextResponse.json({ dealer });
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/dealers/route.ts app/api/dealers/\[id\]/route.ts
git commit -m "feat: add dealer API routes"
```

---

## Task 4: Inventory & Bulk Upload

**Files:**
- Create: `app/api/dealers/[id]/inventory/route.ts`
- Create: `app/api/dealers/[id]/bulk-upload/route.ts`

- [ ] **Step 1: Create inventory route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;

  const inventory = await db.dealerInventory.findMany({
    where: { dealerId: id },
    include: { listing: true },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ inventory });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { listingId, costPrice } = body;

  const inventory = await db.dealerInventory.create({
    data: {
      dealerId: id,
      listingId,
      costPrice,
    },
  });

  return NextResponse.json({ inventory }, { status: 201 });
}
```

- [ ] **Step 2: Create bulk upload route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { validateCSV } from '@/lib/csv-parser';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { csvContent } = body;

  const { valid, errors, data } = validateCSV(csvContent);

  if (!valid) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const created: string[] = [];
  
  for (const row of data) {
    const listing = await db.listing.create({
      data: {
        userId: session.user.id,
        title: row.title,
        make: row.make,
        model: row.model,
        year: Number(row.year),
        price: Number(row.price),
        mileage: Number(row.mileage),
        fuelType: row.fuelType,
        transmission: row.transmission,
        description: row.description,
        features: row.features,
        images: row.images,
        sellerName: row.sellerName,
        sellerPhone: row.sellerPhone,
        sellerLocation: row.sellerLocation,
        status: 'active',
      },
    });

    await db.dealerInventory.create({
      data: {
        dealerId: id,
        listingId: listing.id,
      },
    });

    created.push(listing.id);
  }

  return NextResponse.json({ created: created.length, listingIds: created });
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/dealers/\[id\]/inventory/route.ts app/api/dealers/\[id\]/bulk-upload/route.ts
git commit -m "feat: add inventory and bulk upload API routes"
```

---

## Task 5: Team & API Management

**Files:**
- Create: `app/api/dealers/[id]/members/route.ts`
- Create: `app/api/dealers/[id]/api-keys/route.ts`

- [ ] **Step 1: Create team management route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const members = await db.dealerMember.findMany({
    where: { dealerId: id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ members });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { email, role } = await req.json();

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const member = await db.dealerMember.create({
    data: {
      dealerId: id,
      userId: user.id,
      role: role || 'STAFF',
    },
  });

  return NextResponse.json({ member }, { status: 201 });
}
```

- [ ] **Step 2: Create API keys route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { randomBytes } from 'crypto';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const apiKeys = await db.dealerApiAccess.findMany({
    where: { dealerId: id },
    select: { id: true, name: true, lastUsedAt: true, isActive: true, createdAt: true },
  });

  return NextResponse.json({ apiKeys });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { name } = await req.json();
  
  const apiKey = randomBytes(32).toString('hex');
  const apiKeyHash = `sk_${apiKey}`;

  const access = await db.dealerApiAccess.create({
    data: {
      dealerId: id,
      apiKeyHash,
      name,
    },
  });

  return NextResponse.json({ 
    apiKey: access.apiKeyHash,
    name: access.name,
    id: access.id,
  }, { status: 201 });
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/dealers/\[id\]/members/route.ts app/api/dealers/\[id\]/api-keys/route.ts
git commit -m "feat: add team and API key management routes"
```

---

## Task 6: Dashboard Pages

**Files:**
- Create: `app/dashboard/dealer/page.tsx`
- Create: `components/DealerStats.tsx`

- [ ] **Step 1: Create DealerStats component**

```typescript
interface DealerStatsProps {
  totalListings: number;
  totalViews: number;
  totalInquiries: number;
  available: number;
  sold: number;
}

export default function DealerStats({ totalListings, totalViews, totalInquiries, available, sold }: DealerStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-sm">Total Listings</p>
        <p className="text-3xl font-bold">{totalListings}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-sm">Total Views</p>
        <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-sm">Inquiries</p>
        <p className="text-3xl font-bold">{totalInquiries}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-sm">Sold</p>
        <p className="text-3xl font-bold">{sold}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create dealer dashboard page**

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DealerStats from '@/components/DealerStats';

export default function DealerDashboardPage() {
  const [stats, setStats] = useState({ totalListings: 0, totalViews: 0, totalInquiries: 0, available: 0, sold: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dealers/me');
      const data = await res.json();
      setStats(data.stats || { totalListings: 0, totalViews: 0, totalInquiries: 0, available: 0, sold: 0 });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dealer Dashboard</h1>

      <DealerStats {...stats} />

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Link href="/dashboard/dealer/upload" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Bulk Upload</h3>
          <p className="text-gray-600">Upload multiple listings via CSV</p>
        </Link>
        <Link href="/dashboard/dealer/team" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Team Management</h3>
          <p className="text-gray-600">Invite and manage team members</p>
        </Link>
        <Link href="/dashboard/dealer/profile" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Profile</h3>
          <p className="text-gray-600">Update your dealer profile</p>
        </Link>
        <Link href="/dashboard/dealer/api" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">API Access</h3>
          <p className="text-gray-600">Manage API keys and webhooks</p>
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/dealer/page.tsx components/DealerStats.tsx
git commit -m "feat: add dealer dashboard with stats"
```

---

## Task 7: Upload & Team Pages

**Files:**
- Create: `app/dashboard/dealer/upload/page.tsx`
- Create: `app/dashboard/dealer/team/page.tsx`
- Create: `components/UploadZone.tsx`
- Create: `components/TeamMemberRow.tsx`

- [ ] **Step 1: Create UploadZone component]

```typescript
'use client';

import { useState } from 'react';

interface UploadZoneProps {
  onUpload: (content: string) => Promise<void>;
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const content = await file.text();
      await onUpload(content);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
      }`}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        type="file"
        accept=".csv"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
        id="csv-upload"
        disabled={loading}
      />
      <label htmlFor="csv-upload" className="cursor-pointer">
        <p className="text-lg font-medium">
          {loading ? 'Uploading...' : 'Drop CSV file here or click to browse'}
        </p>
        <p className="text-sm text-gray-500 mt-2">Max 500 rows, 5MB</p>
      </label>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Create upload page]

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadZone from '@/components/UploadZone';

export default function UploadPage() {
  const router = useRouter();
  const [results, setResults] = useState<any>(null);

  const handleUpload = async (csvContent: string) => {
    const res = await fetch('/api/dealers/[id]/bulk-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvContent }),
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Upload failed');
    setResults(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bulk Upload Listings</h1>
      
      <a href="/templates/upload-template.csv" download className="text-primary-600 hover:underline mb-4 block">
        Download CSV Template
      </a>

      <UploadZone onUpload={handleUpload} />

      {results && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="font-semibold text-green-800">
            Successfully created {results.created} listings!
          </p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create team page]

```typescript
'use client';

import { useState, useEffect } from 'react';

interface Member {
  id: string;
  role: string;
  user: { name: string; email: string };
  createdAt: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/dealers/[id]/members');
      const data = await res.json();
      setMembers(data.members || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Team Management</h1>

      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{member.user.name}</p>
              <p className="text-sm text-gray-500">{member.user.email}</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit]

```bash
git add app/dashboard/dealer/upload/page.tsx app/dashboard/dealer/team/page.tsx components/UploadZone.tsx components/TeamMemberRow.tsx
git commit -m "feat: add upload and team management pages"
```

---

## Task 8: Profile & API Pages

**Files:**
- Create: `app/dashboard/dealer/profile/page.tsx`
- Create: `app/dashboard/dealer/api/page.tsx`
- Create: `components/ApiKeyManager.tsx`

- [ ] **Step 1: Create profile page]

```typescript
'use client';

import { useState } from 'react';

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    city: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/dealers/[id]', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dealer Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Company Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Website</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button type="submit" className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Create API page]

```typescript
'use client';

import { useState, useEffect } from 'react';
import ApiKeyManager from '@/components/ApiKeyManager';

export default function ApiPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/dealers/[id]/api-keys');
      const data = await res.json();
      setKeys(data.apiKeys || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Access</h1>

      <ApiKeyManager keys={keys} onRefresh={fetchKeys} />
    </div>
  );
}
```

- [ ] **Step 3: Create ApiKeyManager component]

```typescript
'use client';

import { useState } from 'react';

interface ApiKey {
  id: string;
  name: string;
  createdAt: string;
  isActive: boolean;
}

interface ApiKeyManagerProps {
  keys: ApiKey[];
  onRefresh: () => void;
}

export default function ApiKeyManager({ keys, onRefresh }: ApiKeyManagerProps) {
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const createKey = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/dealers/[id]/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Key' }),
      });
      const data = await res.json();
      setNewKey(data.apiKey);
      onRefresh();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <button
        onClick={createKey}
        disabled={creating}
        className="mb-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {creating ? 'Creating...' : 'Generate New API Key'}
      </button>

      {newKey && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-medium text-yellow-800">API Key Created!</p>
          <p className="text-sm text-yellow-600 mt-1">Copy this now - you won't see it again:</p>
          <code className="block mt-2 p-2 bg-white rounded font-mono text-sm">{newKey}</code>
        </div>
      )}

      <div className="space-y-2">
        {keys.map((key) => (
          <div key={key.id} className="flex justify-between items-center bg-white rounded-lg shadow p-4">
            <div>
              <p className="font-medium">{key.name}</p>
              <p className="text-sm text-gray-500">Created {new Date(key.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${key.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {key.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit]

```bash
git add app/dashboard/dealer/profile/page.tsx app/dashboard/dealer/api/page.tsx components/ApiKeyManager.tsx
git commit -m "feat: add profile and API management pages"
```

---

## Task 9: Public Dealer Page

**Files:**
- Create: `app/dealers/[id]/page.tsx`
- Create: `components/DealerCard.tsx`

- [ ] **Step 1: Create DealerCard component]

```typescript
import Link from 'next/link';

interface DealerCardProps {
  dealer: {
    id: string;
    name: string;
    logo?: string | null;
    city?: string | null;
    isVerified: boolean;
    _count?: { inventory: number };
  };
}

export default function DealerCard({ dealer }: DealerCardProps) {
  return (
    <Link href={`/dealers/${dealer.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-4">
          {dealer.logo ? (
            <img src={dealer.logo} alt={dealer.name} className="w-16 h-16 rounded-lg object-cover" />
          ) : (
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">{dealer.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">
              {dealer.name}
              {dealer.isVerified && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Verified</span>
              )}
            </h3>
            {dealer.city && <p className="text-gray-500">{dealer.city}</p>}
          </div>
        </div>
        {dealer._count && (
          <p className="mt-4 text-sm text-gray-500">{dealer._count.inventory} vehicles</p>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create public dealer page]

```typescript
import { db } from '@/lib/db';
import VehicleGrid from '@/components/VehicleGrid';
import DealerCard from '@/components/DealerCard';

export default async function PublicDealerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const dealer = await db.dealer.findUnique({
    where: { id, isDeleted: false, isSuspended: false },
    include: {
      inventory: {
        where: { stockStatus: 'AVAILABLE' },
        include: { listing: true },
      },
    },
  });

  if (!dealer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Dealer Not Found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center gap-6">
          {dealer.logo ? (
            <img src={dealer.logo} alt={dealer.name} className="w-24 h-24 rounded-lg object-cover" />
          ) : (
            <div className="w-24 h-24 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-600">{dealer.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">
              {dealer.name}
              {dealer.isVerified && (
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Verified</span>
              )}
            </h1>
            {dealer.description && <p className="text-gray-600 mt-2">{dealer.description}</p>}
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              {dealer.city && <span>{dealer.city}</span>}
              {dealer.phone && <span>{dealer.phone}</span>}
              {dealer.email && <span>{dealer.email}</span>}
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Inventory ({dealer.inventory.length})</h2>
      <VehicleGrid vehicles={dealer.inventory.map(i => i.listing)} />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/dealers/\[id\]/page.tsx components/DealerCard.tsx
git commit -m "feat: add public dealer page"
```

---

## Task 10: Build and Verify

- [ ] **Step 1: Run build**

Run: `npm run build`

Expected: Build completes without errors

- [ ] **Step 2: Commit final**

```bash
git add .
git commit -m "feat: complete Phase 5A - dealer portal"
```

---

## Summary

Phase 5A (Dealer Portal) includes:
- ✅ Prisma models for Dealer, DealerMember, DealerInventory, DealerApiAccess, DealerWebhook
- ✅ CSV parser with validation
- ✅ Dealer CRUD API routes
- ✅ Inventory management and bulk upload
- ✅ Team management
- ✅ API key generation
- ✅ Dealer dashboard with stats
- ✅ Upload, team, profile, API pages
- ✅ Public dealer page with inventory

**Next:**
- Phase 5B: Regional Features
- Phase 5C: Mobile App