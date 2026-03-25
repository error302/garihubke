# Phase 6: Tier 1 Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended)

**Goal:** Add Admin Dashboard, Email Notifications, and In-App Notifications

**Architecture:** Admin pages in /app/admin, notifications with bell/dropdown, email via Resend

**Tech Stack:** Next.js, TanStack Table, Resend, Prisma

---

## Tasks

### Task 1: Prisma Schema - Notification Model

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add Notification model**

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String   // message, listing, payment, saved_search
  title     String
  body      String
  link      String?
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

- [ ] **Step 2: Run prisma db push**

```bash
npx prisma db push
npx prisma generate
```

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add Notification model to Prisma schema"
```

---

### Task 2: Email Library

**Files:**
- Create: `lib/email.ts`

- [ ] **Step 1: Create lib/email.ts**

```typescript
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = 'GariHub <noreply@garihub.co.ke>';

export async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log('Email (mock):', { to, subject });
    return { success: true };
  }
  
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

export const emailTemplates = {
  paymentVerified: (userName: string, vehicleTitle: string) => ({
    subject: 'Payment Verified - GariHub',
    html: `<h1>Payment Verified</h1><p>Hi ${userName},</p><p>Your payment for ${vehicleTitle} has been verified. We'll notify you when your vehicle is ready for collection.</p>`,
  }),
  
  orderCleared: (userName: string, vehicleTitle: string) => ({
    subject: 'Vehicle Cleared - Ready for Collection',
    html: `<h1>Vehicle Cleared!</h1><p>Hi ${userName},</p><p>Your ${vehicleTitle} is now cleared and ready for collection at Mombasa port.</p>`,
  }),
  
  newMessage: (userName: string, senderName: string) => ({
    subject: 'New Message - GariHub',
    html: `<h1>New Message</h1><p>Hi ${userName},</p><p>You have a new message from ${senderName}.</p>`,
  }),
  
  welcome: (userName: string) => ({
    subject: 'Welcome to GariHub!',
    html: `<h1>Welcome!</h1><p>Hi ${userName},</p><p>Thank you for joining GariHub - Kenya's premier car marketplace.</p>`,
  }),
};
```

- [ ] **Step 2: Commit**

```bash
git add lib/email.ts
git commit -m "feat: add email utilities with templates"
```

---

### Task 3: Notifications API Routes

**Files:**
- Create: `app/api/notifications/route.ts`
- Create: `app/api/notifications/[id]/route.ts`

- [ ] **Step 1: Create app/api/notifications/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = await db.notification.count({
    where: { userId: session.user.id, read: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { notificationIds, markAllRead } = await req.json();

  if (markAllRead) {
    await db.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    });
  } else if (notificationIds) {
    await db.notification.updateMany({
      where: { id: { in: notificationIds }, userId: session.user.id },
      data: { read: true },
    });
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Create app/api/notifications/[id]/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await db.notification.delete({
    where: { id: params.id, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Create helper to create notifications**

```typescript
// lib/notifications.ts
import { db } from '@/lib/db';

