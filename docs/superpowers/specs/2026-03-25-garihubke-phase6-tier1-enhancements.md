# Phase 6: Tier 1 Enhancements Specification

## Overview

Add Admin Dashboard, Email Notifications, and In-App Notifications to complete the platform features.

---

## 1. Admin Dashboard

### Prisma Schema Additions

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String   // message, listing, payment, saved_search
  title     String
  body      String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

### Pages

| Page | Purpose |
|------|---------|
| `/admin` | Dashboard overview |
| `/admin/orders` | Order management with filters |
| `/admin/crsp` | CRSP Excel upload |
| `/admin/tax-rates` | Tax rates editor |
| `/admin/reports` | Revenue and analytics |

### Components
- `AdminSidebar.tsx` - Admin navigation
- `OrderTable.tsx` - TanStack table with order list
- `CrspUploader.tsx` - Excel upload component
- `TaxRateEditor.tsx` - Inline tax rate editing

---

## 2. Email Notifications

### API Integration
- Use existing `resend` package
- Environment variable: `RESEND_API_KEY`

### Email Templates

| Template | Trigger |
|----------|---------|
| Order Payment Verified | Admin verifies payment |
| Order Cleared | Vehicle cleared at port |
| New Message | User receives message |
| New Listing Alert | Dealer posts new vehicle |
| Welcome Email | User registers |

### Implementation
- Create `lib/email.ts` with email sending utilities
- API route to trigger emails on events
- Queue system for bulk emails (optional)

---

## 3. In-App Notifications

### Components

| Component | Purpose |
|-----------|---------|
| `NotificationBell.tsx` | Bell icon with unread count in navbar |
| `NotificationDropdown.tsx` | Dropdown showing recent 5 notifications |
| `NotificationCenter.tsx` | Full page with all notifications |
| `NotificationItem.tsx` | Individual notification row |

### API Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/notifications | Get user notifications |
| PUT | /api/notifications | Mark as read |
| DELETE | /api/notifications/:id | Delete notification |

### Notification Types
- `NEW_MESSAGE` - New message from seller/buyer
- `LISTING_UPDATE` - Price change, status change
- `PAYMENT_STATUS` - Payment verified, cleared
- `SAVED_SEARCH_MATCH` - New vehicle matches saved search

---

## File Structure

```
/app
  /admin
    /page.tsx           # Dashboard
    /orders/page.tsx    # Order management
    /crsp/page.tsx      # CRSP upload
    /tax-rates/page.tsx # Tax rates editor
    /reports/page.tsx   # Reports

/components
  /admin
    AdminSidebar.tsx
    OrderTable.tsx
    CrspUploader.tsx
    TaxRateEditor.tsx
  /notifications
    NotificationBell.tsx
    NotificationDropdown.tsx
    NotificationItem.tsx

/lib
  email.ts              # Email sending utilities

/app/api/notifications
  /route.ts             # GET/PUT notifications
  /[id]/route.ts        # DELETE notification

/prisma
  schema.prisma         # Add Notification model
```

---

## Acceptance Criteria

### Admin Dashboard
- [ ] Admin can view all orders with status filters
- [ ] Admin can upload CRSP Excel file
- [ ] Admin can edit tax rates
- [ ] Admin can view revenue reports

### Email Notifications
- [ ] Payment verification sends email
- [ ] Order cleared sends email
- [ ] New message sends email
- [ ] Resend API integration works

### In-App Notifications
- [ ] Notification bell shows unread count
- [ ] Dropdown shows recent notifications
- [ ] User can mark as read
- [ ] Notification center shows all notifications
