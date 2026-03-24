# Password Reset & Sell Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add email-based password reset using Resend and full vehicle listing form on sell page

**Architecture:** Password reset via email tokens stored in SQLite, listings stored as pending approval in database

**Tech Stack:** Next.js 14, Prisma, SQLite, Resend (email), bcryptjs

---

## Task 1: Database Schema Updates

**Files:**
- Modify: `prisma/schema.prisma`
- Run: `npx prisma db push`

- [ ] **Step 1: Add PasswordResetToken and Listing models**

```prisma
model PasswordResetToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Listing {
  id               String   @id @default(cuid())
  userId           String
  title            String
  category         String
  make             String
  model            String
  year             Int
  price            Int
  mileage          Int?
  fuelType         String
  transmission     String
  description      String
  sellerName       String
  sellerPhone      String
  sellerLocation   String
  features         String   // JSON array
  images           String   // JSON array
  status           String   @default("pending")
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

- [ ] **Step 2: Push schema to database**

Run: `npx prisma db push`

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add PasswordResetToken and Listing models"
```

---

## Task 2: Install Resend

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install resend**

Run: `npm install resend`

- [ ] **Step 2: Add RESEND_API_KEY to .env.example**

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "feat: add resend for password reset emails"
```

---

## Task 3: Forgot Password Page

**Files:**
- Create: `app/forgot-password/page.tsx`

- [ ] **Step 1: Create forgot-password page**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setSent(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Check your email</h2>
          <p className="text-gray-600 mb-6">
            If an account exists with {email}, we've sent password reset instructions.
          </p>
          <Link href="/login" className="text-primary-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary-600">GariHub</Link>
          <h1 className="text-xl mt-2">Forgot Password</h1>
          <p className="text-gray-600 text-sm mt-2">
            Enter your email and we'll send you reset instructions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-primary-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/forgot-password/page.tsx
git commit -m "feat: add forgot password page"
```

---

## Task 4: Reset Password Page

**Files:**
- Create: `app/reset-password/[token]/page.tsx`

- [ ] **Step 1: Create reset-password/[token] page**

```tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ token: string }>;
}

export default function ResetPasswordPage({ params }: Props) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(resolvedParams.token);
  }, [resolvedParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Something went wrong');
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Password Reset!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been reset successfully. Redirecting to login...
          </p>
          <Link href="/login" className="text-primary-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary-600">GariHub</Link>
          <h1 className="text-xl mt-2">Reset Password</h1>
          <p className="text-gray-600 text-sm mt-2">
            Enter your new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Min 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Confirm password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/reset-password/\[token\]/page.tsx
git commit -m "feat: add reset password page"
```

---

## Task 5: Forgot Password API

**Files:**
- Create: `app/api/forgot-password/route.ts`

- [ ] **Step 1: Create forgot-password API**

```ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user || !user.password) {
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing tokens for this email
    await db.passwordResetToken.deleteMany({
      where: { identifier: email },
    });

    // Create new token
    await db.passwordResetToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send email if Resend is configured
    if (resend) {
      const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password/${token}`;
      
      await resend.emails.send({
        from: 'GariHub <noreply@garihub.com>',
        to: email,
        subject: 'Reset your GariHub password',
        html: `
          <h1>Reset Your Password</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/forgot-password/route.ts
git commit -m "feat: add forgot password API"
```

---

## Task 6: Reset Password API

**Files:**
- Create: `app/api/reset-password/route.ts`

- [ ] **Step 1: Create reset-password API**

```ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password required' }, { status: 400 });
    }

    // Find the token
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Check if expired
    if (resetToken.expires < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: resetToken.identifier },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete used token
    await db.passwordResetToken.delete({
      where: { token },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/reset-password/route.ts
git commit -m "feat: add reset password API"
```

---

## Task 7: Sell Page (Full Form)

**Files:**
- Create: `app/sell/page.tsx`
- Modify: `components/Navbar.tsx` (add link to login if not authenticated)

- [ ] **Step 1: Create sell page with full form**

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { makes, getModelsForMake, fuelTypes, transmissions, categories, features as allFeatures } from '@/data/vehicles';

export default function SellPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: '',
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    description: '',
    sellerName: '',
    sellerPhone: '',
    sellerLocation: '',
    features: [] as string[],
    images: '',
  });

  const updateField = (field: string, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'make' && value !== prev.make) {
      setForm(prev => ({ ...prev, model: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year),
          price: parseInt(form.price),
          mileage: form.mileage ? parseInt(form.mileage) : null,
          features: JSON.stringify(form.features),
          images: JSON.stringify(form.images.split(',').map((url: string) => url.trim()).filter(Boolean)),
        }),
      });

      if (res.ok) {
        router.push('/dashboard/listings');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create listing');
      }
    } catch (err) {
      setError('Something went wrong');
    }

    setLoading(false);
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const currentModels = form.make ? getModelsForMake(form.make) : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">List Your Vehicle</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
              minLength={5}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., 2019 Toyota Premio"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => updateField('year', e.target.value)}
                required
                min={1900}
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 2020"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
              <select
                value={form.make}
                onChange={(e) => updateField('make', e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select make</option>
                {makes.map((make) => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <select
                value={form.model}
                onChange={(e) => updateField('model', e.target.value)}
                required
                disabled={!form.make}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
              >
                <option value="">Select model</option>
                {currentModels.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Price & Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Price & Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (KSh) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                required
                min={0}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 1500000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
              <input
                type="number"
                value={form.mileage}
                onChange={(e) => updateField('mileage', e.target.value)}
                min={0}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 50000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type *</label>
              <select
                value={form.fuelType}
                onChange={(e) => updateField('fuelType', e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select fuel type</option>
                {fuelTypes.map((fuel) => (
                  <option key={fuel} value={fuel} className="capitalize">{fuel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
              <select
                value={form.transmission}
                onChange={(e) => updateField('transmission', e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select transmission</option>
                {transmissions.map((trans) => (
                  <option key={trans} value={trans} className="capitalize">{trans}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Description</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              required
              minLength={20}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Describe your vehicle..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allFeatures.map((feature) => (
                <label key={feature} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.features.includes(feature)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateField('features', [...form.features, feature]);
                      } else {
                        updateField('features', form.features.filter((f) => f !== feature));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Seller Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
            <input
              type="text"
              value={form.sellerName}
              onChange={(e) => updateField('sellerName', e.target.value)}
              required
              minLength={2}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                value={form.sellerPhone}
                onChange={(e) => updateField('sellerPhone', e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 0722123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                value={form.sellerLocation}
                onChange={(e) => updateField('sellerLocation', e.target.value)}
                required
                minLength={2}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Nairobi"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Images</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label>
            <textarea
              value={form.images}
              onChange={(e) => updateField('images', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Submitting...' : 'Submit Listing'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sell/page.tsx
git commit -m "feat: add full vehicle listing form to sell page"
```

---

## Task 8: Listings API

**Files:**
- Create: `app/api/listings/route.ts`

- [ ] **Step 1: Create listings API**

```ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const listings = await db.listing.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      category,
      make,
      model,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      description,
      sellerName,
      sellerPhone,
      sellerLocation,
      features,
      images,
    } = body;

    // Validation
    if (!title || !category || !make || !model || !year || !price || 
        !fuelType || !transmission || !description || 
        !sellerName || !sellerPhone || !sellerLocation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const listing = await db.listing.create({
      data: {
        userId: session.user.id,
        title,
        category,
        make,
        model,
        year,
        price,
        mileage,
        fuelType,
        transmission,
        description,
        sellerName,
        sellerPhone,
        sellerLocation,
        features: features || '[]',
        images: images || '[]',
        status: 'pending',
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/listings/route.ts
git commit -m "feat: add listings API"
```

---

## Task 9: Update Dashboard Listings Page

**Files:**
- Modify: `app/dashboard/listings/page.tsx`

- [ ] **Step 1: Update listings page to show user listings**

```tsx
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ListingsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const listings = await db.listing.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link
          href="/sell"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Add New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't listed any vehicles yet.</p>
          <Link
            href="/sell"
            className="text-primary-600 hover:underline"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                {listing.images && JSON.parse(listing.images).length > 0 ? (
                  <img 
                    src={JSON.parse(listing.images)[0]} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{listing.title}</h3>
                <p className="text-gray-600">KSh {listing.price.toLocaleString()}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    listing.status === 'approved' ? 'bg-green-100 text-green-800' :
                    listing.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {listing.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/listings/page.tsx
git commit -m "feat: update listings page to show user listings"
```

---

## Task 10: Build & Test

**Files:**
- Run: `npm run build`

- [ ] **Step 1: Run build**

Run: `npm run build`

- [ ] **Step 2: Fix any errors**

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: complete password reset and sell form features"
```

---

## Summary

- ✅ Add PasswordResetToken and Listing models to Prisma
- ✅ Install Resend for email
- ✅ Create forgot-password page
- ✅ Create reset-password/[token] page
- ✅ Create forgot-password API
- ✅ Create reset-password API
- ✅ Create sell page with full form
- ✅ Create listings API
- ✅ Update dashboard listings page
- ✅ Build and test