export async function createNotification({
  userId,
  type,
  title,
  body,
  link,
}: {
  userId: string;
  type: string;
  title: string;
  body: string;
  link?: string;
}) {
  return db.notification.create({
    data: { userId, type, title, body, link },
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add app/api/notifications/
git add lib/notifications.ts
git commit -m "feat: add notifications API routes"
```

---

### Task 4: Notification Components

**Files:**
- Create: `components/notifications/NotificationBell.tsx`
- Create: `components/notifications/NotificationDropdown.tsx`
- Create: `components/notifications/NotificationItem.tsx`

- [ ] **Step 1: Create NotificationBell.tsx**

```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function NotificationBell() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/notifications')
        .then(res => res.json())
        .then(data => setUnreadCount(data.unreadCount || 0))
        .catch(console.error);
    }
  }, [session]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!session) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <Link
        href="/dashboard/notifications"
        className="relative p-2 text-gray-700 hover:text-primary-600"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Create NotificationDropdown.tsx**

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NotificationItem from './NotificationItem';

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications?.slice(0, 5) || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        <button onClick={markAllRead} className="text-sm text-primary-600 hover:underline">
          Mark all read
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="p-4 text-gray-500">No notifications</p>
        ) : (
          notifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </div>
      <Link href="/dashboard/notifications" className="block p-3 border-t text-center text-sm text-primary-600 hover:bg-gray-50">
        View all notifications
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Create NotificationItem.tsx**

```tsx
'use client';

import Link from 'next/link';

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    title: string;
    body: string;
    link?: string | null;
    read: boolean;
    createdAt: string;
  };
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const iconMap: Record<string, string> = {
    message: '💬',
    listing: '🚗',
    payment: '💳',
    saved_search: '🔍',
  };

  const content = (
    <div className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{iconMap[notification.type] || '🔔'}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>{notification.title}</p>
          <p className="text-xs text-gray-500 truncate">{notification.body}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(notification.createdAt).toLocaleDateString()}
          </p>
        </div>
        {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
      </div>
    </div>
  );

  if (notification.link) {
    return <Link href={notification.link}>{content}</Link>;
  }

  return content;
}
```

- [ ] **Step 4: Add NotificationBell to Navbar**

In `components/Navbar.tsx`, add the bell icon next to the user menu.

- [ ] **Step 5: Commit**

```bash
git add components/notifications/
git add components/Navbar.tsx
git commit -m "feat: add notification components and navbar integration"
```

---

### Task 5: Notifications Dashboard Page

**Files:**
- Create: `app/dashboard/notifications/page.tsx`

- [ ] **Step 1: Create page**

```tsx
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import NotificationItem from '@/components/notifications/NotificationItem';

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  const unreadCount = await db.notification.count({
    where: { userId: session.user.id, read: false },
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <span className="text-sm text-gray-500">{unreadCount} unread</span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow divide-y">
        {notifications.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No notifications yet</p>
        ) : (
          notifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/notifications/page.tsx
git commit -m "feat: add notifications dashboard page"
```

---

### Task 6: Admin Dashboard - Orders

**Files:**
- Create: `app/admin/orders/page.tsx`
- Create: `components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Create AdminSidebar.tsx**

```tsx
import Link from 'next/link';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/crsp', label: 'CRSP Data', icon: '📋' },
  { href: '/admin/tax-rates', label: 'Tax Rates', icon: '💰' },
  { href: '/admin/reports', label: 'Reports', icon: '📈' },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin</h2>
      <nav className="space-y-2">
        {adminLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Create app/admin/orders/page.tsx**

```tsx
import { db } from '@/lib/db';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminOrdersPage() {
  // Note: Need Order model - this is a placeholder
  // const orders = await db.order.findMany({ include: { user: true, car: true } });

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Order management - Order model needed
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/admin/AdminSidebar.tsx app/admin/orders/page.tsx
git commit -m "feat: add admin sidebar and orders page"
```

---

### Task 7: Admin Dashboard - Tax Rates

**Files:**
- Create: `app/admin/tax-rates/page.tsx`

- [ ] **Step 1: Create Tax Rates page**

```tsx
import { db } from '@/lib/db';
import AdminSidebar from '@/components/admin/AdminSidebar';

const taxRateCategories = [
  { key: 'importDuty', label: 'Import Duty', defaultRate: 25 },
  { key: 'vat', label: 'VAT', defaultRate: 16 },
  { key: 'idf', label: 'IDF', defaultRate: 3.5 },
  { key: 'rdl', label: 'RDL', defaultRate: 2 },
];

export default async function TaxRatesPage() {
  // In production, these would come from a TaxRate table
  // For now, display the default rates

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Tax Rates Configuration</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-6">
            Current tax rates (as per KRA guidelines). These rates are used in the import calculator.
          </p>

          <div className="grid gap-4">
            {taxRateCategories.map(rate => (
              <div key={rate.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{rate.label}</h3>
                  <p className="text-sm text-gray-500">Key: {rate.key}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary-600">{rate.defaultRate}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800">Note</h4>
            <p className="text-sm text-blue-600">
              Excise duty rates vary by engine capacity and fuel type. 
              They are configured in the calculator logic.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create other admin pages (simplified)**

```tsx
// app/admin/page.tsx - Dashboard overview
// app/admin/crsp/page.tsx - CRSP data upload
// app/admin/reports/page.tsx - Reports
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/
git commit -m "feat: add admin tax rates and dashboard pages"
```

---

### Task 8: Build and Verify

- [ ] **Step 1: Run build**

```bash
npm run build
```

- [ ] **Step 2: Fix any errors**

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: complete Tier 1 enhancements"
git push
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Prisma Notification model |
| 2 | Email library with templates |
| 3 | Notifications API routes |
| 4 | Notification components |
| 5 | Notifications dashboard page |
| 6 | Admin orders page |
| 7 | Admin tax rates page |
| 8 | Build and verify |
