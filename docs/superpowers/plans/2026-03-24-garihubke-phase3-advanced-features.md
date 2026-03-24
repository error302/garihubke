# GariHub Phase 3: Advanced Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add advanced search, contact/messaging system, and saved searches with notifications.

**Architecture:** Enhanced filters, DB-stored messages, saved search system with match tracking.

**Tech Stack:** Next.js 14, Prisma, SQLite, existing dependencies.

---

## File Structure

```
garihubke/
├── prisma/
│   └── schema.prisma          # Updated with Message, SavedSearch
├── app/
│   ├── api/
│   │   ├── messages/
│   │   │   └── route.ts       # Get/Send messages
│   │   └── saved-searches/
│   │       ├── route.ts       # Get/Create/Delete saved searches
│   │       └── check/
│   │           └── route.ts   # Check for new matches
│   └── dashboard/
│       ├── messages/
│       │   └── page.tsx       # Messages inbox
│       └── saved-searches/
│           └── page.tsx       # Saved searches management
├── components/
│   ├── search/
│   │   ├── AdvancedFilters.tsx # Enhanced filter panel
│   │   └── SearchSuggestions.tsx # Autocomplete
│   └── messaging/
│       ├── ContactForm.tsx    # Vehicle contact form
│       └── MessageList.tsx    # Messages display
└── lib/
    └── search.ts              # Search helper functions
```

---

## Task 1: Update Database Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add Message and SavedSearch models**

```prisma
model Message {
  id          String   @id @default(cuid())
  vehicleId   String
  senderId    String?
  senderName  String
  senderEmail String
  senderPhone String?
  content     String
  read        Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  vehicle     Vehicle  @relation(fields: [vehicleId], references: [id])
}

model SavedSearch {
  id          String   @id @default(cuid())
  userId      String
  name        String
  filters     String   // JSON string
  createdAt   DateTime @default(now())
  lastChecked DateTime @default(now())
}
```

Run: `npx prisma db push`

- [ ] **Step 2: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add Message and SavedSearch models"
```

---

## Task 2: Advanced Search Components

**Files:**
- Create: `components/search/AdvancedFilters.tsx`
- Modify: `components/FilterSidebar.tsx`

- [ ] **Step 1: Create AdvancedFilters.tsx**

Add to existing FilterSidebar:
- Mileage range inputs
- Seats dropdown
- Body type checkboxes
- Drivetrain checkboxes

- [ ] **Step 2: Update vehicles page to handle new filters**

- [ ] **Step 3: Commit**

---

## Task 3: Contact Form

**Files:**
- Create: `components/messaging/ContactForm.tsx`
- Create: `app/api/messages/route.ts`

- [ ] **Step 1: Create ContactForm.tsx**

```typescript
"use client";

interface ContactFormProps {
  vehicleId: string;
  vehicleTitle: string;
  sellerId?: string;
}

export function ContactForm({ vehicleId, vehicleTitle, sellerId }: ContactFormProps) {
  // Form with: name, email, phone, message
  // If logged in, pre-fill user data
  // Submit to /api/messages
}
```

- [ ] **Step 2: Create messages API**

```typescript
// GET /api/messages - get user's messages (as sender or receiver)
// POST /api/messages - send new message
// PATCH /api/messages/[id] - mark as read
// DELETE /api/messages/[id] - delete message
```

- [ ] **Step 3: Add ContactForm to vehicle details page**

- [ ] **Step 4: Commit**

---

## Task 4: Dashboard Messages Page

**Files:**
- Create: `app/dashboard/messages/page.tsx`
- Create: `components/messaging/MessageList.tsx`

- [ ] **Step 1: Create messages page**

- [ ] **Step 2: Commit**

---

## Task 5: Saved Searches

**Files:**
- Create: `app/api/saved-searches/route.ts`
- Create: `app/dashboard/saved-searches/page.tsx`
- Create: `components/search/SavedSearchCard.tsx`

- [ ] **Step 1: Create saved-searches API**

```typescript
// GET /api/saved-searches - list user's saved searches
// POST /api/saved-searches - create new saved search
// DELETE /api/saved-searches/[id] - delete saved search
```

- [ ] **Step 2: Create check for matches endpoint**

```typescript
// POST /api/saved-searches/check - check saved search against vehicles
// Returns count of new matches since last check
```

- [ ] **Step 3: Create saved searches dashboard page**

- [ ] **Step 4: Add "Save Search" button to vehicles page**

- [ ] **Step 5: Commit**

---

## Task 6: Notifications Badge

**Files:**
- Modify: `components/dashboard/Sidebar.tsx`

- [ ] **Step 1: Add unread message count badge**

- [ ] **Step 2: Add new matches badge to Saved Searches**

- [ ] **Step 3: Commit**

---

## Task 7: Build & Test

- [ ] **Step 1: Run build**

Run: `npm run build`

- [ ] **Step 2: Test all features**

- [ ] **Step 3: Commit**

---

## Summary

Phase 3 adds:
- ✅ Advanced filters (mileage, seats, body type, drivetrain)
- ✅ Contact form with messaging system
- ✅ Messages inbox in dashboard
- ✅ Saved searches with match tracking
- ✅ Notification badges
- ✅ All DB-based (no external services)
