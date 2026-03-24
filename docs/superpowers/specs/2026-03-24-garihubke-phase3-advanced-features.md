# GariHub Phase 3: Advanced Features

## Overview

Phase 3 adds advanced search, contact form with messaging, and saved searches with notifications.

## Goals

1. Enhanced search experience with more filters and options
2. Buyer-seller messaging system (stored in DB)
3. Saved searches with match notifications

## Tech Stack

- **Existing:** Next.js 14, Prisma, SQLite
- **New:** None required (all DB-based)

## Database Schema Updates

```prisma
// Add to existing schema

model Message {
  id          String   @id @default(cuid())
  vehicleId   String
  senderId    String
  receiverId  String
  content     String
  read        Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model SavedSearch {
  id          String   @id @default(cuid())
  userId      String
  name        String
  filters     String   // JSON string of filter criteria
  createdAt   DateTime @default(now())
  lastChecked DateTime @default(now())
}
```

## Features

### 1. Advanced Search

**New Filters:**
- Mileage range (min/max)
- Engine/Fuel efficiency
- Body type (SUV, sedan, pickup, etc.)
- Drivetrain (FWD, RWD, 4WD)
- Number of seats

**Search Enhancements:**
- Keyword search across title, make, model, description
- Recent searches history (localStorage)
- Search suggestions/autocomplete

**Sort Options:**
- Price (low/high)
- Newest first
- Mileage (low/high)
- Year (newest/oldest)

### 2. Contact Form / Messaging

**Buyer → Seller:**
- Contact form on vehicle details page
- Fields: name, email, phone, message
- Pre-filled with user info if logged in

**Seller Dashboard:**
- View messages received
- Mark as read/unread
- Reply functionality (opens email)
- Delete messages

**User Dashboard:**
- Messages sent history

### 3. Saved Searches

**Save Search:**
- Save current filter combination with custom name
- Requires login

**Saved Searches Page:**
- List all saved searches
- Delete saved searches
- Manual "Check for matches" button
- Show count of new matches

**Notifications:**
- Badge on "Saved Searches" in dashboard
- Count of vehicles matching each saved search
- "New!" indicator for new matches since last check

## Pages to Create/Update

1. **Enhanced `/vehicles`** - More filters, better UI
2. **`/dashboard/messages`** - Inbox for sellers
3. **`/dashboard/saved-searches`** - Manage saved searches
4. **Vehicle detail page** - Add contact form

## Acceptance Criteria

1. Users can filter by more criteria (mileage, seats, etc.)
2. Buyers can send messages to sellers
3. Sellers can view/reply to messages in dashboard
4. Users can save search filters
5. Saved searches show match counts
6. Notification badge appears when new matches found
7. All features work without additional external services
