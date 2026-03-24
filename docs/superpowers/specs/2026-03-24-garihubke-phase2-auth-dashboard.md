# GariHub Phase 2: User Authentication & Dashboard

## Overview

Phase 2 adds user authentication and a personal dashboard to GariHub. Users can sign up, log in, and manage their profile and saved favorites.

## Goals

1. Enable user accounts with email/password and Google OAuth
2. Provide personal dashboard for managing profile and favorites
3. Persist favorites to database (sync from localStorage)
4. Set up production-ready PostgreSQL with Supabase

## Tech Stack

- **Auth:** NextAuth.js v5
- **ORM:** Prisma
- **Database:** PostgreSQL (Supabase)
- **Validation:** Zod
- **Styling:** Tailwind CSS (existing)

## Supabase Setup

### Connection
- Use Supabase PostgreSQL connection string
- Format: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`

### Environment Variables
```
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
NEXTAUTH_SECRET="generate-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Database Schema (Prisma)

### Models

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?   // hashed, null if OAuth
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  favorites     Favorite[]
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  vehicleId String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, vehicleId])
}
```

## Pages

### 1. Login Page (`/login`)

**Layout:**
- Centered card (max-width: 400px)
- Logo at top
- Email/password form
- "Sign in with Google" button
- Link to register page
- "Forgot password?" link

**Fields:**
- Email (required, valid email format)
- Password (required, min 8 chars)

**Behavior:**
- Show errors inline
- Redirect to dashboard on success
- Loading state on button

### 2. Register Page (`/register`)

**Layout:**
- Centered card (max-width: 400px)
- Logo at top
- Registration form
- "Sign up with Google" button
- Link to login page

**Fields:**
- Name (required)
- Email (required, valid email, unique)
- Password (required, min 8 chars)
- Confirm Password (required, must match)

**Behavior:**
- Validate password match client-side
- Show "email already exists" if taken
- Auto-login after register, redirect to dashboard

### 3. Dashboard (`/dashboard`)

**Layout:**
- Sidebar navigation (desktop) / Tabs (mobile)
- Main content area

**Sections:**

**a) Profile Tab**
- Avatar (initials if no image)
- Editable name
- Email (read-only)
- "Change Password" button
- "Save Changes" button

**b) Password Change Modal**
- Current password
- New password (min 8 chars)
- Confirm new password
- "Update Password" button

**c) Favorites Tab**
- Grid of saved vehicles (from DB)
- Remove from favorites button on each card
- Empty state if no favorites
- "Sync from localStorage" button for existing users

**d) My Listings Tab (Placeholder)**
- "Coming Soon" message
- Brief description of future feature

### 4. Logout

- `/api/auth/signout` endpoint
- Clear session
- Redirect to homepage

## API Routes

### `POST /api/auth/register`
- Validate input with Zod
- Check if email exists
- Hash password with bcrypt
- Create user
- Return success/error

### `POST /api/auth/change-password`
- Verify current password
- Hash new password
- Update user
- Return success/error

### `GET /api/favorites`
- Get user's favorites from DB
- Return vehicle IDs

### `POST /api/favorites`
- Add vehicle to favorites
- Require authentication

### `DELETE /api/favorites/[vehicleId]`
- Remove vehicle from favorites
- Require authentication

### `POST /api/favorites/sync`
- Sync localStorage favorites to DB
- Merge with existing favorites
- Require authentication

## Components to Create

1. **AuthForm** - Reusable login/register form
2. **PasswordInput** - Password field with show/hide toggle
3. **DashboardSidebar** - Navigation component
4. **ProfileForm** - User profile editing
5. **PasswordChangeModal** - Change password dialog
6. **FavoriteCard** - Vehicle card with remove button

## Security Considerations

1. Passwords hashed with bcrypt (cost factor 12)
2. CSRF protection via NextAuth
3. Rate limiting on auth endpoints (optional)
4. Session validation on protected routes
5. SQL injection prevention via Prisma

## Acceptance Criteria

1. User can register with email/password
2. User can login with email/password
3. User can login with Google OAuth
4. User can view/edit profile name
5. User can change password
6. User can view saved favorites from DB
7. User can add/remove favorites (persisted to DB)
8. User can sync localStorage favorites to DB
9. Protected routes redirect to login
10. Logout clears session and redirects

## Migration from Phase 1

- Keep existing vehicle data
- Keep existing components
- Add auth-required wrapper for dashboard
- Sync favorites on first login
